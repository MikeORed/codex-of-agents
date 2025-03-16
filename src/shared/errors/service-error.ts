import { BaseError } from "./base-error";

export class ServiceError extends BaseError {
  constructor(params: {
    message: string;
    service: string;
    operation: string;
    cause?: Error;
    details?: Record<string, any>;
  }) {
    super({
      message: params.message,
      code: "SERVICE_ERROR",
      statusCode: 500,
      details: {
        service: params.service,
        operation: params.operation,
        ...params.details,
      },
      cause: params.cause,
    });
  }
}
