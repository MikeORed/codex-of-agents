// denotes visually that this entity is the aggregate root

import { DomainEvent } from "../../events";
import { Entity } from "./entity";

// and stores the overall domain events for publishing
export abstract class AggregateRoot<T> extends Entity<T> {
  // aggregates which implement this must create this method
  // to consolidate events from the full aggrgate root and children
  abstract retrieveDomainEvents(): DomainEvent[];
}
