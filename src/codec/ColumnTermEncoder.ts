import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError } from '../errors';
import { RDF_DIR_LANG_STRING, RDF_LANG_STRING, XSD_STRING, type LookupPreset } from '../options';
import { RdfVersion } from '../types';

type Column = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties;
type Triple = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties;
type Literal = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties;
const proto = eu.ostrzyciel.jelly.core.proto.v1;

/** Shared term collection and column encoding for both Jelly formats. */
export class ColumnTermEncoder {
  protected readonly tables = [new Map<string, number>(), new Map<string, number>()];
  private readonly pendingKeys = new Set<string>();
  public constructor(protected readonly rdfVersion: RdfVersion) {}
  /** Check only the incoming keys; never copy the accumulated batch tables. */
  protected workingSetFits(names: readonly string[], datatypes: readonly string[], lookup: LookupPreset): boolean {
    return this.tableFits(this.tables[0]!, names, lookup.maxNames) &&
      this.tableFits(this.tables[1]!, datatypes, lookup.maxDatatypes);
  }
  private tableFits(table: ReadonlyMap<string, number>, values: readonly string[], capacity: number): boolean {
    this.pendingKeys.clear();
    // Even if every incoming key is new, there is enough room.
    if (table.size + values.length <= capacity) return true;
    let remaining = capacity - table.size;
    for (const value of values) {
      if (table.has(value) || this.pendingKeys.has(value)) continue;
      if (remaining-- === 0) return false;
      this.pendingKeys.add(value);
    }
    return true;
  }
  protected keys(term: RDF.Term, names: string[], datatypes: string[], depth = 0): void {
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
  protected literal(term: RDF.Literal): Literal {
    if (term.language) return { lex: term.value, langtag: term.language, direction: term.direction === 'ltr' ? 1 : term.direction === 'rtl' ? 2 : 0 };
    return term.datatype.value === XSD_STRING ? { lex: term.value } : { lex: term.value, datatype: this.tables[1]!.get(term.datatype.value)! };
  }
  protected triple(term: RDF.Quad): Triple {
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
  protected column(terms: RDF.Term[]): Column {
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
}
