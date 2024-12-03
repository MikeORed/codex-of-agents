import { Entity } from "../../base/entity";
import { Chronicle } from "../chronicles/chronicle";

export interface BaseAgentProps {
  name: string;
  // Include other common properties if needed
}

export abstract class BaseAgent extends Entity<BaseAgentProps> {
  private _chronicle: Chronicle;

  constructor(
    props: BaseAgentProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public get name(): string {
    return this.props.name;
  }

  // Abstract methods chronicle (plans) then execute those chronicles
  public abstract generateChronicle(chronicleInput: any): Promise<Chronicle>;
  public abstract executeChronicle(chronicleExecutionInput: any): Promise<any>;
}
