import { DocumentType as __DocumentType } from "@smithy/types";
import { Entity } from "../../base/entity";

export interface ToolProps {
  name: string;
  description: string;
  inputSchema?: __DocumentType;
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

  public get description(): string {
    return this.props.description;
  }

  public get inputSchema(): __DocumentType {
    return this.props.inputSchema ?? {};
  }

  // Abstract method to execute the tool's functionality
  public abstract execute(input: any): Promise<any>;
}
