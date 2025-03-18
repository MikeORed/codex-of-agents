import { Tool, ToolProps } from "./tool";
import { Agent } from "../agents/agent";
import { Chronicle } from "../chronicles/chronicle";
import { Chapter } from "../chronicles/chapter";
import {
  generateChronicleInputSchema,
  generateChronicleOutputSchema,
} from "../../../schemas";
import { logger } from "../../../../shared/monitor";

export interface GenerateChronicleToolProps extends ToolProps {
  agents: Agent[];
}

/**
 * Tool for generating chronicles based on user commands
 */
export class GenerateChronicleToolImpl extends Tool {
  private readonly agents: Agent[];

  constructor(props: GenerateChronicleToolProps) {
    super({
      ...props,
      name: props.name || "generateChronicle",
      description:
        props.description || "Generate a chronicle based on a command",
      inputSchema: props.inputSchema || generateChronicleInputSchema,
      outputSchema: props.outputSchema || generateChronicleOutputSchema,
    });

    this.agents = props.agents;
  }

  /**
   * Executes the tool to convert JSON input to a Chronicle entity
   * This tool doesn't call the LLM directly - it receives the JSON from the LLM
   * and converts it to a Chronicle entity
   */
  public async executeInternal(input: any): Promise<Chronicle> {
    logger.info("Converting JSON to Chronicle", { input });

    try {
      // The input should already be a JSON object representing a chronicle
      // We just need to convert it to a Chronicle entity
      return this.convertJsonToChronicle(input);
    } catch (error) {
      logger.error("Error converting JSON to Chronicle", { error });
      throw error;
    }
  }

  /**
   * Converts a JSON chronicle to a Chronicle entity
   */
  public convertJsonToChronicle(json: any): Chronicle {
    // Create chapters first
    const chaptersById = new Map<string, Chapter>();

    for (const chapterJson of json.chapters) {
      const targetAgent = this.findAgentByName(chapterJson.targetAgent);

      if (!targetAgent) {
        throw new Error(`Agent ${chapterJson.targetAgent} not found.`);
      }

      const chapter = new Chapter(
        {
          targetAgent,
          goal: chapterJson.goal,
          inputContext: chapterJson.context || {},
          status: chapterJson.status || "created",
        },
        chapterJson.id
      );

      chaptersById.set(chapterJson.id, chapter);
    }

    // Resolve dependencies
    for (const chapterJson of json.chapters) {
      if (chapterJson.dependencies && chapterJson.dependencies.length > 0) {
        const chapter = chaptersById.get(chapterJson.id);

        if (!chapter) {
          throw new Error(`Chapter ${chapterJson.id} not found.`);
        }

        for (const depId of chapterJson.dependencies) {
          const depChapter = chaptersById.get(depId);

          if (!depChapter) {
            throw new Error(`Dependency chapter ${depId} not found.`);
          }

          chapter.addDependency(depChapter);
        }
      }
    }

    // Create the chronicle
    const chronicle = new Chronicle({
      title: json.title,
      goal: json.goal,
      status: json.status || "created",
      chapters: Array.from(chaptersById.values()),
    });

    return chronicle;
  }

  /**
   * Helper method to find an agent by name
   */
  private findAgentByName(name: string): Agent | undefined {
    return this.agents.find((agent) => agent.name === name);
  }
}
