import {
  BedrockRuntimeClient,
  ConverseCommand,
  ConverseCommandInput,
  ConverseCommandOutput,
} from "@aws-sdk/client-bedrock-runtime";

export class AwsBedrockLlmService {
  private bedrockClient: BedrockRuntimeClient;

  constructor() {
    this.bedrockClient = new BedrockRuntimeClient({ region: "us-east-1" });
  }

  public async execute(
    request: ConverseCommandInput
  ): Promise<ConverseCommandOutput> {
    // Call Bedrock Converse API
    const bedrockResponse = await this.bedrockClient.send(
      new ConverseCommand(request)
    );

    return bedrockResponse;
  }
}
