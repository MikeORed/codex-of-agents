import { logger, tracer } from "../monitor";

import { injectLambdaContext } from "@aws-lambda-powertools/logger/middleware";
import { captureLambdaHandler } from "@aws-lambda-powertools/tracer/middleware";

import middy from "@middy/core";
import { Handler } from "aws-lambda";

/**
 * Lambda Middy wrapper.
 * @param handler
 * @returns MiddyfiedHandler
 */
export const wrapper = <T extends Handler>(
  handler: T
): middy.MiddyfiedHandler => {
  return middy(handler)
    .use(injectLambdaContext(logger))
    .use(captureLambdaHandler(tracer));
};
