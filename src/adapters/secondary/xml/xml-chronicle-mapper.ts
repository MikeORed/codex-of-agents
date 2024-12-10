import { parseStringPromise } from "xml2js";
import { Chronicle } from "../../../domain/entities/agentic/chronicles/chronicle";
import { Chapter } from "../../../domain/entities/agentic/chronicles/chapter";
import { Agent } from "../../../domain/entities/agentic/agents/agent";

interface ChronicleXmlMapperOptions {
  agentResolver: (agentName: string) => Agent;
  chapterResolver?: (chapterId: string) => Chapter;
}

/**
 * Mapper that converts Chronicle XML into Chronicle entities.
 * This belongs to the adapter layer (XML parsing and mapping logic).
 */
export class ChronicleXmlMapper {
  private agentResolver: (agentName: string) => Agent;
  private chapterResolver?: (chapterId: string) => Chapter;

  constructor(options: ChronicleXmlMapperOptions) {
    this.agentResolver = options.agentResolver;
    this.chapterResolver = options.chapterResolver;
  }

  /**
   * Parses an XML string representing a Chronicle and returns a Chronicle entity.
   * @param xml - The XML string.
   * @returns A Promise that resolves to a Chronicle entity.
   */
  public async parseXmlToChronicle(xml: string): Promise<Chronicle> {
    const result = await parseStringPromise(xml, { explicitArray: false });
    console.log(JSON.stringify(result));
    // The parsed object structure may vary depending on your XML.
    // Assuming:
    // result.chronicle.title
    // result.chronicle.goal
    // result.chronicle.chapter is either a single object or an array of objects.

    const chronicleObj = result.chronicle;
    const title: string = chronicleObj.title;
    const goal: string = chronicleObj.goal;

    let chaptersRaw = chronicleObj.chapter;
    if (!chaptersRaw) {
      chaptersRaw = [];
    } else if (!Array.isArray(chaptersRaw)) {
      chaptersRaw = [chaptersRaw];
    }

    // First, create chapters without resolving dependencies.
    const chaptersById = new Map<string, Chapter>();

    for (const chObj of chaptersRaw) {
      // chapter may have attributes in chObj.$ if from attributes, or directly if from nested elements
      const chapterId =
        chObj.$?.id ??
        chObj.id ??
        (function () {
          throw new Error("Chapter without an ID found in XML.");
        })();

      const targetAgentName = chObj.targetAgent;
      if (!targetAgentName) {
        throw new Error(`Chapter ${chapterId} missing <targetAgent>.`);
      }
      const targetAgent = this.agentResolver(targetAgentName);

      const chapterGoal = chObj.goal || "No goal specified";
      const chapterContext = chObj.context;
      // Decide how to handle context; if it's a string, we can store it in inputContext as { text: chapterContext }.
      // If context is more complex, parse accordingly.
      const inputContext = chapterContext
        ? { text: chapterContext }
        : undefined;

      const chapter = new Chapter(
        {
          targetAgent: targetAgent,
          goal: chapterGoal,
          inputContext: inputContext,
          // outputContext: not specified, so none initially
          // dependencies: resolve after second pass
        },
        chapterId
      );

      chaptersById.set(chapterId, chapter);
    }

    // Second pass: resolve dependencies.
    for (const chObj of chaptersRaw) {
      const chapterId = chObj.$?.id ?? chObj.id;
      const chapter = chaptersById.get(chapterId)!;

      if (chObj.dependencies && chObj.dependencies.dependency) {
        let depIds = chObj.dependencies.dependency;
        if (!Array.isArray(depIds)) {
          depIds = [depIds];
        }

        for (const depId of depIds) {
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
      title: title,
      goal: goal,
      chapters: chapters,
    });

    return chronicle;
  }
}
