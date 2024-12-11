import { Session } from '../entities/agentic/sessions/session';
import { IBaseRepository } from './base.repository';

export interface ISessionRepository extends IBaseRepository<Session> {
  findByScribeId(scribeId: string): Promise<Session[]>;
}