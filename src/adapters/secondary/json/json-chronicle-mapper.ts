import { Chronicle } from "../../../domain/entities/agentic/chronicles/chronicle";
import { Chapter } from "../../../domain/entities/agentic/chronicles/chapter";
import { Agent } from "../../../domain/entities/agentic/agents/agent";
import { logger } from "../../../shared/monitor";

interface JsonChronicleMapperOptions {
  agentResolver: (agentName: string) => Agent;
  chapterResolver?: (chapterId: string) => Chapter;
}

/**
 * Mapper that converts Chronicle JSON into Chronicle entities.
 * This belongs to the adapter layer (JSON parsing and mapping logic).
 */
export class JsonChronicleMapper {
  private agentResolver: (agentName: string) => Agent;
  private chapterResolver?: (chapterId: string) => Chapter;

  constructor(options: JsonChronicleMapperOptions) {
    this.agentResolver = options.agentResolver;
    this.chapterResolver = options.chapterResolver;
  }

  /**
   * Parses a JSON object representing a Chronicle and returns a Chronicle entity.
   * @param json - The JSON object.
   * @returns A Chronicle entity.
   */
  public parseJsonToChronicle(json: any): Chronicle {
    logger.info("Parsing JSON to Chronicle", { json });

    // First, create chapters without resolving dependencies.
    const chaptersById = new Map<string, Chapter>();

    for (const chapterJson of json.chapters) {
      const chapterId = chapterJson.id;
      if (!chapterId) {
        throw new Error("Chapter without an ID found in JSON.");
      }

      const targetAgentName = chapterJson.targetAgent;
      if (!targetAgentName) {
        throw new Error(`Chapter ${chapterId} missing targetAgent.`);
      }

      const targetAgent = this.agentResolver(targetAgentName);

      const chapterGoal = chapterJson.goal || "No goal specified";
      const inputContext = chapterJson.context || {};
      const status = chapterJson.status || "created";

      const chapter = new Chapter(
        {
          targetAgent: targetAgent,
          goal: chapterGoal,
          inputContext: inputContext,
          status: status,
        },
        chapterId
      );

      chaptersById.set(chapterId, chapter);
    }

    // Second pass: resolve dependencies.
    for (const chapterJson of json.chapters) {
      const chapterId = chapterJson.id;
      const chapter = chaptersById.get(chapterId)!;

      if (chapterJson.dependencies && Array.isArray(chapterJson.dependencies)) {
        for (const depId of chapterJson.dependencies) {
          const depChapter = chaptersById.get(depId);
          if (depChapter) {
            // Dependency found locally
            chapter.addDependency(depChapter);
          } else if (this.chapterResolver) {
            // Try external resolver if defined
            const resolvedDep = this.chapterResolver(depId);
            if (resolvedDep) {
              chapter.addDependency(resolvedDep);
            } else {
              throw new Error(`Dependency chapter ${depId} not found.`);
            }
          } else {
            throw new Error(
              `Dependency chapter ${depId} not found and no chapterResolver available.`
            );
          }
        }
      }
    }

    // Now we have all chapters and dependencies resolved.
    const chapters = Array.from(chaptersById.values());

    // Construct the Chronicle
    const chronicle = new Chronicle({
      title: json.title || "Untitled Chronicle",
      goal: json.goal || "No goal specified",
      status: json.status || "created",
      chapters: chapters,
    });

    return chronicle;
  }

  /**
   * Converts a Chronicle entity to a JSON object.
   * @param chronicle - The Chronicle entity.
   * @returns A JSON object representing the Chronicle.
   */
  public chronicleToJson(chronicle: Chronicle): any {
    const chaptersJson = chronicle.chapters.map((chapter) => ({
      id: chapter.id,
      targetAgent: chapter.targetAgent.name,
      goal: chapter.goal,
      dependencies: chapter.dependencies.map((dep) => dep.id),
      context: chapter.inputContext || {},
      status: chapter.status,
    }));

    return {
      title: chronicle.title,
      goal: chronicle.goal,
      status: chronicle.status,
      chapters: chaptersJson,
    };
  }
}
