import convict from "convict";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables from .env file, if available
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

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
}

const config = convict<IConfig>({
  environment: {
    doc: "The application environment.",
    format: ["dev", "prod", "staging"],
    default: "dev",
    env: "ENVIRONMENT",
  },
  stage: {
    doc: "Deployment stage name.",
    format: String,
    default: "",
    env: "STAGE",
  },
  defaultConverseModelId: {
    doc: "Default converse model identifier.",
    format: String,
    default: "amazon.nova-micro-v1:0",
    env: "DEFAULT_CONVERSE_MODEL_ID",
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
