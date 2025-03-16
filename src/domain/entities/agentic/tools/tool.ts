// src/domain/entities/agentic/tools/tool.ts
import { DocumentType as __DocumentType } from "@smithy/types";
import { Entity } from "../../base/entity";
import { ValidationError, ServiceError } from "../../../../shared/errors";
import { validateWithThrow } from "../../../../shared/utils";
import { getLogger, logger } from "../../../../shared/monitor";
import config from "../../../../shared/config";
import { Schema } from "ajv";

export interface ToolMetadata {
  version: string;
  author: string;
  description: string;
  capabilities: string[];
  tags: string[];
}

export interface ToolProps {
  name: string;
  description: string;
  inputSchema?: Schema;
  outputSchema?: Schema;
  metadata?: ToolMetadata;
  // Additional properties as needed
}

export abstract class Tool extends Entity<ToolProps> {
  private readonly maxExecutionTime: number;

  constructor(
    props: ToolProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
    this.maxExecutionTime = config.get("tools.maxExecutionTime");
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string {
    return this.props.description;
  }

  public get inputSchema(): Schema {
    return this.props.inputSchema ?? {};
  }

  public get outputSchema(): Schema {
    return this.props.outputSchema ?? {};
  }

  public get metadata(): ToolMetadata {
    return (
      this.props.metadata ?? {
        version: "1.0.0",
        author: "Unknown",
        description: this.props.description,
        capabilities: [],
        tags: [],
      }
    );
  }

  // Abstract method to execute the tool's functionality
  public abstract executeInternal(input: any): Promise<any>;

  // Public execute method with validation and error handling
  public async execute(input: any): Promise<any> {
    const toolLogger = getLogger(logger, `Tool:\${this.props.name}`);
    toolLogger.debug("Executing tool", { input });

    try {
      // Validate input if schema exists
      if (this.props.inputSchema) {
        await validateWithThrow(
          this.props.inputSchema,
          input,
          `\${this.props.name} input`
        );
      }

      // Execute with timeout
      const result = await this.executeWithTimeout(input);

      // Validate output if schema exists
      if (this.props.outputSchema) {
        this.props.outputSchema;
        await validateWithThrow(
          this.props.outputSchema,
          result,
          `\${this.props.name} output`
        );
      }

      toolLogger.debug("Tool execution successful", { result });
      return result;
    } catch (error) {
      toolLogger.error("Tool execution failed", {
        error: error instanceof Error ? error.message : "Unknown error",
        toolName: this.props.name,
      });

      if (error instanceof ValidationError) {
        throw error;
      }

      throw new ServiceError({
        message: `Tool execution failed: \${error instanceof Error ? error.message : 'Unknown error'}`,
        service: "Tool",
        operation: this.props.name,
        cause: error instanceof Error ? error : undefined,
      });
    }
  }

  private async executeWithTimeout(input: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let timeoutId: NodeJS.Timeout;

      // Create timeout
      if (this.maxExecutionTime > 0) {
        timeoutId = setTimeout(() => {
          reject(
            new ServiceError({
              message: `Tool execution timed out after \${this.maxExecutionTime}ms`,
              service: "Tool",
              operation: this.props.name,
              details: { maxExecutionTime: this.maxExecutionTime },
            })
          );
        }, this.maxExecutionTime);
      }

      // Execute the tool
      this.executeInternal(input)
        .then((result) => {
          if (timeoutId) clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((error) => {
          if (timeoutId) clearTimeout(timeoutId);
          reject(error);
        });
    });
  }
}
