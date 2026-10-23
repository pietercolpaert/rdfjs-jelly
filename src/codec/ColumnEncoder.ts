import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import type { RdfStreamFrame } from '../generated/rdf_pb';
import { JellyConformanceError, JellyUnsupportedFeatureError } from '../errors';
import { normalizeLookupPreset, RDF_DIR_LANG_STRING, RDF_LANG_STRING, XSD_STRING, type LookupPreset } from '../options';
import { PhysicalStreamType, RdfStreamType, RdfVersion, type WriterOptions, type MessageMetadata } from '../types';

type Column = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties;
type Triple = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties;
type Literal = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties;
const proto = eu.ostrzyciel.jelly.core.proto.v1;

/** Batches own their lookup working set; entries can never be evicted mid-batch. */
export class ColumnEncoder {
  public readonly frames: RdfStreamFrame[] = [];
  public readonly physicalType: PhysicalStreamType;
  public readonly lookup: LookupPreset;
  private readonly size: number;
  private readonly streamType: RdfStreamType;
  private readonly rdfVersion: RdfVersion;
  private readonly tables = [new Map<string, number>(), new Map<string, number>()];
  private quads: RDF.Quad[] = [];
  private namespaces: Array<[string, string]> = [];
  private first = true;
  private finished = false;
  private inMessage = false;

