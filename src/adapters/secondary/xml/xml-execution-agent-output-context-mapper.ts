import { parseStringPromise } from "xml2js";

interface ChapterResponse {
  directResult: string;
  outputContext: Record<string, any>;
}

interface ChapterResponseXmlParserOptions {
  // Add any dependencies or configurations if needed
}

/**
 * Parser that converts Chapter response XML into structured ChapterResponse objects.
 * This belongs to the adapter layer (XML parsing and mapping logic).
 */
export class ChapterResponseXmlParser {
  constructor(private options: ChapterResponseXmlParserOptions = {}) {}

  /**
   * Parses an XML string representing a Chapter response and returns a ChapterResponse object.
   * @param xml - The XML string.
   * @returns A Promise that resolves to a ChapterResponse object.
   */
  public async parseXmlToChapterResponse(
    xml: string
  ): Promise<ChapterResponse> {
    const result = await parseStringPromise(xml, { explicitArray: false });

    // Assuming the root element is <response>
    const responseObj = result.response;
    if (!responseObj) {
      throw new Error("Invalid XML format: Missing <response> root element.");
    }

    // Extract directResult
    const directResult: string = responseObj.directResult;
    if (!directResult) {
      throw new Error("Invalid XML format: Missing <directResult> element.");
    }

    // Extract outputContext
    const outputContextObj = responseObj.outputContext;
    let outputContext: Record<string, any> = {};

    if (outputContextObj && outputContextObj.context) {
      const contexts = Array.isArray(outputContextObj.context)
        ? outputContextObj.context
        : [outputContextObj.context];

      for (const context of contexts) {
        const name = context.$?.name;
        const value = context._ || context;
        if (!name) {
          throw new Error(
            "Invalid XML format: <context> element missing 'name' attribute."
          );
        }
        outputContext[name] = value;
      }
    }

    return {
      directResult,
      outputContext,
    };
  }
}
