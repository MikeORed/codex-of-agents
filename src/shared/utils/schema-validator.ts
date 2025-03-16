import AJV, { ErrorObject, Schema } from "ajv";
import addFormats from "ajv-formats";
import { ValidationError } from "../errors";
const ajv = new AJV();
addFormats(ajv);
export type ValidationResult = {
  isValid: boolean;
  validationErrors: null | ErrorObject[];
};
export async function validate<DetailType>(
  validationSchema: Schema,
  detail: DetailType
): Promise<ValidationResult> {
  const schemaFn = ajv.compile(validationSchema);
  const isDocumentValid = schemaFn(detail);
  if (isDocumentValid) {
    return <ValidationResult>{ isValid: true, validationErrors: null };
  }
  return <ValidationResult>{
    isValid: false,
    validationErrors: schemaFn.errors,
  };
}

export async function validateWithThrow<DetailType>(
  validationSchema: Schema,
  detail: DetailType,
  entityName = "Entity"
): Promise<void> {
  const result = await validate(validationSchema, detail);
  if (!result.isValid) {
    throw new ValidationError({
      message: `Invalid ${entityName} data`,
      validationErrors: result.validationErrors ?? [],
    });
  }
}
