// src/domain/entities/agentic/tools/sum-tool.ts
import { DocumentType as __DocumentType } from "@smithy/types";
import { Tool, ToolProps } from "./tool";
import { Schema } from "ajv";

export interface SumToolProps extends ToolProps {}

export class SumTool extends Tool {
  private static readonly staticInputSchema: Schema = {
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

  private static readonly staticOutputSchema: Schema = {
    type: "object",
    properties: {
      sum: { type: "number" },
      count: { type: "integer" },
    },
    required: ["sum", "count"],
    additionalProperties: false,
  };

  constructor(
    props: SumToolProps = {
      name: "sum",
      description: "Adds a list of numbers and returns the sum",
      metadata: {
        version: "1.0.0",
        author: "Codex of Agents",
        description: "Adds numeric operands and returns the sum and count",
        capabilities: ["math", "addition"],
        tags: ["basic", "math"],
      },
    },
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(
      {
        ...props,
        inputSchema: SumTool.staticInputSchema,
        outputSchema: SumTool.staticOutputSchema,
      },
      id,
      created,
      updated
    );
  }

  public async executeInternal(input: any): Promise<any> {
    const operands: number[] = input.operands;

    // Perform the sum
    const sum = operands.reduce((acc, operand) => acc + operand, 0);

    return {
      sum,
      count: operands.length,
    };
  }
}
