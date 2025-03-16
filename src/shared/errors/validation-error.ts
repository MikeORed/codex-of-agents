import { BaseError } from "./base-error";
import { ErrorObject } from "ajv";

export class ValidationError extends BaseError {
  constructor(params: {
    message: string;
    validationErrors?: ErrorObject[];
    cause?: Error;
  }) {
    super({
      message: params.message,
      code: "VALIDATION_ERROR",
      statusCode: 400,
      details: { validationErrors: params.validationErrors },
      cause: params.cause,
    });
  }
}
