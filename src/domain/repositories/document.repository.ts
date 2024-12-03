import { Document, DocumentProps } from "../entities/content/document";
import { IBaseRepository } from "./base.repository";

export interface IDocumentRepository
  extends IBaseRepository<Document<DocumentProps>> {
  // Add any document-specific repository methods here if needed
  findByType(type: string): Promise<Document<DocumentProps>[]>;
}