  public constructor(private readonly options: WriterOptions, private readonly sink?: (frame: RdfStreamFrame) => void) {
    this.physicalType = options.physicalType ?? PhysicalStreamType.QUADS;
    if (this.physicalType !== 1 && this.physicalType !== 2) throw new JellyConformanceError('Jelly 1.2 requires TRIPLES or QUADS; use QUADS for named graphs');
    if (options.logicalType) throw new JellyConformanceError('Jelly 1.2 uses streamType instead of logicalType');
    this.streamType = options.streamType ?? RdfStreamType.FLAT;
    this.rdfVersion = options.rdfVersion ?? RdfVersion.RDF_1_2;
    if (![0, 1].includes(this.streamType) || ![0, 1, 2, 3].includes(this.rdfVersion)) throw new JellyConformanceError('Invalid streamType or rdfVersion');
    this.lookup = normalizeLookupPreset(options.lookup);
    if (this.lookup.maxNames < 128) throw new JellyConformanceError('Jelly 1.2 requires a name lookup size of at least 128');
    this.size = options.messageSize ?? 250;
    if (!Number.isInteger(this.size) || this.size < 1 || this.size > 0x7ffffff) throw new JellyConformanceError('messageSize must be between 1 and 2^27 - 1');
  }
  private assertOpen(): void { if (this.finished) throw new JellyConformanceError('Jelly encoder has already ended'); }
  public addNamespace(name: string, iri: string): void {
    this.assertOpen();
    this.fit([iri], []);
    this.tables[0]!.set(iri, this.tables[0]!.get(iri) ?? this.tables[0]!.size + 1);
    this.namespaces.push([name, iri]);
  }
  public addQuad(quad: RDF.Quad): void {
    this.assertOpen();
    if (this.streamType === 1 && !this.inMessage) throw new JellyConformanceError('Use addMessage() or message counters with streamType MESSAGES');
    if (this.physicalType === 1 && quad.graph.termType !== 'DefaultGraph') throw new JellyConformanceError('TRIPLES streams cannot contain named graph quads');
    if (!['NamedNode', 'BlankNode', 'Literal', 'Quad'].includes(quad.object.termType)) throw new JellyConformanceError('Invalid RDF object');
    if (!['NamedNode', 'BlankNode'].includes(quad.subject.termType) || quad.predicate.termType !== 'NamedNode' || !['DefaultGraph', 'NamedNode', 'BlankNode'].includes(quad.graph.termType)) throw new JellyConformanceError('Invalid RDF statement');
    const names: string[] = [], datatypes: string[] = [];
    for (const term of [quad.subject, quad.predicate, quad.object, quad.graph]) this.keys(term, names, datatypes);
    if (this.quads.length >= this.size) this.flush();
    this.fit(names, datatypes);
    for (const [values, table] of [[names, this.tables[0]!], [datatypes, this.tables[1]!]] as const) for (const value of values) if (!table.has(value)) table.set(value, table.size + 1);
    this.quads.push(quad);
  }
  public addMessage(quads: Iterable<RDF.Quad>, metadata?: MessageMetadata): void {
    this.assertOpen();
    if (this.streamType !== 1) throw new JellyConformanceError('Jelly 1.2 addMessage() requires streamType MESSAGES');
    this.inMessage = true;
    try { for (const quad of quads) this.addQuad(quad); this.flush(metadata, true); }
    finally { this.inMessage = false; }
  }
  public addGraph(_graph: RDF.Quad_Graph, _quads: Iterable<RDF.Quad>, _metadata?: MessageMetadata): void {
    throw new JellyUnsupportedFeatureError('Jelly 1.2 has no GRAPHS layout; use QUADS and addMessage()');
  }
  public finish(): readonly RdfStreamFrame[] {
    this.assertOpen();
    if (this.first || this.quads.length || this.namespaces.length) this.flush();
    this.finished = true;
    return this.frames;
  }
  private fit(names: string[], datatypes: string[]): void {
    const fits = (): boolean => [names, datatypes].every((values, i) => new Set([...this.tables[i]!.keys(), ...values]).size <= (i === 0 ? this.lookup.maxNames : this.lookup.maxDatatypes));
    if (!fits()) this.flush();
    if (!fits()) throw new JellyConformanceError('A single statement does not fit in the configured lookup tables');
  }
  private keys(term: RDF.Term, names: string[], datatypes: string[], depth = 0): void {
    if (term.termType === 'NamedNode') names.push(term.value);
    else if (term.termType === 'Literal') {
      if (term.direction && (!term.language || !['ltr', 'rtl'].includes(term.direction))) throw new JellyConformanceError('Invalid directional language literal');
      if (term.direction && this.rdfVersion === 1) throw new JellyConformanceError('RDF 1.1 does not allow base directions');
      if (!term.language && term.datatype.value !== XSD_STRING) {
        if ([RDF_LANG_STRING, RDF_DIR_LANG_STRING].includes(term.datatype.value)) throw new JellyConformanceError('Language datatypes require a language tag');
        datatypes.push(term.datatype.value);
      }
    } else if (term.termType === 'Quad') {
      if (this.rdfVersion === 1 || this.rdfVersion === 2) throw new JellyConformanceError('Declared RDF version does not allow triple terms');
      if (depth >= 64) throw new JellyConformanceError('Triple terms nested too deeply');
      if (!['NamedNode', 'BlankNode', 'Literal', 'Quad'].includes(term.object.termType)) throw new JellyConformanceError('Invalid triple term object');
      if (!['NamedNode', 'BlankNode'].includes(term.subject.termType) || term.predicate.termType !== 'NamedNode' || term.graph.termType !== 'DefaultGraph') throw new JellyConformanceError('Invalid RDF 1.2 triple term');
      for (const value of [term.subject, term.predicate, term.object]) this.keys(value, names, datatypes, depth + 1);
    } else if (!['BlankNode', 'DefaultGraph'].includes(term.termType)) throw new JellyConformanceError(`Invalid RDF term ${term.termType}`);
  }
  private literal(term: RDF.Literal): Literal {
    if (term.language) return { lex: term.value, langtag: term.language, direction: term.direction === 'ltr' ? 1 : term.direction === 'rtl' ? 2 : 0 };
    return term.datatype.value === XSD_STRING ? { lex: term.value } : { lex: term.value, datatype: this.tables[1]!.get(term.datatype.value)! };
  }
  private triple(term: RDF.Quad): Triple {
    const out: Triple = { pIri: { nameId: this.tables[0]!.get(term.predicate.value)! } };
    if (term.subject.termType === 'NamedNode') out.sIri = { nameId: this.tables[0]!.get(term.subject.value)! };
    else out.sBnode = term.subject.value;
    const o = term.object;
    if (o.termType === 'NamedNode') out.oIri = { nameId: this.tables[0]!.get(o.value)! };
    else if (o.termType === 'BlankNode') out.oBnode = o.value;
    else if (o.termType === 'Literal') out.oLiteral = this.literal(o);
    else if (o.termType === 'Quad') out.oTripleTerm = this.triple(o as RDF.Quad);
    return out;
  }
  private column(terms: RDF.Term[]): Column {
    const c = new proto.RdfColumn();
    const kinds: number[] = [];
    let skip = 0;
    for (let i = 0; i < terms.length;) {
      const term = terms[i]!;
      let end = i + 1;
      while (end < terms.length && term.equals(terms[end]!)) end++;
      const count = end - i;
      const unbound = term.termType === 'DefaultGraph';
      if (unbound || count > 1) {
        const length = count - (unbound ? 1 : 2);
        c.layouts.push(skip * 32 + (unbound ? 16 : 0) + Math.min(length, 15));
        if (length >= 15) c.layouts.push(length - 15);
        skip = 0;
      } else skip++;
      if (!unbound) {
        if (term.termType === 'NamedNode') { kinds.push(0); c.nameIds.push(this.tables[0]!.get(term.value)!); }
        else if (term.termType === 'BlankNode') { kinds.push(2); c.bnodes.push(term.value); }
        else if (term.termType === 'Quad') { kinds.push(3); c.tripleTerms.push(this.triple(term as RDF.Quad)); }
        else if (term.termType === 'Literal') {
          kinds.push(1); c.lexValues.push(term.value);
          if (term.language) {
            const dir = term.direction === 'ltr' ? 1 : term.direction === 'rtl' ? 2 : 0;
            let index = c.langtags.findIndex((tag, j) => tag === term.language && c.langtagDirections[j] === dir);
            if (index < 0) { index = c.langtags.length; c.langtags.push(term.language); c.langtagDirections.push(dir); }
            c.literalKinds.push((index + 1) * 2);
          } else c.literalKinds.push(term.datatype.value === XSD_STRING ? 0 : this.tables[1]!.get(term.datatype.value)! * 2 - 1);
        }
      }
      i = end;
    }
    if (new Set(kinds).size > 1) {
      c.kinds = new Uint8Array(Math.ceil(kinds.length / 4));
      kinds.forEach((kind, i) => { c.kinds[i >> 2]! |= kind << (2 * (i & 3)); });
    }
    if (c.literalKinds.every(v => v === 0)) c.literalKinds = [];
    else if (new Set(c.literalKinds).size === 1) c.literalKinds = [c.literalKinds[0]!];
    if (c.langtagDirections.every(v => v === 0)) c.langtagDirections = [];
    return c;
  }
  private flush(metadata?: MessageMetadata, boundary = false): void {
    const columns: eu.ostrzyciel.jelly.core.proto.v1.RdfColumnBatch.$Properties = {
      rowCount: this.quads.length,
      names: this.tables[0]!.size ? [{ id: 1, values: [...this.tables[0]!.keys()] }] : [],
      datatypes: this.tables[1]!.size ? [{ id: 1, values: [...this.tables[1]!.keys()] }] : [],
      namespaces: this.namespaces.map(([name, iri]) => ({ name, value: { nameId: this.tables[0]!.get(iri)! } })),
      subjects: this.column(this.quads.map(q => q.subject)), predicates: this.column(this.quads.map(q => q.predicate)), objects: this.column(this.quads.map(q => q.object)),
      ...(this.physicalType === 2 ? { graphs: this.column(this.quads.map(q => q.graph)) } : {}),
      messageLengths: boundary ? [this.quads.length] : [],
    };
    const frame: RdfStreamFrame = { rows: this.first ? [{ case: 'options', value: {
      streamName: this.options.streamName ?? '', physicalType: this.physicalType, generalizedStatements: false, rdfStar: false, logicalType: 0,
      streamType: this.streamType, rdfVersion: this.rdfVersion, maxNameTableSize: this.lookup.maxNames, maxPrefixTableSize: this.lookup.maxPrefixes, maxDatatypeTableSize: this.lookup.maxDatatypes, version: 3,
    } }] : [], columns, metadata: metadata instanceof Map ? new Map(metadata) : new Map(Object.entries(metadata ?? {})) };
    if (this.sink) this.sink(frame); else this.frames.push(frame);
    this.first = false;
    this.quads = []; this.namespaces = [];
    for (const table of this.tables) table.clear();
  }
}
