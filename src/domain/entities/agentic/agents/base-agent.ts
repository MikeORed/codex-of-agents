import { Entity } from "../../base/entity";

export interface BaseAgentProps {
  name: string;
  // Include other common properties if needed
}

export abstract class BaseAgent<T extends BaseAgentProps> extends Entity<T> {
  constructor(props: T, id?: string, created?: string, updated?: string) {
    super(props, id, created, updated);
  }

  public get name(): string {
    return this.props.name;
  }

  // Abstract methods chronicle (plans) then execute those chronicles
  public abstract execute(): Promise<void>;
}
