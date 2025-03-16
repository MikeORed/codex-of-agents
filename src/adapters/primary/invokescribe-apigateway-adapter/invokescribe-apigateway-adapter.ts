import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { InvokeScribeDto } from "../../../application/dtos/invoke-scribe-dto";
import * as schema from "../../../application/schemas/invoke-scribe-dto.schema.json";
import { InvokeScribeUseCase } from "../../../application/use-cases/invoke-scribe-usecase";

import { validate } from "../../../shared/utils";
import { AwsBedrockLlmService } from "../../secondary/llm-service/bedrock-llm-service";
import { HardcodedAgentRepository } from "../../repositories/hardcoded/hardcoded-agent-repository";
import { wrapper } from "../../../shared/wrapper/wrapper";

import { logger } from "../../../shared/monitor";

const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    logger.info(JSON.stringify(event));
    logger.info(JSON.stringify(event.body));
    // Ensure the body exists
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request: Missing body" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    // Parse the JSON body
    let dto: InvokeScribeDto;
    try {
      dto = JSON.parse(event.body) as InvokeScribeDto;
    } catch (parseError) {
      logger.error("Error parsing request body:", { parseError });
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Bad Request: Invalid JSON" }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    const validationResult = await validate<InvokeScribeDto>(schema, dto);
    if (!validationResult.isValid) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Bad Request: Validation failed",
          errors: validationResult.validationErrors,
        }),
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      };
    }

    const useCase = new InvokeScribeUseCase(
      new HardcodedAgentRepository(),
      new AwsBedrockLlmService()
    );

    await useCase.execute(dto);

    // Placeholder response using the parsed DTO
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Success", data: dto }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // CORS enabled
        "Access-Control-Allow-Credentials": true,
      },
    };
  } catch (error) {
    logger.error("Error processing request:", { error });
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    };
  }
};

export const handler = wrapper(lambdaHandler);
