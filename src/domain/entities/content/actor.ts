import { DocumentProps, Document } from "./document";

export interface ActorProps extends DocumentProps {
  name: string;
  ancestry: string;
  class: string;
  traits: string[];

  // Other properties as needed
}

export abstract class Actor extends Document<ActorProps> {
  protected constructor(
    props: ActorProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
    // Additional props wanted? Have a think
  }

  // Actor-specific methods can be added here
}
