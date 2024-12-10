import convict from "convict";

export const config = convict({
  agentTableName: {
    doc: "The database table for agents their memories and perosnalities",
    format: String,
    default: "agentTableName",
    env: "AGENT_TABLE_NAME",
  },
  defaultConverseModelId: {
    doc: "The default model to use for conversing",
    format: String,
    default: "amazon.nova-micro-v1:0",
    env: "DEFAULT_CONVERSE_MODEL_ID",
  },
  environment: {
    doc: "The environmnt being deployed to {dev, sit, pre, or prod}",
    format: String,
    default: "dev",
    env: "ENVIRONMENT",
  },
  stage: {
    doc: "A modifier for the enviornment being deployed, should affect entity name prefixes",
    format: String,
    default: "",
    env: "STAGE",
  },
}).validate({ allowed: "strict" });
