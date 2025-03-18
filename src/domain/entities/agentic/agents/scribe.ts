import { BaseAgent, BaseAgentProps } from "./base-agent";
import { Chronicle } from "../chronicles/chronicle";
import { Agent } from "./agent";
import { LlmService } from "../../../services/llm-service/llm-service";
import config from "../../../../shared/config";
import {
  ConverseCommandInput,
  ConverseCommandOutput,
  ToolConfiguration,
} from "@aws-sdk/client-bedrock-runtime";
import { GenerateChronicleToolImpl } from "../tools/generate-chronicle-tool";
import { JsonChronicleMapper } from "../../../../adapters/secondary/json/json-chronicle-mapper";
import { logger } from "../../../../shared/monitor";
import { generateChronicleInputSchema } from "../../../schemas";

export interface ScribeProps extends BaseAgentProps {
  agents: Agent[];
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

  public get chronicle(): Chronicle {
    return this._chronicle;
  }

  /**
   * Creates a tool configuration for generating chronicles
   */
  private createGenerateChronicleToolConfig(): ToolConfiguration {
    return {
      tools: [
        {
          toolSpec: {
            name: "generateChronicle",
            description: "Generate a chronicle based on a command",
            inputSchema: {
              json: generateChronicleInputSchema,
            },
          },
        },
      ],
      toolChoice: { tool: { name: "generateChronicle" } },
    };
  }

  /**
   * Generates a system message for the LLM to guide chronicle generation
   */
  private generateSystemMessage(): string {
    const availableAgents = `Available Agents:\n${this.agents
      .map((agent) => `- ${agent.name}: ${agent.description}`)
      .join("\n")}`;

    const coreInstructions = `Instructions:
        - Parse the user's prompt and identify all entities and actions involved.
        - For distinct action plan needed, create a Chapter in the Chronicle.
        - Assign the Chapter to the appropriate Agent based on the agent's responsibilities.
        - If a task requires the outputs of other tasks, mark it as dependent on those Chapters by including their IDs in the dependencies array.
        - Include the goal and the context necessary for the Agent to execute the task.
        - Ensure that each Chapter has a unique ID.
        - The context should contain all relevant details extracted from the user's prompt, formatted for clarity.
        - Use the generateChronicle tool to create a chronicle based on the user's command.`;

    return [
      `Your Description: ${this.description}`,
      availableAgents,
      coreInstructions,
      ...this.props.supplementalInstructions,
    ].join("\n\n");
  }

  /**
   * Generates a chronicle based on a command using tool-based approach
   */
  public async generateChronicle(
    llmService: LlmService,
    command: string | undefined,
    context: Record<string, any> | undefined
  ): Promise<void> {
    logger.info("Generating chronicle using tool-based approach", { command });

    try {
      // Use tool configuration with LLM
      const toolConfig = this.createGenerateChronicleToolConfig();

      const chronicleGenerationInput: ConverseCommandInput = {
        system: [
          {
            text: this.generateSystemMessage(),
          },
        ],
        modelId: config.get("defaultConverseModelId"),
        messages: [
          {
            role: "user",
            content: [
              {
                text: command || "",
              },
            ],
          },
        ],
        toolConfig: toolConfig,
      };

      const chronicleResponse = await llmService.execute(
        chronicleGenerationInput
      );

      // Create the tool instance for converting JSON to Chronicle
      const generateChronicleTool = new GenerateChronicleToolImpl({
        name: "generateChronicle",
        description: "Generate a chronicle based on a command",
        agents: this.agents,
      });

      // The AWS SDK types might not have the toolUse property defined yet
      // Use a type assertion to access it
      const chronicleResponseContent =
        chronicleResponse.output?.message?.content ?? [];

      if (chronicleResponseContent?.[0]?.toolUse?.input) {
        // Parse the tool output as JSON
        const chronicleJson = chronicleResponseContent[0].toolUse.input;
        // Convert JSON to Chronicle entity using the tool
        this._chronicle = await generateChronicleTool.execute(chronicleJson);
      } else if (chronicleResponseContent?.[0]?.text) {
        // Fallback to parsing the message content if tool use is not available
        try {
          const chronicleJson = JSON.parse(chronicleResponseContent[0].text);

          // Convert JSON to Chronicle entity using the tool
          this._chronicle = await generateChronicleTool.execute(chronicleJson);
        } catch (error) {
          throw new Error(`Failed to parse chronicle JSON: ${error}`);
        }
      } else {
        throw new Error("No valid content received from LLM response");
      }
    } catch (error) {
      logger.error("Error generating chronicle", { error });
      throw error;
    }
  }
}
