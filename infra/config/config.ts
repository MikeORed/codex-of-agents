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
}

export const config = convict<IConfig>({
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
}).validate({ allowed: "strict" });
