import { Entity } from "../../base/entity";
import { BaseAgent } from "../agents/base-agent";
import { Tool } from "../tools/tool";

export interface InteractionContent {
  input: string;
  output?: string;
  toolCalls?: {
    tool: Tool;
    input: any;
    output?: any;
  }[];
}

export interface InteractionProps {
  agent: BaseAgent<any>;  // The agent that owns this interaction
  content: InteractionContent;
  timestamp: string;
  sessionId: string;  // The ID of the session this interaction belongs to
}

export class Interaction extends Entity<InteractionProps> {
  constructor(
    props: InteractionProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public get agent(): BaseAgent<any> {
    return this.props.agent;
  }

  public get content(): InteractionContent {
    return this.props.content;
  }

  public get timestamp(): string {
    return this.props.timestamp;
  }

  public setOutput(output: string): void {
    this.props.content.output = output;
    this.setUpdatedDate();
  }

  public addToolCall(tool: Tool, input: any, output?: any): void {
    if (!this.props.content.toolCalls) {
      this.props.content.toolCalls = [];
    }
    this.props.content.toolCalls.push({ tool, input, output });
    this.setUpdatedDate();
  }

  public setToolCallOutput(toolCallIndex: number, output: any): void {
    if (
      this.props.content.toolCalls &&
      this.props.content.toolCalls[toolCallIndex]
    ) {
      this.props.content.toolCalls[toolCallIndex].output = output;
      this.setUpdatedDate();
    }
  }
}