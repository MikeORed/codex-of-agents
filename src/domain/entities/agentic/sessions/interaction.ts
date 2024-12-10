import { Entity } from "../../base/entity";
import { BaseAgent, BaseAgentProps } from "../agents/base-agent";
import {
  InteractionContent,
  InteractionType,
  InteractionDirection,
  ToolCall,
} from "./interaction-types";

export interface InteractionProps {
  agent: BaseAgent<BaseAgentProps>; // The agent that owns this interaction
  content: InteractionContent;
  timestamp: string;
  sessionId: string; // The ID of the session this interaction belongs to
  type: InteractionType;
  direction: InteractionDirection;
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

  public setText(text: string): void {
    this.props.content.text = text;
    this.setUpdatedDate();
  }

  public setType(type: InteractionType): void {
    this.props.type = type;
    this.setUpdatedDate();
  }

  public setDirection(direction: InteractionDirection): void {
    this.props.direction = direction;
    this.setUpdatedDate();
  }

  public setToolCall(toolCall: ToolCall): void {
    this.props.content.toolCall = toolCall;
    this.setUpdatedDate();
  }
}
