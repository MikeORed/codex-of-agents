import { Tool } from "../tools/tool";

export enum InteractionType {
  USER = "user",
  AGENT = "agent",
  SYSTEM = "system",
}

export type InteractionDirection = "incoming" | "outgoing";

export type ToolCallContent =
  | {
      input: any;
    }
  | {
      output: any;
    };

export interface ToolCall {
  tool: Tool;
  toolUseId: string;
  content: ToolCallContent;
}

export interface InteractionContent {
  text: string;
  toolCall?: ToolCall;
}
