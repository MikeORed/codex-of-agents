import { Agent } from "../entities/agentic/agents/agent";
import {
  BaseAgent,
  BaseAgentProps,
} from "../entities/agentic/agents/base-agent";
import { IBaseRepository } from "./base.repository";

export interface IAgentRepository
  extends IBaseRepository<BaseAgent<BaseAgentProps>> {
  findById(id: string): Promise<BaseAgent<BaseAgentProps> | null>;
  findAll(): Promise<BaseAgent<BaseAgentProps>[]>;
  save(agent: Agent): Promise<void>;
  delete(id: string): Promise<void>;
}
