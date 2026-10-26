import type * as RDF from '@rdfjs/types';
import type { QuadPattern } from '../types';

/** Wire values carry strings and nested values, without RDF/JS methods or a
 * dependency on the caller's data factory. Repeat runs share the same value. */
export type TermValue =
  | { termType: 'NamedNode'; value: string }
  | { termType: 'BlankNode'; value: string }
  | { termType: 'DefaultGraph'; value: string }
  | { termType: 'Literal'; value: string; language: string; direction?: 'ltr' | 'rtl'; datatype: { termType: 'NamedNode'; value: string } }
  | { termType: 'Quad'; subject: TermValue; predicate: TermValue; object: TermValue; graph: TermValue };

export const DEFAULT_GRAPH_VALUE: TermValue = { termType: 'DefaultGraph', value: '' };

/** A wildcard pattern makes the whole OR unconditional. Keep the direct
 * decoder path in that case, as well as when filtering is omitted. */
export function selectivePatterns(patterns: readonly QuadPattern[] | undefined): readonly QuadPattern[] | undefined {
  return patterns?.some(p => !p.subject && !p.predicate && !p.object && !p.graph) ? undefined : patterns;
}

export const POSITIONS = ['subject', 'predicate', 'object', 'graph'] as const;
export type SelectionPosition = typeof POSITIONS[number];

/** The position, if any, that every pattern pins to an IRI. Its column alone can then choose
 * the rows to build, by lookup slot instead of by value. Subjects and objects come before
 * predicates and graphs: they have the most distinct values, so they usually reject the most
 * rows, which are then never built for the remaining positions. */
export function selectionPosition(patterns: readonly QuadPattern[] | undefined): SelectionPosition | undefined {
  if (!patterns) return undefined;
  for (const position of ['subject', 'object', 'predicate', 'graph'] as const) {
    if (patterns.every(p => p[position]?.termType === 'NamedNode')) return position;
  }
  return undefined;
}

/** Compare RDF terms or wire values without invoking a factory or equals(). */
export function matchesTerm(value: TermValue | RDF.Term, pattern: RDF.Term, scope?: number): boolean {
  if (value.termType !== pattern.termType) return false;
  if (value.termType === 'Quad') {
    return pattern.termType === 'Quad' && matchesTerm(value.subject, pattern.subject, scope) &&
      matchesTerm(value.predicate, pattern.predicate, scope) && matchesTerm(value.object, pattern.object, scope) &&
      matchesTerm(value.graph, pattern.graph, scope);
  }
  const label = value.termType === 'BlankNode' && scope !== undefined ? `b${scope}_${value.value}` : value.value;
  if (label !== pattern.value) return false;
  if (value.termType === 'Literal' && pattern.termType === 'Literal') {
    return value.datatype.value === pattern.datatype.value && value.language.toLowerCase() === pattern.language.toLowerCase() &&
      (value.direction || '') === (pattern.direction || '');
  }
  return true;
}

export function matchesPatterns(
  patterns: readonly QuadPattern[], subject: TermValue | RDF.Term, predicate: TermValue | RDF.Term,
  object: TermValue | RDF.Term, graph: TermValue | RDF.Term, scope?: number,
): boolean {
  for (const pattern of patterns) {
    if ((!pattern.predicate || matchesTerm(predicate, pattern.predicate, scope)) &&
      (!pattern.subject || matchesTerm(subject, pattern.subject, scope)) &&
      (!pattern.object || matchesTerm(object, pattern.object, scope)) &&
      (!pattern.graph || matchesTerm(graph, pattern.graph, scope))) return true;
  }
  return false;
}
