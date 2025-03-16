import { BaseAgentProps, BaseAgent } from "./base-agent";
import { Tool } from "../tools/tool";
import { LlmService } from "../../../services/llm-service/llm-service";
import { IAgentRepository } from "../../../repositories/agent.repository";
import {
  ConverseStreamCommandInput,
  ToolConfiguration,
  Tool as BedrockTool,
} from "@aws-sdk/client-bedrock-runtime";
import { config } from "../../../../shared/config";
import { ChapterResponseXmlParser } from "../../../../adapters/secondary/xml/xml-execution-agent-output-context-mapper";
import { logger } from "../../../../shared/monitor";

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
        - Assign the Chapter to the appropriate Agent based on the agent's responsibilities.
        - Provide your final output (if no tool is needed) to cover the context to either report final results or to pass your results to dependent agents
        - Provide your output in the following XML format only, always remember to close the appropriate tags, do not include newlines or tabs, and do not place any formatting in the response not provided below
        -- For any xml properties which need to be generated, their values must always be in camel case with no spaces
        -- Any outputContext generated should be distilled to it's core useful information to not duplicate the information in directResult
        `;

    const coreFormat = `Output Format:
      <response>
        <directResult>...</directResult>
        <outputContext>
          <context name="...">...</context>
          <!-- Additional output context values -->
        </outputContext>
      </response>`;

    const minifyRegex = /[\t\r\n]+/g;
    const collapseSpaces = / {2,}/g;

    return [
      `Your Description: ${this.description}`,
      coreInstructions.replace(minifyRegex, " ").replace(collapseSpaces, " "),
      coreFormat.replace(minifyRegex, " ").replace(collapseSpaces, " "),
    ].join("\n\n");
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
              text: `<goal>${command}</goal><context>${JSON.stringify(
                context
              )}</context>`,
            },
          ],
        },
      ],
      toolConfig: converseToolConfig,
    };

    const agentExecutionResponse = await llmService.execute(converseInput);

    const parser = new ChapterResponseXmlParser();

    let outputContext: Record<string, any> = {};

    if (agentExecutionResponse?.output?.message?.content?.[0]?.text) {
      outputContext = await parser.parseXmlToChapterResponse(
        agentExecutionResponse.output.message.content[0].text
      );
    }

    logger.info("Agent Response Parsed", { outputContext });
    return outputContext;
  }
}
