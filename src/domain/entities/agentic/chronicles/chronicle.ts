import { Entity } from "../../base/entity";
import { Chapter } from "./chapter";

export type ChronicleStatus =
  | "created"
  | "ready"
  | "inProgress"
  | "complete"
  | "failed";

export interface ChronicleProps {
  title: string;
  goal: string;
  status?: ChronicleStatus;
  chapters: Chapter[]; // List of Chapter entities
}

export class Chronicle extends Entity<ChronicleProps> {
  constructor(
    props: ChronicleProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);

    // Set default status if not provided
    this.props.status = this.props.status ?? "created";
  }

  public get title(): string {
    return this.props.title;
  }

  public get goal(): string {
    return this.props.goal;
  }

  public get status(): ChronicleStatus {
    return this.props.status!;
  }

  public set status(status: ChronicleStatus) {
    this.props.status = status;
    this.setUpdatedDate();
  }

  public get chapters(): Chapter[] {
    return this.props.chapters;
  }

  public addChapter(chapter: Chapter): void {
    this.props.chapters.push(chapter);
    this.setUpdatedDate();
  }

  // Additional methods as needed
}
