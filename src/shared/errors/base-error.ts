export class BaseError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: Record<string, any>;
  public readonly cause?: Error;

  constructor(params: {
    message: string;
    code: string;
    statusCode: number;
    details?: Record<string, any>;
    cause?: Error;
  }) {
    super(params.message);
    this.name = this.constructor.name;
    this.code = params.code;
    this.statusCode = params.statusCode;
    this.details = params.details;
    this.cause = params.cause;

    // Preserve stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toJSON(): Record<string, any> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      details: this.details,
      ...(this.cause && {
        cause:
          this.cause instanceof BaseError
            ? this.cause.toJSON()
            : this.cause.message,
      }),
    };
  }
}
