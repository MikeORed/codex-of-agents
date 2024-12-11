import { Interaction } from '../entities/agentic/sessions/interaction';
import { IBaseRepository } from './base.repository';

export interface IInteractionRepository extends IBaseRepository<Interaction> {
  findBySessionId(sessionId: string): Promise<Interaction[]>;
  findBySessionIdAndAgentId(sessionId: string, agentId: string): Promise<Interaction[]>;
}