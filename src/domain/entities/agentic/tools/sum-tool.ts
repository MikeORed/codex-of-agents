import { DocumentType as __DocumentType } from "@smithy/types";
import { Tool, ToolProps } from "./tool";

export interface SumToolProps extends ToolProps {}

export class SumTool extends Tool {
  private static staticInputSchema: __DocumentType = {
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
    this.props.inputSchema = SumTool.staticInputSchema;
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
