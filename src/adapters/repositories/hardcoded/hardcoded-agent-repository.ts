import {
  Agent,
  AgentProps,
} from "../../../domain/entities/agentic/agents/agent";
import {
  BaseAgent,
  BaseAgentProps,
} from "../../../domain/entities/agentic/agents/base-agent";
import {
  Scribe,
  ScribeProps,
} from "../../../domain/entities/agentic/agents/scribe";
import { IAgentRepository } from "../../../domain/repositories/agent.repository";

export class HardcodedAgentRepository implements IAgentRepository {
  private agents: Map<string, BaseAgent<BaseAgentProps>> = new Map();

  constructor() {
    // Initialize agents upon repository creation
    this.initializeAgents();
  }

  private initializeAgents(): void {
    // Create the Executor agent
    const llmExecutionAgentProps: AgentProps = {
      name: "LLM Executor",
      description: "Simply Executes LLMs with a prompt",
      supllementalInstructions: [
        "Based on the incoming goal and input simply attempt to resolve the goal within your power",
      ],
      // No tools for the Executor agent
    };

    const llmExecutionAgentId = "8b7e9504-5a3c-4312-b725-94b2132e7282";
    const llmExecutionAgent = new Agent(
      llmExecutionAgentProps,
      llmExecutionAgentId
    );

    // Create the Scribe agent, referencing the Executor
    const distributedLLMScribeProps: ScribeProps = {
      name: "SimpleLLMScribe",
      description: "Splits sub requests for llms to other agents",
      supllementalInstructions: [
        "Identify each distinct query needed for llm evaluation, and mark each of those as a distinct action to be evaluated.",
      ],
      agents: [llmExecutionAgent],
      // Add other Scribe-specific properties if needed
    };

    const distributedLLMScribe = new Scribe(
      distributedLLMScribeProps,
      "5e27966d-1764-4ff7-8c68-9d17210a325b"
    );

    // Add agents to the in-memory store
    this.agents.set(llmExecutionAgent.id, llmExecutionAgent);
    this.agents.set(distributedLLMScribe.id, distributedLLMScribe);
  }

  // Find an agent by its ID
  async findById(id: string): Promise<BaseAgent<BaseAgentProps> | null> {
    return this.agents.get(id) || null;
  }

  // Retrieve all agents
  async findAll(): Promise<BaseAgent<BaseAgentProps>[]> {
    return Array.from(this.agents.values());
  }

  // Save or update an agent
  async save(agent: BaseAgent<BaseAgentProps>): Promise<void> {
    this.agents.set(agent.id, agent);
  }

  // Delete an agent by its ID
  async delete(id: string): Promise<void> {
    this.agents.delete(id);
  }
}
