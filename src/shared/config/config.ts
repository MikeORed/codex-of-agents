import convict from "convict";

// Define TypeScript interface for configuration
interface IConfig {
  environment: "dev" | "prod" | "staging";
  stage: string;
  defaultConverseModelId: string;
  logLevel: "DEBUG" | "INFO" | "WARN" | "ERROR" | "NONE";
  tools: {
    maxExecutionTime: number;
  };
  maxChronicleChapters: number;
  agentTableName: string;
}

const config = convict<IConfig>({
  agentTableName: {
    doc: "The dynamoDB tablename for the system",
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
    doc: "The environment being deployed to {dev, sit, pre, or prod}",
    format: String,
    default: "dev",
    env: "ENVIRONMENT",
  },
  stage: {
    doc: "A modifier for the environment being deployed, should affect entity name prefixes",
    format: String,
    default: "",
    env: "STAGE",
  },
  logLevel: {
    doc: "Minimum log level to output",
    format: ["DEBUG", "INFO", "WARN", "ERROR", "NONE"],
    default: "INFO",
    env: "LOG_LEVEL",
  },
  tools: {
    maxExecutionTime: {
      doc: "Maximum execution time for tools in milliseconds",
      format: Number,
      default: 10000,
      env: "TOOLS_MAX_EXECUTION_TIME",
    },
  },
  maxChronicleChapters: {
    doc: "Maximum number of chapters allowed in a chronicle",
    format: Number,
    default: 6,
    env: "MAX_CHRONICLE_CHAPTERS",
  },
}).validate({ allowed: "strict" });
export default config;
