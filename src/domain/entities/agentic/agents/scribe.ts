import { BaseAgent, BaseAgentProps } from "./base-agent";
import { Chronicle } from "../chronicles/chronicle";

export interface ScribeProps extends BaseAgentProps {
  // Add Scribe-specific properties if needed
  // For now, we'll inherit from AgentProps directly
}
// File: src/domain/entities/agentic/Scribe.ts

export class Scribe extends BaseAgent {
  constructor(
    props: ScribeProps,
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

// Define the types used
interface ScribeTaskData {
  userPrompt: string;
  // Add other relevant fields
}
