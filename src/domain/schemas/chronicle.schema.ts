import { Schema } from "ajv";

/**
 * JSON Schema for Chapter structure
 */
export const chapterSchema: Schema = {
  type: "object",
  required: ["id", "targetAgent", "goal"],
  properties: {
    id: { type: "string" },
    targetAgent: { type: "string" },
    goal: { type: "string" },
    dependencies: {
      type: "array",
      items: { type: "string" },
    },
    context: {
      type: "object",
      additionalProperties: true,
    },
    status: {
      type: "string",
      enum: ["created", "ready", "inProgress", "complete", "failed"],
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
    title: { type: "string" },
    goal: { type: "string" },
    status: {
      type: "string",
      enum: ["created", "ready", "inProgress", "complete", "failed"],
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
export const generateChronicleInputSchema: Schema = {
  type: "object",
  required: ["command"],
  properties: {
    command: { type: "string" },
    context: {
      type: "object",
      additionalProperties: true,
    },
  },
};

/**
 * JSON Schema for the output of the generateChronicle tool
 */
export const generateChronicleOutputSchema: Schema = chronicleSchema;

/**
 * JSON Schema for Chapter response
 */
export const chapterResponseSchema: Schema = {
  type: "object",
  required: ["directResult", "outputContext"],
  properties: {
    directResult: { type: "string" },
    outputContext: {
      type: "object",
      additionalProperties: true,
    },
  },
};
