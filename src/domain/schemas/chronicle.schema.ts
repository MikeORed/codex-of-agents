import { Schema } from "ajv";

/**
 * JSON Schema for Chapter structure
 */
export const chapterSchema: Schema = {
  type: "object",
  required: ["id", "targetAgent", "goal"],
  properties: {
    id: {
      type: "string",
      pattern: "^c[0-9]+$",
      description: "Unique identifier for the chapter (e.g., 'c1')",
    },
    targetAgent: {
      type: "string",
      description: "The name of the agent that will execute this chapter",
    },
    goal: {
      type: "string",
      description: "The specific objective for this chapter to accomplish",
    },
    context: {
      type: "string",
      description:
        "Detailed information needed by the agent to execute this chapter",
    },
    dependencies: {
      type: "array",
      description:
        "IDs of chapters that must be completed before this chapter can start",
      items: {
        type: "string",
        pattern: "^c[0-9]+$",
      },
    },
  },
};

/**
 * JSON Schema for Chronicle structure
 */
export const chronicleSchema: Schema = {
  type: "object",
  required: ["title", "goal", "chapters"],
  properties: {
    title: {
      type: "string",
      description: "Title of the chronicle",
    },
    goal: {
      type: "string",
      description: "Overall goal this chronicle aims to accomplish",
    },
    chapters: {
      type: "array",
      items: chapterSchema,
    },
  },
};

/**
 * JSON Schema for the input to the generateChronicle tool
 */
export const generateChronicleInputSchema: Schema = chronicleSchema;

/**
 * JSON Schema for the output of the generateChronicle tool
 */
export const generateChronicleOutputSchema: Schema = chronicleSchema;

/**
 * JSON Schema for Chapter response
 */
export const chapterResponseSchema: Schema = {
  type: "object",
  properties: {
    directResult: {
      type: "string",
      description: "The main result or finding from this chapter",
    },
    outputContext: {
      type: "object",
      description: "Key structured data extracted from the chapter execution",
      additionalProperties: {
        type: "string",
      },
    },
  },
  required: ["directResult"],
  additionalProperties: false,
};
