import type * as RDF from '@rdfjs/types';
import { eu } from '../generated/proto/rdf_pb.mjs';
import { JellyConformanceError } from '../errors';
import { RDF_DIR_LANG_STRING, RDF_LANG_STRING, XSD_STRING, type LookupPreset } from '../options';
import { RdfVersion } from '../types';

type Column = eu.ostrzyciel.jelly.core.proto.v1.RdfColumn.$Properties;
type Triple = eu.ostrzyciel.jelly.core.proto.v1.RdfTripleTerm.$Properties;
type Literal = eu.ostrzyciel.jelly.core.proto.v1.RdfLiteral.$Properties;
const proto = eu.ostrzyciel.jelly.core.proto.v1;

/** An IRI split into a prefix and a name, and its ids in the batch that last registered it. */
export interface IriRef {
  readonly prefix: string;
  readonly name: string;
  /** Batch whose tables `prefixId` and `nameId` refer to. */
  batch: number;
  prefixId: number;
  nameId: number;
}

/** Splits like the row layout: after the last `#`, else after the last `/`. */
function splitIri(iri: string): { prefix: string; name: string } {
  const hash = iri.lastIndexOf('#');
  const at = hash >= 0 ? hash : iri.lastIndexOf('/');
  return at >= 0 ? { prefix: iri.slice(0, at + 1), name: iri.slice(at + 1) } : { prefix: '', name: iri };
}

/** Splits cached across batches are dropped at a batch boundary once there are this many. */
const MAX_CACHED_SPLITS = 8_192;

