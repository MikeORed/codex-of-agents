import { BaseAgent, BaseAgentProps } from "./base-agent";
import { Chronicle } from "../chronicles/chronicle";
import { Agent } from "./agent";

export interface ScribeProps extends BaseAgentProps {
  agents: Agent[];
  // Add Scribe-specific properties if needed
  // For now, we'll inherit from AgentProps directly
}

export class Scribe extends BaseAgent<ScribeProps> {
  constructor(
    props: ScribeProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }
  private _chronicle: Chronicle;

  public get agents(): Agent[] {
    return this.props.agents;
  }

  public generateChronicle(): Promise<Chronicle> {
    throw new Error("Method not implemented.");
  }
  public executeChronicle(chronicle: Chronicle): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async execute(): Promise<void> {
    let _chronicle = await this.generateChronicle();
    await this.executeChronicle(_chronicle);
  }
}
