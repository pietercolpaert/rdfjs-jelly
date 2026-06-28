import type * as RDF from '@rdfjs/types';
import { RDF_LANG_STRING, XSD_STRING } from '../options';

function sameTerm(term: RDF.Term, other: RDF.Term | null | undefined): boolean {
  if (!other || term.termType !== other.termType || term.value !== other.value) return false;
  if (term.termType === 'Literal' && other.termType === 'Literal') {
    return term.language === other.language && term.direction === other.direction && term.datatype.equals(other.datatype);
  }
  if (term.termType === 'Quad' && other.termType === 'Quad') {
    return term.subject.equals(other.subject) && term.predicate.equals(other.predicate) &&
      term.object.equals(other.object) && term.graph.equals(other.graph);
  }
  return true;
}

export class NamedNode<Iri extends string = string> implements RDF.NamedNode<Iri> {
  public readonly termType = 'NamedNode' as const;
  public constructor(public readonly value: Iri) {}
  public equals(other: RDF.Term | null | undefined): boolean { return sameTerm(this, other); }
}

export class BlankNode implements RDF.BlankNode {
  public readonly termType = 'BlankNode' as const;
  public constructor(public readonly value: string) {}
  public equals(other: RDF.Term | null | undefined): boolean { return sameTerm(this, other); }
}

export class Variable implements RDF.Variable {
  public readonly termType = 'Variable' as const;
  public constructor(public readonly value: string) {}
  public equals(other: RDF.Term | null | undefined): boolean { return sameTerm(this, other); }
}

export class DefaultGraph implements RDF.DefaultGraph {
  public readonly termType = 'DefaultGraph' as const;
  public readonly value = '' as const;
  public equals(other: RDF.Term | null | undefined): boolean { return sameTerm(this, other); }
}

export class Literal implements RDF.Literal {
  public readonly termType = 'Literal' as const;
  public constructor(
    public readonly value: string,
    public readonly language = '',
    public readonly datatype: RDF.NamedNode = new NamedNode(language ? RDF_LANG_STRING : XSD_STRING),
    public readonly direction?: 'ltr' | 'rtl' | '' | null,
  ) {}
  public equals(other: RDF.Term | null | undefined): boolean { return sameTerm(this, other); }
}

export class Quad implements RDF.Quad {
  public readonly termType = 'Quad' as const;
  public readonly value = '' as const;
  public constructor(
    public readonly subject: RDF.Quad_Subject,
    public readonly predicate: RDF.Quad_Predicate,
    public readonly object: RDF.Quad_Object,
    public readonly graph: RDF.Quad_Graph = defaultGraphSingleton,
  ) {}
  public equals(other: RDF.Term | null | undefined): boolean { return sameTerm(this, other); }
}

const defaultGraphSingleton = new DefaultGraph();
let blankNodeCounter = 0;

const dataFactory = {
  namedNode: <Iri extends string = string>(value: Iri) => new NamedNode(value),
  blankNode: (value?: string) => new BlankNode(value ?? `b${blankNodeCounter++}`),
  literal: (value: string, languageOrDatatype?: string | RDF.NamedNode | RDF.DirectionalLanguage) => {
    if (typeof languageOrDatatype === 'string') {
      const language = languageOrDatatype.toLowerCase();
      return new Literal(value, language, new NamedNode(language ? RDF_LANG_STRING : XSD_STRING));
    }
    if (languageOrDatatype && !('termType' in languageOrDatatype)) {
      return new Literal(
        value,
        languageOrDatatype.language.toLowerCase(),
        new NamedNode(RDF_LANG_STRING),
        languageOrDatatype.direction,
      );
    }
    return new Literal(value, '', languageOrDatatype ?? new NamedNode(XSD_STRING));
  },
  variable: (value: string) => new Variable(value),
  defaultGraph: () => defaultGraphSingleton,
  quad: (
    subject: RDF.Quad_Subject,
    predicate: RDF.Quad_Predicate,
    object: RDF.Quad_Object,
    graph: RDF.Quad_Graph = defaultGraphSingleton,
  ) => new Quad(subject, predicate, object, graph),
  fromTerm: (original: RDF.Term): RDF.Term => {
    if (original.termType === 'NamedNode') return new NamedNode(original.value);
    if (original.termType === 'BlankNode') return new BlankNode(original.value);
    if (original.termType === 'Variable') return new Variable(original.value);
    if (original.termType === 'DefaultGraph') return defaultGraphSingleton;
    if (original.termType === 'Literal') return new Literal(
      original.value,
      original.language,
      new NamedNode(original.datatype.value),
      original.direction,
    );
    return new Quad(
      dataFactory.fromTerm(original.subject) as RDF.Quad_Subject,
      dataFactory.fromTerm(original.predicate) as RDF.Quad_Predicate,
      dataFactory.fromTerm(original.object) as RDF.Quad_Object,
      dataFactory.fromTerm(original.graph) as RDF.Quad_Graph,
    );
  },
  fromQuad: (original: RDF.Quad): RDF.Quad => new Quad(
    dataFactory.fromTerm(original.subject) as RDF.Quad_Subject,
    dataFactory.fromTerm(original.predicate) as RDF.Quad_Predicate,
    dataFactory.fromTerm(original.object) as RDF.Quad_Object,
    dataFactory.fromTerm(original.graph) as RDF.Quad_Graph,
  ),
};

export const DataFactory = dataFactory as RDF.DataFactory;
