import { BaseAgentProps, BaseAgent } from "./base-agent";
import { Chronicle } from "../chronicles/chronicle";

export interface AgentProps extends BaseAgentProps {
  // Add ExecutionAgent-specific properties if needed
}

export class Agent extends BaseAgent {
  constructor(
    props: AgentProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public generateChronicle(chronicleInput: any): Promise<Chronicle> {
    throw new Error("Method not implemented.");
  }
  public executeChronicle(chronicleExecutionInput: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
}
