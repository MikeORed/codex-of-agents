import { SumTool } from "../../../domain/entities/agentic/tools/sum-tool";
import { Tool, ToolProps } from "../../../domain/entities/agentic/tools/tool";
import { IToolRepository } from "../../../domain/repositories/tool.repository";

export class HardCodedToolRepository implements IToolRepository {
  private tools: Map<string, Tool> = new Map();

  constructor() {
    // Initialize agents upon repository creation
    this.initializeAgents();
  }

  private initializeAgents(): void {
    // Create the Executor agent
    const sumTool = new SumTool();

    // Add agents to the in-memory store
    this.tools.set(sumTool.id, sumTool);
  }

  // Find an agent by its ID
  async findById(id: string): Promise<Tool | null> {
    return this.tools.get(id) || null;
  }

  // Retrieve all agents
  async findAll(): Promise<Tool[]> {
    return Array.from(this.tools.values());
  }

  // Save or update an agent
  async save(agent: Tool): Promise<void> {
    this.tools.set(agent.id, agent);
  }

  // Delete an agent by its ID
  async delete(id: string): Promise<void> {
    this.tools.delete(id);
  }
}
