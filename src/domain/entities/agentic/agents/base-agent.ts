import { IAgentRepository } from "../../../repositories/agent.repository";
import { LlmService } from "../../../services/llm-service/llm-service";
import { Entity } from "../../base/entity";

export interface BaseAgentProps {
  name: string;
  description: string;
  supllementalInstructions: string[];
  // Include other common properties if needed
}

export abstract class BaseAgent<T extends BaseAgentProps> extends Entity<T> {
  constructor(props: T, id?: string, created?: string, updated?: string) {
    super(props, id, created, updated);
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string {
    return this.props.description;
  }

  // Abstract methods chronicle (plans) then execute those chronicles
  public abstract execute(
    llmService: LlmService,
    agentRepository: IAgentRepository,
    //sessionRepository: ISessionRepository,
    command: string | undefined,
    context: Record<string, any> | undefined
  ): Promise<Record<string, any>>;
}
