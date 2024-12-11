# 🛠️ First Steps: Getting Started with the Chronicle Executor and Lambda 🛠️

Welcome to the **Codex of Agents**! 🚀 This guide will help you get started with testing the newly introduced **Chronicle Executor** and **AWS Lambda function**. These steps will ensure you can effectively deploy and test your Lambda function using simple agents powered by LLMs.

**NOTE**: My solution makes use of AWS Bedrock for executing it's flows, and while you're likely to stay in Free Tier for lambda, any use of Bedrock will cost money, so please review those costs prior to committing to executing this cose.

## 📋 Table of Contents

1. Prerequisites
2. Accessing Your AWS Console
3. Requesting Access to AWS Bedrock Models
4. Setting Up and Executing the Test Event
5. Viewing Execution Results in CloudWatch Logs

## 📝 1. Prerequisites

Before you begin, ensure you have the following:

**AWS Account:** Access to the AWS Management Console with permissions to manage Lambda functions and AWS Bedrock.
**AWS CLI:** Installed and configured with your AWS credentials.
**Node.js and npm:** Installed on your local machine for any local setup or configuration.
**Project Repository:** Cloned from your Git repository.

## 🔑 2. Accessing Your AWS Console

#### 1. Log In to AWS:

- Navigate to the AWS Management Console.
- Enter your AWS credentials to log in.

#### 2. Navigate to Lambda Services:

- In the AWS Console search bar, type "Lambda" and select "Lambda" from the dropdown.

#### 3. Locate Your Deployed Lambda Function:

- In the Lambda dashboard, click on "Functions" in the sidebar.
- Search for your deployed function (e.g., `invoke-scribe-env`) using the search bar.
- Click on the function name to view its details.

## 🔍 3. Requesting Access to AWS Bedrock Models

Before your Lambda function can interact with AWS Bedrock models, you need to ensure you have the necessary access.

#### 1. Access AWS Bedrock:

- In the AWS Console search bar, type "Bedrock" and select "Bedrock" from the dropdown.

#### 2. Request Model Access:

- Navigate to the "Models" section.
- Locate the model specified in your .env file or the default model defined in infra/config.ts.
- Click on the model and select "Request Access".
- Fill out any required information and submit your request.
- **Note:** Access approval times may vary. Ensure you have the necessary permissions or reach out to AWS support if needed.

#### 3. Verify Access:

- Once approved, you should see the model listed as "Available" in the Bedrock Models section.

## ⚙️ 4. Setting Up and Executing the Test Event

Now that your Lambda function is found and we have bedrock accessible, let's set up a test event to execute it.

### a. Creating a Test Event

#### 1. Navigate to the "Test" Tab:

- In your Lambda function's dashboard, click on the "Test" tab.

#### 2. Create a New Test Event:

- Click on the "Test" button to create a new test event.
- Event Name: Enter a name for your test event (e.g., PetRecommendationTest).
- Event Template: Choose `apigateway-aws-proxy` as a starting point.
- Event Payload: Replace the default JSON body property's value with the following content or a similar one (the id is for the only scribe available in our hardcoded scribe repository):

```
"{
  \"scribeId\": \"5e27966d-1764-4ff7-8c68-9d17210a325b\",
  \"command\": \"Provide comprehensive pet recommendations tailored for a family with children and an existing cat. First, compile a list of the top dog breeds, top cat breeds, and top bird breeds based on factors such as temperament, compatibility, and care requirements. Then, evaluate all breeds for the two most suitable pet breed options for the family across all breeds, and provide context why, considering harmony with the existing cat and suitability for a household with children. Ensure each list's format gives breed title, their description, and a letter grade estimation of the properties we're asking for. Don't include the context about the household being a family, having a cat, or having a young child in the initial lookups, only use it in the final evaluation step.\"
}"
```

**Note:** Those escapes are purposeful, as the body property is a stringified json you should be able to just replace the entirety of the body property's value via copy and paste.

- Save the Test Event: Click "Create" to save the test event.

### b. Executing the Test

#### 1. Run the Test Event:

- With the test event selected, click on the "Test" button to execute the Lambda function with the provided input.

#### 2. Monitor Execution:

- Immediately after execution, the Lambda function will process the event.
- Click on "Monitor" in the Lambda function's dashboard to access metrics and logs.

# 📊 5. Viewing Execution Results in CloudWatch Logs

To verify that your Lambda function executed correctly and to view the generated recommendations:

#### 1. Access CloudWatch Logs:

- In the Lambda function's dashboard, navigate to the "Monitoring" tab.
- Click on "View logs in CloudWatch". This will redirect you to the CloudWatch Logs dashboard.
- Click on the latest log stream to view the most recent execution logs.

#### 2. Review the Logs:

- Execution Steps: Look for console logs detailing each execution step, such as chapter executions and dependency handling.
- Dependent Context: Observe how the executor structures and utilizes dependent context from completed chapters.
- Final Output: Check for the comprehensive pet recommendations generated based on your command.
- Errors: Any issues during execution will be logged here for troubleshooting.

**Example Log Output:**

### Chronicle Generation

```
2024-12-10T23:07:05.860Z	1b6cd635-e94e-4344-b529-e671716f35d8	INFO
{
    "chronicle": {
        "chapter": [
            {
                "$": {
                    "id": "c1"
                },
                "targetAgent": "LLM Executor",
                "goal": "Compile a list of the top dog breeds based on temperament, compatibility, and care requirements",
                "context": "Provide a list of dog breeds with their descriptions and a letter grade estimation for temperament, compatibility, and care requirements"
            },
            {
                "$": {
                    "id": "c2"
                },
                "targetAgent": "LLM Executor",
                "goal": "Compile a list of the top cat breeds based on temperament, compatibility, and care requirements",
                "context": "Provide a list of cat breeds with their descriptions and a letter grade estimation for temperament, compatibility, and care requirements"
            },
            {
                "$": {
                    "id": "c3"
                },
                "targetAgent": "LLM Executor",
                "goal": "Compile a list of the top bird breeds based on temperament, compatibility, and care requirements",
                "context": "Provide a list of bird breeds with their descriptions and a letter grade estimation for temperament, compatibility, and care requirements"
            },
            {
                "$": {
                    "id": "c4"
                },
                "targetAgent": "LLM Executor",
                "dependencies": {
                    "dependency": [
                        "c1",
                        "c2",
                        "c3"
                    ]
                },
                "goal": "Evaluate all breeds for the two most suitable pet breed options for the family across all breeds",
                "context": "Evaluate the compiled lists of dog, cat, and bird breeds to determine the two most suitable pet breed options for a family with children and an existing cat, considering harmony with the existing cat and suitability for a household with children"
            }
        ]
    }
}
```

#### Final Chapter Result

```
{
    "outputContext": {
        "directResult": "The two most suitable pet breed options for a family with children and an existing cat are: 1) Golden Retriever (dog) and 2) Ragdoll (cat). These breeds are known for their friendly temperament, compatibility with children and other pets, and manageable care requirements.",
        "outputContext": {
            "suitablePetBreeds": "Golden Retriever, Ragdoll"
        }
    }
}

```

#### 4. Analyze the Results

- Ensure that the final output aligns with your command's requirements.
- Verify that each breed list includes the breed title, description, and letter grade.
- Confirm that the final evaluation considers harmony with the existing cat and suitability for a household with children.
- Tweak the input and see how things change, this is just the first step so there are plenty of kinks we'll be working out.
- If you notice the chronicle doesn't develop correctly each time, I recommend going up a step when it comes to the quality of the Bedrock available model you're checking out.
