import { Tool, ToolProps } from "../entities/agentic/tools/tool";
import { IBaseRepository } from "./base.repository";

export interface IToolRepository extends IBaseRepository<Tool> {
  findById(id: string): Promise<Tool | null>;
  findAll(): Promise<Tool[]>;
  save(tool: Tool): Promise<void>;
  delete(id: string): Promise<void>;
}
