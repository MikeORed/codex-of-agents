import { Chronicle } from "../../entities/agentic/chronicles/chronicle";

export interface IChronicleExecutor {
  /**
   * Executes the provided chronicle.
   * @param chronicle - The Chronicle entity to execute.
   * @returns A Promise that resolves when execution is complete.
   */
  executeChronicle(chronicle: Chronicle): Promise<void>;
}
