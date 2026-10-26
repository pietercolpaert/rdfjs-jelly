import type { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError } from '../errors';
import { RDF_DIR_LANG_STRING, RDF_LANG_STRING, XSD_STRING } from '../options';
import type { LookupDecoder } from './LookupDecoder';
import type { ColumnValueReader } from './ColumnTermDecoder';
import { DEFAULT_GRAPH_VALUE, type TermValue } from './QuadFilter';

type T = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm;
type I = eu.ostrzyciel.jelly.core.proto.v1.RdfIri;
type L = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral;
function fail(message: string): never { throw new JellyConformanceError(message); }

/** Decode and validate column values without constructing RDF/JS terms. */
export class ColumnValueDecoder implements ColumnValueReader<TermValue> {
  private readonly datatypeValues: Array<{ termType: 'NamedNode'; value: string } | undefined> = [];
  private readonly simpleDatatype = { termType: 'NamedNode', value: XSD_STRING } as const;
  private readonly languageDatatype = { termType: 'NamedNode', value: RDF_LANG_STRING } as const;
  private readonly directionalDatatype = { termType: 'NamedNode', value: RDF_DIR_LANG_STRING } as const;
  private readonly iris: Array<TermValue | undefined> = [];
  public constructor(
    private readonly names: LookupDecoder, private readonly prefixes: LookupDecoder,
    private readonly datatypes: LookupDecoder,
  ) {}

  public iri(prefix: number, name: number, create = true): TermValue | undefined {
    const prefixValue = prefix ? this.prefixes.datatype(prefix) : '';
    const nameValue = this.names.datatype(name);
    if (!create) return undefined;
    const value = prefixValue + nameValue;
    const cached = this.iris[name];
    if (cached?.termType === 'NamedNode' && cached.value === value) return cached;
    return this.iris[name] = { termType: 'NamedNode', value };
  }

  public literal(value: string, language?: string, direction = 0, datatype?: number, create = true): TermValue | undefined {
    if (direction < 0 || direction > 2) fail(`Unknown base direction ${direction}`);
    if (direction && language === undefined) fail('Base direction requires a language tag');
    let datatypeValue: { termType: 'NamedNode'; value: string } = direction ? this.directionalDatatype : language ? this.languageDatatype : this.simpleDatatype;
    if (datatype !== undefined) {
      const value = this.datatypes.datatype(datatype);
      if (value === RDF_LANG_STRING || value === RDF_DIR_LANG_STRING) fail('Language datatypes require a language tag');
      if (!create) return undefined;
      const cached = this.datatypeValues[datatype];
      datatypeValue = cached?.value === value ? cached : this.datatypeValues[datatype] = { termType: 'NamedNode', value };
    }
    if (!create) return undefined;
    return { termType: 'Literal', value, language: (language ?? '').toLowerCase(),
      direction: direction ? direction === 1 ? 'ltr' : 'rtl' : undefined, datatype: datatypeValue };
  }

  public blank(value: string, create = true): TermValue | undefined { return create ? { termType: 'BlankNode', value } : undefined; }

  private inferredIri(value: I, state: number[], create: boolean): TermValue | undefined {
    state[0] = value.prefixId || state[0]!;
    state[1] = value.nameId || state[1]! + 1;
    return this.iri(state[0]!, state[1]!, create);
  }

  public triple(t: T, state: number[], depth = 1, create = true): TermValue | undefined {
    if (depth > 64) fail('Triple terms nested too deeply');
    const marked = t as T & { $subject?: string; $object?: string };
    const sk = marked.$subject ?? t.subject, ok = marked.$object ?? t.object;
    const subject = sk === 'sIri' ? this.inferredIri(t.sIri as I, state, create)
      : sk === 'sBnode' ? this.blank(t.sBnode!, create) : fail('Missing triple term subject');
    if (!t.pIri) fail('Missing triple term predicate');
    const predicate = this.inferredIri(t.pIri as I, state, create);
    let object: TermValue | undefined;
    if (ok === 'oIri') object = this.inferredIri(t.oIri as I, state, create);
    else if (ok === 'oBnode') object = this.blank(t.oBnode!, create);
    else if (ok === 'oTripleTerm') object = this.triple(t.oTripleTerm as T, state, depth + 1, create);
    else if (ok === 'oLiteral') {
      const l = t.oLiteral as L;
      const kind = (l as L & { $literalKind?: string }).$literalKind ?? l.literalKind;
      object = this.literal(l.lex, kind === 'langtag' ? l.langtag! : undefined, l.direction, kind === 'datatype' ? l.datatype! : undefined, create);
    } else return fail('Missing triple term object');
    return create ? { termType: 'Quad', subject: subject!, predicate: predicate!, object: object!, graph: DEFAULT_GRAPH_VALUE } : undefined;
  }
}
