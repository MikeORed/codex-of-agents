import { Entity } from "../../base/entity";

export interface ToolProps {
  name: string;
  // Additional properties as needed
}

export abstract class Tool extends Entity<ToolProps> {
  constructor(
    props: ToolProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public get name(): string {
    return this.props.name;
  }

  // Abstract method to execute the tool's functionality
  public abstract execute(input: any): Promise<any>;
}
