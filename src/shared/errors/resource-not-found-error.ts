import { BaseError } from "./base-error";

export class ResourceNotFoundError extends BaseError {
  constructor(params: {
    resourceType: string;
    resourceId: string;
    cause?: Error;
  }) {
    super({
      message: `\${params.resourceType} with id \${params.resourceId} not found`,
      code: "RESOURCE_NOT_FOUND",
      statusCode: 404,
      details: {
        resourceType: params.resourceType,
        resourceId: params.resourceId,
      },
      cause: params.cause,
    });
  }
}
