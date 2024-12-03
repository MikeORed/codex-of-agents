import { BaseAgentProps, BaseAgent } from "./base-agent";
import { Chapter } from "../chronicles/chapter";
import { Tool } from "../tools/tool";

export interface AgentProps extends BaseAgentProps {
  chapter: Chapter;
  tools?: Tool[];
  // Add ExecutionAgent-specific properties if needed
}

export class Agent extends BaseAgent<AgentProps> {
  constructor(
    props: AgentProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public get tools(): Tool[] {
    return this.props.tools!;
  }

  public addTool(tool: Tool): void {
    if (!this.props.tools!.includes(tool)) {
      this.props.tools!.push(tool);
    }
  }

  public async execute(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
