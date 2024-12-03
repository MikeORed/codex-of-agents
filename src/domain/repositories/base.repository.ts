export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<void>;
  delete(id: string): Promise<void>;
}

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(): Promise<T[]>;
  abstract save(entity: T): Promise<void>;
  abstract delete(id: string): Promise<void>;
}