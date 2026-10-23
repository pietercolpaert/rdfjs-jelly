import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError } from '../errors';
import { Message, type ParserOptions, type StreamOptions } from '../types';
import type { DecoderEvents } from './Decoder';
import { ColumnTermDecoder } from './ColumnTermDecoder';

type P = eu.ostrzyciel.jelly.core.proto.v1.RdfStreamFrame;
type C = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn;
type I = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
function fail(message: string): never { throw new JellyConformanceError(message); }

/** The column layout has independent IRI inference sequences and message boundaries. */
export class ColumnDecoder extends ColumnTermDecoder {
  public streamOptions?: StreamOptions;
  public readonly namespaces: Record<string, RDF.NamedNode> = Object.create(null);
  private current: RDF.Quad[] = [];
  private counter = 0;
  private readonly blankNodes = new Map<string, RDF.BlankNode>();
  private readonly usedBlankLabels = new Set<string>();

  public constructor(options: ParserOptions, private readonly events: DecoderEvents) { super(options); }

  public decode(frame: P): Message[] {
    const out: Message[] = [];
    const metadata = new Map(Object.entries(frame.metadata).map(([k, v]) => [k, new Uint8Array(v)]));
    const endMessage = (): void => {
      out.push(new Message(this.counter++, this.current, metadata));
      this.current = [];
    };
    if (frame.rows.length > 1) fail('Column layout permits only one options row per frame');
    for (const row of frame.rows) {
      const kind = (row as typeof row & { $row?: string }).$row ?? row.row;
      if (kind !== 'options') fail('Row layout data is invalid in a column stream');
      const raw = row.options as unknown as StreamOptions & { streamType: number; rdfVersion: number };
      const old = this.streamOptions;
      if (raw.version !== 3) fail('Cannot change Jelly layout within a stream');
      if (raw.generalizedStatements || raw.rdfStar || raw.logicalType) fail('Row layout options are invalid in a column stream');
      if (raw.physicalType !== 1 && raw.physicalType !== 2) fail('Column streams require physical type TRIPLES or QUADS');
      if (raw.streamType !== 0 && raw.streamType !== 1) fail(`Unknown RDF stream type ${raw.streamType}`);
      if (raw.rdfVersion < 0 || raw.rdfVersion > 3) fail(`Unknown RDF version ${raw.rdfVersion}`);
      if (old && (raw.physicalType !== old.physicalType || raw.streamType !== old.streamType)) fail('Restated options must preserve physical type, stream type, and version');
      if (old?.streamType === 1) {
        if (this.current.length) endMessage();
        this.blankNodes.clear();
      }
      this.resetLookups(raw);
      this.streamOptions = {
        streamName: raw.streamName, physicalType: raw.physicalType, logicalType: 0, generalizedStatements: false, rdfStar: false,
        maxNameTableSize: raw.maxNameTableSize, maxPrefixTableSize: raw.maxPrefixTableSize, maxDatatypeTableSize: raw.maxDatatypeTableSize,
        version: 3, streamType: raw.streamType, rdfVersion: raw.rdfVersion,
      };
      this.events.options?.(this.streamOptions);
    }
    const b = frame.columns as eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch | null;
    if (!b) return out;
    if (!this.streamOptions) fail('Column batch before stream options');
    const n = b.rowCount;
    this.checkRowCount(n);
    this.applyLookups([[b.names, this.names], [b.prefixes, this.prefixes], [b.datatypes, this.datatypes]]);
    const nsState = [0, 0];
    for (const rawNs of b.namespaces) {
      const ns = rawNs as eu.ostrzyciel.jelly.core.proto.v1.RdfNamespaceDeclaration;
      const term = this.iri((ns.value ?? {}) as I, nsState);
      this.namespaces[ns.name] = term;
      this.events.namespace?.(ns.name, term);
    }
    if (this.streamOptions.physicalType === 1 && b.graphs) fail('Graphs column in a TRIPLES stream');
    const columns = [b.subjects, b.predicates, b.objects, b.graphs].map(c => this.column(c as C | null, n));
    const lengths = b.messageLengths;
    if (this.streamOptions.streamType === 0 && lengths.length) fail('Message boundaries in a FLAT stream');
    if (lengths.reduce((sum, v) => sum + v, 0) > n) fail('Message lengths exceed row_count');
    let pos = 0;
    const append = (count: number): void => {
      for (const end = pos + count; pos < end; pos++) {
        // Remap blank nodes per logical message, including those in triple terms.
        const [s, p, o, g] = columns.map(c => c[pos]);
        if (!s || (s.termType !== 'NamedNode' && s.termType !== 'BlankNode')) fail('Invalid or unbound subject in column');
        if (!p || p.termType !== 'NamedNode') fail('Invalid or unbound predicate in column');
        if (!o) fail('Unbound object in column');
        if (g && g.termType !== 'NamedNode' && g.termType !== 'BlankNode') fail('Invalid graph in column');
        this.current.push(this.factory.quad(this.scoped(s) as RDF.Quad_Subject, p, this.scoped(o) as RDF.Quad_Object, g ? this.scoped(g) as RDF.Quad_Graph : this.factory.defaultGraph()));
      }
    };
    for (const length of lengths) {
      append(length);
      endMessage();
      this.blankNodes.clear();
    }
    append(n - pos);
    // FLAT streams expose batches through the existing message API; only
    // MESSAGES streams retain an unfinished message across frame boundaries.
    if (this.streamOptions.streamType === 0) endMessage();
    return out;
  }

  public finish(): Message[] {
    if (!this.streamOptions) fail('No Jelly stream options row was found');
    if (!this.current.length) return [];
    const out = new Message(this.counter++, this.current);
    this.current = [];
    return [out];
  }

  private scoped(term: RDF.Term): RDF.Term {
    if (this.streamOptions!.streamType !== 1) return term;
    if (term.termType === 'Quad') return this.factory.quad(this.scoped(term.subject) as RDF.Quad_Subject, term.predicate as RDF.Quad_Predicate, this.scoped(term.object) as RDF.Quad_Object);
    if (term.termType !== 'BlankNode') return term;
    let node = this.blankNodes.get(term.value);
    if (!node) {
      // Preserve labels in their first scope, and allocate unique labels later.
      let label = term.value;
      while (this.usedBlankLabels.has(label)) label = `jelly${this.counter}_${label}`;
      this.usedBlankLabels.add(label);
      node = this.factory.blankNode(label);
      this.blankNodes.set(term.value, node);
    }
    return node;
  }
}
