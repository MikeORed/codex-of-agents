import { DocumentType as __DocumentType } from "@smithy/types";
import { Tool, ToolProps } from "./tool";

export interface SumToolProps extends ToolProps {
  // Add SumTool-specific properties if needed
}

export class SumTool extends Tool {
  private static inputSchema: __DocumentType = {
    type: "object",
    properties: {
      operands: {
        type: "array",
        items: { type: "number" },
        minItems: 2,
      },
    },
    required: ["operands"],
    additionalProperties: false,
  };

  constructor(
    props: SumToolProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public async execute(input: any): Promise<number> {
    // Validate input against the schema
    this.validate(this.props);

    const operands: number[] = input.operands;

    // Perform the sum
    const result = operands.reduce((sum, operand) => sum + operand, 0);

    return result;
  }
}
