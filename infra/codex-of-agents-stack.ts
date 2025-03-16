import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import config from "./config";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodeJsFunction from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export class CodexOfAgentsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Determine the suffix based on stage or environment
    const envSuffix = getEnvSuffix(
      config.get("environment"),
      config.get("stage")
    );

    // Decide on the naming convention
    const useKebabCase = true; // Set to false for camelCase

    const baseFunctionName = "invokeScribe";
    const formattedBaseName = formatName(
      baseFunctionName,
      useKebabCase ? "kebab" : "camel"
    );

    // Construct the Lambda function name
    const lambdaFunctionName = `${formattedBaseName}-${envSuffix}`;

    // Define the Lambda function using NodejsFunction with esbuild bundling
    const invokeScribeLambda = new nodeJsFunction.NodejsFunction(
      this,
      "InvokeScribeLambda",
      {
        functionName: lambdaFunctionName,
        runtime: lambda.Runtime.NODEJS_18_X, // Choose appropriate runtime
        handler: "handler", // Name of the exported handler function
        entry: path.join(
          __dirname,
          "../src/adapters/primary/invokescribe-apigateway-adapter/invokescribe-apigateway-adapter.ts"
        ), // Path to your Lambda code
        bundling: {
          minify: true,
          sourceMap: false,
          target: "es2020",
        },
        timeout: cdk.Duration.seconds(30), // Adjust timeout as needed
        environment: {
          ENVIRONMENT: getEnvSuffix(
            config.get("stage"),
            config.get("environment")
          ),
          DEFAULT_CONVERSE_MODEL_ID: config.get("defaultConverseModelId"),
          // Add other necessary environment variables
        },
      }
    );

    invokeScribeLambda.addToRolePolicy(
      new cdk.aws_iam.PolicyStatement({
        actions: [
          "bedrock:InvokeModel",
          "bedrock:InvokeModelWithResponseStream",
        ],
        resources: [
          `arn:aws:bedrock:*::foundation-model/${config.get(
            "defaultConverseModelId"
          )}`,
        ],
      })
    );

    // The code that defines your stack goes here
  }
}

export const getEnvSuffix = (environment: string, stage?: string): string => {
  return stage && stage.trim() !== "" ? stage : environment;
};

export const formatName = (
  baseName: string,
  format: "camel" | "kebab"
): string => {
  switch (format) {
    case "kebab":
      // Convert camelCase or PascalCase to kebab-case
      return baseName
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
    case "camel":
    default:
      return baseName;
  }
};
