import {
  ConverseCommandInput,
  ConverseCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

export abstract class LlmService {
  abstract execute(
    request: ConverseCommandInput
  ): Promise<ConverseCommandOutput>;
}