/** Shared term collection and column encoding for both Jelly formats. */
export class ColumnTermEncoder {
  protected readonly tables = [new Map<string, number>(), new Map<string, number>()];
  private readonly pendingKeys = new Set<string>();
  /** Split IRIs, kept across batches; only used when `splitIris` is set. */
  protected readonly iriRefs = new Map<string, IriRef>();
  /** Batch counter: a ref is registered in the current batch when its stamp equals it. */
  protected batchNo = 1;
  /** The ref of the IRI most recently passed to `keyIri`. */
  protected lastRef?: IriRef;
  /** IRIs of the row being added that its batch has not registered yet. */
  protected readonly rowRefs: IriRef[] = [];
  public constructor(protected readonly rdfVersion: RdfVersion, protected readonly splitIris = false) {}
  /** Starts a new batch: refs registered so far no longer refer to live tables. */
  protected nextBatch(): void {
    this.batchNo++;
    if (this.iriRefs.size >= MAX_CACHED_SPLITS) this.iriRefs.clear();
  }
  protected refOf(iri: string): IriRef {
    let ref = this.iriRefs.get(iri);
    if (!ref) {
      const { prefix, name } = splitIri(iri);
      ref = { prefix, name, batch: 0, prefixId: 0, nameId: 0 };
      this.iriRefs.set(iri, ref);
    }
    return ref;
  }
  /** Check only the incoming keys; never copy the accumulated batch tables. */
  protected workingSetFits(names: readonly string[], datatypes: readonly string[], lookup: LookupPreset): boolean {
    return this.tableFits(this.tables[0]!, names, lookup.maxNames) &&
      this.tableFits(this.tables[1]!, datatypes, lookup.maxDatatypes);
  }
  /** Ids of names and datatypes; writers with their own dictionaries override these. */
  protected nameId(iri: string): number { return this.tables[0]!.get(iri)!; }
  protected datatypeId(iri: string): number { return this.tables[1]!.get(iri)!; }
  private tableFits(table: ReadonlyMap<string, number>, values: readonly string[], capacity: number): boolean {
    // Even if every incoming key is new, there is enough room.
    if (table.size + values.length <= capacity) return true;
    this.pendingKeys.clear();
    let remaining = capacity - table.size;
    for (const value of values) {
      if (table.has(value) || this.pendingKeys.has(value)) continue;
      if (remaining-- === 0) return false;
      this.pendingKeys.add(value);
    }
    return true;
  }
  /** Collects what an IRI adds to the batch tables. */
  protected keyIri(iri: string, names: string[]): void {
    if (!this.splitIris) { names.push(iri); return; }
    const ref = this.lastRef = this.refOf(iri);
    // Already registered in this batch: its name and prefix are in the dictionaries.
    if (ref.batch !== this.batchNo) this.rowRefs.push(ref);
  }
  protected keys(term: RDF.Term, names: string[], datatypes: string[], depth = 0): void {
    if (term.termType === 'NamedNode') this.keyIri(term.value, names);
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
    return term.datatype.value === XSD_STRING ? { lex: term.value } : { lex: term.value, datatype: this.datatypeId(term.datatype.value) };
  }
  /** An IRI with explicit ids, which stay valid whatever IRI preceded it. */
  protected iriProperties(iri: string): { nameId: number; prefixId?: number } {
    if (!this.splitIris) return { nameId: this.nameId(iri) };
    const ref = this.iriRefs.get(iri)!;
    return { prefixId: ref.prefixId, nameId: ref.nameId };
  }
  protected triple(term: RDF.Quad): Triple {
    const out: Triple = { pIri: this.iriProperties(term.predicate.value) };
    if (term.subject.termType === 'NamedNode') out.sIri = this.iriProperties(term.subject.value);
    else out.sBnode = term.subject.value;
    const o = term.object;
    if (o.termType === 'NamedNode') out.oIri = this.iriProperties(o.value);
    else if (o.termType === 'BlankNode') out.oBnode = o.value;
    else if (o.termType === 'Literal') out.oLiteral = this.literal(o);
    else if (o.termType === 'Quad') out.oTripleTerm = this.triple(o as RDF.Quad);
    return out;
  }
  /** `refs` optionally holds each term's IriRef, saving a lookup per IRI. */
  protected column(terms: RDF.Term[], refs?: Array<IriRef | undefined>): Column {
    const c = new proto.RdfColumn();
    const kinds: number[] = [];
    let kindMask = 0;
    let skip = 0;
    const prefixIds: number[] = [];
    let lastNameId = 0;
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
        if (term.termType === 'NamedNode') {
          kinds.push(0);
          if (!this.splitIris) c.nameIds.push(this.nameId(term.value));
          else {
            const ref = refs ? refs[i]! : this.iriRefs.get(term.value)!;
            // Zero means previous name id + 1 within this column.
            c.nameIds.push(ref.nameId === lastNameId + 1 ? 0 : ref.nameId);
            lastNameId = ref.nameId;
            prefixIds.push(ref.prefixId);
          }
        }
        else if (term.termType === 'BlankNode') { kinds.push(2); c.bnodes.push(term.value); }
        else if (term.termType === 'Quad') { kinds.push(3); c.tripleTerms.push(this.triple(term as RDF.Quad)); }
        else if (term.termType === 'Literal') {
          kinds.push(1); c.lexValues.push(term.value);
          if (term.language) {
            const dir = term.direction === 'ltr' ? 1 : term.direction === 'rtl' ? 2 : 0;
            let index = c.langtags.findIndex((tag, j) => tag === term.language && c.langtagDirections[j] === dir);
            if (index < 0) { index = c.langtags.length; c.langtags.push(term.language); c.langtagDirections.push(dir); }
            c.literalKinds.push((index + 1) * 2);
          } else c.literalKinds.push(term.datatype.value === XSD_STRING ? 0 : this.datatypeId(term.datatype.value) * 2 - 1);
        }
      }
      i = end;
    }
    if (prefixIds.length) {
      const first = prefixIds[0]!;
      // One id covers a column whose IRIs share a prefix; otherwise zero repeats the previous id.
      c.prefixIds = prefixIds.every(id => id === first) ? [first] : prefixIds.map((id, i) => i && id === prefixIds[i - 1] ? 0 : id);
    }
    for (const kind of kinds) kindMask |= 1 << kind;
    if (kindMask & (kindMask - 1)) {
      c.kinds = new Uint8Array(Math.ceil(kinds.length / 4));
      kinds.forEach((kind, i) => { c.kinds[i >> 2]! |= kind << (2 * (i & 3)); });
    }
    if (c.literalKinds.every(v => v === 0)) c.literalKinds = [];
    else if (c.literalKinds.every(v => v === c.literalKinds[0])) c.literalKinds = [c.literalKinds[0]!];
    if (c.langtagDirections.every(v => v === 0)) c.langtagDirections = [];
    return c;
  }
}
