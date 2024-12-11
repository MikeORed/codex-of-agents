import { Chronicle } from "../../../domain/entities/agentic/chronicles/chronicle";
import { IChronicleExecutor } from "../../../domain/services/chronicle-executor/chronicle-executor";
import { IAgentRepository } from "../../../domain/repositories/agent.repository";
import { LlmService } from "../../../domain/services/llm-service/llm-service";

/**
 * Synchronous In-Memory Chronicle Executor.
 * Executes chapters in memory, respecting dependencies.
 */
export class SynchronousInMemoryChronicleExecutor
  implements IChronicleExecutor
{
  constructor(
    private readonly agentRepository: IAgentRepository,
    private readonly llmService: LlmService
  ) {}

  /**
   * Executes the provided chronicle synchronously in memory.
   * @param chronicle - The Chronicle entity to execute.
   */
  public async executeChronicle(chronicle: Chronicle): Promise<void> {
    // Initialize tracking sets
    const completedChapters = new Set<string>();
    const queuedChapters = new Set<string>();

    // Initialize chaptersToExecute with chapters that have no dependencies
    let chaptersToExecute = chronicle.chapters.filter(
      (chapter) => chapter.dependencies.length === 0
    );

    // Mark these chapters as queued
    chaptersToExecute.forEach((chapter) => queuedChapters.add(chapter.id));

    while (chaptersToExecute.length > 0) {
      const chapter = chaptersToExecute.shift();
      if (!chapter) {
        break;
      }

      console.log(`Executing chapter: ${chapter.id}`);

      // Grab the agent of the chapter
      const agent = chapter.targetAgent;

      // Gather context from dependencies
      const dependentContext = chapter.dependencies.reduce((acc, dep) => {
        const depChapter = chronicle.chapters.find((c) => c.id === dep.id);
        if (!depChapter) {
          throw new Error(`Dependency chapter ${dep.id} not found`);
        }

        if (!depChapter.outputContext) {
          throw new Error(`Dependency chapter ${dep.id} has no outputContext`);
        }

        // Structure the context per dependency
        acc[`chapter-${dep.id}`] = {
          chapterGoal: depChapter.goal,
          chapterResult: depChapter.outputContext,
        };
        return acc;
      }, {} as Record<string, { chapterGoal: string; chapterResult: Record<string, any> }>);

      try {
        // Execute the chapter
        const agentResult = await agent.execute(this.llmService, chapter.goal, {
          ...(chapter.inputContext ?? {}),
          ...dependentContext,
        });

        // Mark the chapter as complete
        chapter.status = "complete";
        chapter.outputContext = agentResult;
        completedChapters.add(chapter.id);
        console.log(`Chapter ${chapter.id} completed successfully.`);
      } catch (error) {
        console.error(`Error executing chapter ${chapter.id}:`, error);
        // Optionally, implement retry logic or mark the chapter as failed
        continue; // Skip to the next chapter
      }

      // Retrieve all chapters whose dependencies are now met
      const newlyAvailableChapters = chronicle.chapters.filter((ch) => {
        // Skip already completed chapters
        if (completedChapters.has(ch.id)) {
          return false;
        }

        // Skip chapters already queued for execution
        if (queuedChapters.has(ch.id)) {
          return false;
        }

        // Check if all dependencies are met
        return ch.dependencies.every((dep) => completedChapters.has(dep.id));
      });

      console.log(
        `Newly available chapters: ${newlyAvailableChapters
          .map((ch) => ch.id)
          .join(", ")}`
      );

      // Prevent infinite loop by detecting if no new chapters are available
      if (
        newlyAvailableChapters.length === 0 &&
        chaptersToExecute.length === 0 &&
        chronicle.chapters.some((ch) => !completedChapters.has(ch.id))
      ) {
        const unfinishedChapters = chronicle.chapters
          .filter((ch) => !completedChapters.has(ch.id))
          .map((ch) => ch.id)
          .join(", ");
        throw new Error(
          `Unable to resolve dependencies for chapters: ${unfinishedChapters}`
        );
      }

      // Add the newly available chapters to the queue and mark them as queued
      newlyAvailableChapters.forEach((ch) => {
        chaptersToExecute.push(ch);
        queuedChapters.add(ch.id);
      });
    }
  }
}
