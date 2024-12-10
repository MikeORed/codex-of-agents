import { BaseAgent, BaseAgentProps } from "./base-agent";
import { Chronicle } from "../chronicles/chronicle";
import { Agent } from "./agent";
import { ChronicleXmlMapper } from "../../../../adapters/secondary/xml/xml-chronicle-mapper";
import { LlmService } from "../../../services/llm-service/llm-service";
import { IAgentRepository } from "../../../repositories/agent.repository";
import { config } from "../../../../shared/config";
import { ConverseCommandInput } from "@aws-sdk/client-bedrock-runtime";

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

  private generateSystemMessage(): string {
    const availableAgents = `Available Agents:\n${this.agents
      .map((agent) => `- ${agent.name}: ${agent.description}`)
      .join("\n")}`;

    const coreInstructions = `Instructions:${
      this.props.supllementalInstructions &&
      this.props.supllementalInstructions.length > 0
        ? this.props.supllementalInstructions.map((ins) => "\n-" + ins).join()
        : ""
    }
        - Parse the user's prompt and identify all entities and actions involved.
        - For distinct action plan needed, create a Chapter in the Chronicle.
        - Assign the Chapter to the appropriate Agent based on the agent's responsibilities.
        - If a task requires the outputs of other tasks, mark it as dependent on those Chapters by including their IDs in the <dependencies> section.
        - Include the goal and the context necessary for the Agent to execute the task.
        - Ensure that each Chapter has a unique ID.
        - The context should contain all relevant details extracted from the user's prompt, formatted for clarity.
        - Provide your output in the following XML format only, always remember to close the appropriate tags, do not include newlines or tabs, and do not place any formatting in the response not provided below
        -- For any xml properties which need to be generated, their values must always be in camel case with no spaces`;

    const coreFormat = `Output Format:
      <chronicle>
        <chapter id="...">
          <targetAgent>...</targetAgent>
          <dependencies>
            <dependency>...</dependency>
            <!-- Additional dependencies -->
          </dependencies>
          <goal>...</goal>
          <context>...</context>
        </chapter>
        <!-- Additional chapters -->
      </chronicle>`;

    const minifyRegex = /[\t\r\n]+/g;
    const collapseSpaces = / {2,}/g;

    return [
      `Your Description: ${this.description}`,
      availableAgents,
      coreInstructions.replace(minifyRegex, " ").replace(collapseSpaces, " "),
      coreFormat.replace(minifyRegex, " ").replace(collapseSpaces, " "),
    ].join("\n\n");
  }

  public async generateChronicle(
    llmService: LlmService,
    command: string | undefined,
    context: Record<string, any> | undefined
  ): Promise<void> {
    const chronicleGenerationInput: ConverseCommandInput = {
      system: [{ text: this.generateSystemMessage() }],
      modelId: config.get("defaultConverseModelId"),
      messages: [
        {
          role: "user",
          content: [
            {
              text: `${command}`,
            },
          ],
        },
      ],
    };

    const chronicleReadResponse = await llmService.execute(
      chronicleGenerationInput
    );

    const parser = new ChronicleXmlMapper({
      agentResolver: (agentName: string) => {
        const agent = this.agents.find((agent) => agent.name === agentName);
        if (!agent) {
          throw new Error(`Agent ${agentName} not found.`);
        }
        return agent;
      },
    });

    if (chronicleReadResponse?.output?.message?.content?.[0]?.text) {
      await parser
        .parseXmlToChronicle(
          chronicleReadResponse.output.message.content[0].text
        )
        .then((chronicle) => {
          this._chronicle = chronicle;
        });
    } else {
      throw new Error("No valid content received from LLM response");
    }
  }

  public executeChronicle(chronicle: Chronicle): Promise<any> {
    throw new Error("Method not implemented.");
  }

  public async execute(
    llmService: LlmService,
    agentRepository: IAgentRepository,
    //sessionRepository: ISessionRepository,
    command: string | undefined,
    context: Record<string, any> | undefined
  ): Promise<Record<string, any>> {
    await this.generateChronicle(llmService, command, context);
    //await this.executeChronicle(this._chronicle);
    return {};
  }
}
