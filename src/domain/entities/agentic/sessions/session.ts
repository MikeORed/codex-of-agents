import { Entity } from "../../base/entity";
import { Scribe } from "../agents/scribe";
import { Interaction } from "./interaction";

export interface SessionProps {
  scribe: Scribe;
  interactions: Interaction[];
  systemPrompt?: string;
  guardrails?: string[];
}

export class Session extends Entity<SessionProps> {
  constructor(
    props: SessionProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
  }

  public get scribe(): Scribe {
    return this.props.scribe;
  }

  public get interactions(): Interaction[] {
    return this.props.interactions;
  }

  public get systemPrompt(): string | undefined {
    return this.props.systemPrompt;
  }

  public get guardrails(): string[] | undefined {
    return this.props.guardrails;
  }

  public addInteraction(interaction: Interaction): void {
    this.props.interactions.push(interaction);
    this.setUpdatedDate();
  }
}