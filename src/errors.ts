export class JellyError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class JellyConformanceError extends JellyError {}
export class JellyUnsupportedFeatureError extends JellyError {}

/** A producer reported an incomplete SPARQL result set in its trailer. */
export class JellySparqlResultError extends JellyError {
  public constructor(public readonly resultIndex: number, message: string) { super(message); }
}
