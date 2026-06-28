export class JellyError extends Error {
  public constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = new.target.name;
  }
}

export class JellyConformanceError extends JellyError {}
export class JellyUnsupportedFeatureError extends JellyError {}

