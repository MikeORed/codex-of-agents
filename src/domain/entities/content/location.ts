import { DocumentProps, Document } from "./document";

export interface LocationProps extends DocumentProps {
  name: string;
  description: string;
  // Other properties as needed
}

export abstract class Location extends Document<LocationProps> {
  protected constructor(
    props: LocationProps,
    id?: string,
    created?: string,
    updated?: string
  ) {
    super(props, id, created, updated);
    // Additional props wanted? Have a think
  }

  // Location-specific methods can be added here
}
