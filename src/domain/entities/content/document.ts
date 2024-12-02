import { Entity } from "../base/entity";
import { Schema } from "ajv";
import { validate } from "../../../shared/utils";

export interface DocumentProps {
  title: string;
  content: string;
  metadata: Map<string, any>;

  // Other properties as needed
}

export abstract class Document<DocumentProps> extends Entity<DocumentProps> {
  protected constructor(
    props: DocumentProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
    // Additional props wanted? Have a think
  }

  /**
   * Validates the document's properties against a provided JSON schema.
   * @param schema - The JSON schema to validate against.
   */
  protected validateDocument(schema: Schema): void {
    validate<DocumentProps>(schema, this.props);
  }
}
