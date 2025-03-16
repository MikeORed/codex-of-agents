import { Logger } from "@aws-lambda-powertools/logger";
import { Metrics } from "@aws-lambda-powertools/metrics";
import { Tracer } from "@aws-lambda-powertools/tracer";

export const tracer = new Tracer();
export const logger = new Logger();
export const metrics = new Metrics();

// Helper function to get a named logger
export function getLogger(
  internalLogger: Logger,
  name: string,
  additionalContext?: Record<string, any>
): Logger {
  return internalLogger.createChild({
    ...additionalContext,
    serviceName: name,
  });
}
