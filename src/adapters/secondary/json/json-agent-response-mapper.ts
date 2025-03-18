import { logger } from "../../../shared/monitor";
import { chapterResponseSchema } from "../../../domain/schemas";
import { validateWithThrow } from "../../../shared/utils";

interface ChapterResponse {
  directResult: string;
  outputContext: Record<string, any>;
}

interface JsonAgentResponseMapperOptions {
  // Add any dependencies or configurations if needed
}

/**
 * Mapper that handles JSON responses from agents.
 * This belongs to the adapter layer (JSON parsing and mapping logic).
 */
export class JsonAgentResponseMapper {
  constructor(private options: JsonAgentResponseMapperOptions = {}) {}

  /**
   * Parses a JSON string or object representing an agent response and returns a ChapterResponse object.
   * @param response - The JSON string or object.
   * @returns A ChapterResponse object.
   */
  public parseAgentResponse(response: string | any): ChapterResponse {
    let responseObj: any;

    if (typeof response === "string") {
      try {
        responseObj = JSON.parse(response);
      } catch (error) {
        logger.error("Failed to parse agent response JSON", {
          error,
          response,
        });
        throw new Error(`Invalid JSON format in agent response: ${error}`);
      }
    } else {
      responseObj = response;
    }

    // Validate the response against the schema
    try {
      validateWithThrow(chapterResponseSchema, responseObj, "Agent response");
    } catch (error) {
      logger.error("Agent response validation failed", { error, responseObj });

      // If validation fails but we have the minimum required fields,
      // we can still try to proceed with a warning
      if (responseObj.directResult !== undefined) {
        logger.warn("Proceeding with invalid agent response format", {
          responseObj,
        });
      } else {
        throw error;
      }
    }

    // Extract the direct result and output context
    const directResult = responseObj.directResult || "";
    const outputContext = responseObj.outputContext || {};

    return {
      directResult,
      outputContext,
    };
  }

  /**
   * Converts a ChapterResponse object to a JSON string.
   * @param response - The ChapterResponse object.
   * @returns A JSON string representing the ChapterResponse.
   */
  public agentResponseToJson(response: ChapterResponse): string {
    return JSON.stringify({
      directResult: response.directResult,
      outputContext: response.outputContext,
    });
  }
}
