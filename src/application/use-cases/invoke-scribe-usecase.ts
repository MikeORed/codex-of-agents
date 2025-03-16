import { IAgentRepository } from "../../domain/repositories/agent.repository";
import { InvokeScribeDto } from "../dtos/invoke-scribe-dto";
import { Scribe } from "../../domain/entities/agentic/agents/scribe";
import { LlmService } from "../../domain/services/llm-service/llm-service";
import { IChronicleExecutor } from "../../domain/services/chronicle-executor/chronicle-executor";
import { SynchronousInMemoryChronicleExecutor } from "../../adapters/secondary/chronicle-executor/synchronous-in-memory-chrocnicle-executor";
import { logger } from "../../shared/monitor";

export class InvokeScribeUseCase {
  private readonly chronicleExecutor: IChronicleExecutor;

  constructor(
    private readonly agentRepository: IAgentRepository,
    //private readonly sessionRepository: ISessionRepository,
    private readonly llmService: LlmService
  ) {
    this.chronicleExecutor = new SynchronousInMemoryChronicleExecutor(
      agentRepository,
      llmService
    );
  }

  public async execute(dto: InvokeScribeDto): Promise<void> {
    // Get the scribe from repository
    const scribe = (await this.agentRepository.findById(
      dto.scribeId
    )) as Scribe;
    if (!scribe) {
      throw new Error(`Scribe with id ${dto.scribeId} not found`);
    }

    await scribe.generateChronicle(this.llmService, dto.command, {});
    const chronicle = scribe.chronicle;

    if (!chronicle) {
      throw new Error(`Chronicle not generated for scribe ${dto.scribeId}`);
    }

    //TODO: Make more elegant
    //At this time, to just prevent runaways, I'm putting a hard chapter limit of 6 into the code
    //This'll flow into a better config field probably next commit, but for now this is in here for our protection
    //Remove at your own peril/discretion
    if (chronicle.chapters.length > 6) {
      throw new Error(
        `Chronicle has too many chapters: ${chronicle.chapters.length}`
      );
    }

    // Execute the chronicle using the injected executor
    try {
      await this.chronicleExecutor.executeChronicle(chronicle);
    } catch (error) {
      logger.error(`Error executing chronicle: ${chronicle.id}`, { error });
      throw error; // Rethrow or handle accordingly
    }

    logger.info("Chronicle execution completed.", {
      chapters: chronicle.chapters,
    });
  }
}
