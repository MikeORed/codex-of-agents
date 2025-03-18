import { BaseAgentProps, BaseAgent } from "./base-agent";
import { Tool } from "../tools/tool";
import { LlmService } from "../../../services/llm-service/llm-service";
import { IAgentRepository } from "../../../repositories/agent.repository";
import {
  ConverseStreamCommandInput,
  ToolConfiguration,
  Tool as BedrockTool,
} from "@aws-sdk/client-bedrock-runtime";
import config from "../../../../shared/config";
import { JsonAgentResponseMapper } from "../../../../adapters/secondary/json/json-agent-response-mapper";
import { logger } from "../../../../shared/monitor";
import { chapterResponseSchema } from "../../../schemas";

export interface AgentProps extends BaseAgentProps {
  tools?: Tool[];
}

export class Agent extends BaseAgent<AgentProps> {
  constructor(
    props: AgentProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public get tools(): Tool[] {
    return this.props.tools!;
  }

  public addTool(tool: Tool): void {
    if (!this.props.tools!.includes(tool)) {
      this.props.tools!.push(tool);
    }
  }

  private generateSystemMessage(): string {
    const coreInstructions = `Instructions:${
      this.props.supplementalInstructions &&
      this.props.supplementalInstructions.length > 0
        ? this.props.supplementalInstructions.map((ins) => "\n-" + ins).join()
        : ""
    }
        - Parse the goal and input context from the request.
        - For distinct action required either call an appropriate tool or evaluate yourself.
        - Provide your final output (if no tool is needed) to cover the context to either report final results or to pass your results to dependent agents.
        - Return your response as a JSON object with the following structure:
          {
            "directResult": "A string containing the main result or output of your processing",
            "outputContext": {
              "key1": "value1",
              "key2": "value2",
              ...
            }
          }
        - The directResult should be a clear, concise summary of your findings or actions.
        - The outputContext should contain structured data that might be useful for other agents or processes.
        - Any outputContext generated should be distilled to its core useful information to not duplicate the information in directResult.`;

    return [`Your Description: ${this.description}`, coreInstructions].join(
      "\n\n"
    );
  }

  public async execute(
    llmService: LlmService,
    command: string | undefined,
    context: Record<string, any> | undefined
  ): Promise<Record<string, any>> {
    const converseToolConfig: ToolConfiguration | undefined =
      this.tools && this.tools.length > 0
        ? {
            tools: this.tools.map((tool): BedrockTool => {
              return {
                toolSpec: {
                  name: tool.name,
                  description: tool.description,
                  inputSchema: { json: tool.inputSchema },
                },
              };
            }),
          }
        : undefined;

    const converseInput: ConverseStreamCommandInput = {
      system: [{ text: this.generateSystemMessage() }],
      modelId: config.get("defaultConverseModelId"),
      messages: [
        {
          role: "user",
          content: [
            {
              text: `Goal: ${command}\nContext: ${JSON.stringify(
                context,
                null,
                2
              )}`,
            },
          ],
        },
      ],
      toolConfig: converseToolConfig,
    };

    const agentExecutionResponse = await llmService.execute(converseInput);

    // Handle tool use response if available
    const response = agentExecutionResponse as any;
    if (response?.output?.toolUse?.output) {
      try {
        const toolResponse = JSON.parse(response.output.toolUse.output);
        logger.info("Agent Tool Response Parsed", { toolResponse });
        return toolResponse;
      } catch (error) {
        logger.error("Failed to parse tool response", { error });
      }
    }

    // Handle regular message response
    const parser = new JsonAgentResponseMapper();
    let outputContext: Record<string, any> = {};

    if (agentExecutionResponse?.output?.message?.content?.[0]?.text) {
      try {
        const responseText =
          agentExecutionResponse.output.message.content[0].text;
        outputContext = parser.parseAgentResponse(responseText);
      } catch (error) {
        logger.error("Failed to parse agent response", { error });
        // Fallback to a basic structure if parsing fails
        outputContext = {
          directResult: agentExecutionResponse.output.message.content[0].text,
          outputContext: {},
        };
      }
    }

    logger.info("Agent Response Parsed", { outputContext });
    return outputContext;
  }
}
