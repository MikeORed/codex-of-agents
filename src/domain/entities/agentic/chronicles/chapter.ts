import { Entity } from "../../base/entity";
import { Agent } from "../agents/agent";

export type ChapterStatus =
  | "created"
  | "ready"
  | "inProgress"
  | "complete"
  | "failed";

export interface ChapterProps {
  targetAgent: Agent; // Reference to an Agent entity
  goal: string;
  status?: ChapterStatus;
  inputContext?: Record<string, any>;
  outputContext?: Record<string, any>;
  dependencies?: Chapter[]; // References to other Chapter entities
}

export class Chapter extends Entity<ChapterProps> {
  constructor(
    props: ChapterProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);

    // Set default status if not provided
    this.props.status = this.props.status ?? "created";
    // Initialize dependencies if not provided
    this.props.dependencies = this.props.dependencies ?? [];
  }

  public get targetAgent(): Agent {
    return this.props.targetAgent;
  }

  public get goal(): string {
    return this.props.goal;
  }

  public get status(): ChapterStatus {
    return this.props.status!;
  }

  public set status(status: ChapterStatus) {
    this.props.status = status;
    this.setUpdatedDate();
  }

  public get inputContext(): Record<string, any> | undefined {
    return this.props.inputContext;
  }

  public set inputContext(context: Record<string, any>) {
    this.props.inputContext = context;
    this.setUpdatedDate();
  }

  public get outputContext(): Record<string, any> | undefined {
    return this.props.outputContext;
  }

  public set outputContext(context: Record<string, any>) {
    this.props.outputContext = context;
    this.setUpdatedDate();
  }

  public get dependencies(): Chapter[] {
    return this.props.dependencies!;
  }

  public addDependency(chapter: Chapter): void {
    if (!this.props.dependencies!.includes(chapter)) {
      this.props.dependencies!.push(chapter);
      this.setUpdatedDate();
    }
  }

  // Additional methods as needed
}
