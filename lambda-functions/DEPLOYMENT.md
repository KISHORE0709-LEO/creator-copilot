# Lambda Functions Deployment Guide

## Prerequisites
- AWS CLI configured with your credentials
- Node.js 24.x runtime

## Lambda Functions Created
1. **generateHook** - Generates engaging hooks for social media
2. **generateAssembly** - Adapts content for multiple platforms
3. **translateContent** - Translates content with cultural awareness

## Deployment Steps

### 1. Create IAM Role for Lambda
```bash
aws iam create-role --role-name CreatorCopilotLambdaRole --assume-role-policy-document '{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {"Service": "lambda.amazonaws.com"},
    "Action": "sts:AssumeRole"
  }]
}'

aws iam attach-role-policy --role-name CreatorCopilotLambdaRole --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

aws iam attach-role-policy --role-name CreatorCopilotLambdaRole --policy-arn arn:aws:iam::aws:policy/AmazonBedrockFullAccess
```

### 2. Package and Deploy Each Lambda

#### Lambda 1: generateHook
```bash
cd lambda-functions
zip generateHook.zip generateHook.mjs

aws lambda create-function \
  --function-name generateHook \
  --runtime nodejs24.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/CreatorCopilotLambdaRole \
  --handler generateHook.handler \
  --zip-file fileb://generateHook.zip \
  --timeout 30 \
  --memory-size 512 \
  --region us-east-1
```

#### Lambda 2: generateAssembly
```bash
zip generateAssembly.zip generateAssembly.mjs

aws lambda create-function \
  --function-name generateAssembly \
  --runtime nodejs24.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/CreatorCopilotLambdaRole \
  --handler generateAssembly.handler \
  --zip-file fileb://generateAssembly.zip \
  --timeout 30 \
  --memory-size 512 \
  --region us-east-1
```

#### Lambda 3: translateContent
```bash
zip translateContent.zip translateContent.mjs

aws lambda create-function \
  --function-name translateContent \
  --runtime nodejs24.x \
  --role arn:aws:iam::YOUR_ACCOUNT_ID:role/CreatorCopilotLambdaRole \
  --handler translateContent.handler \
  --zip-file fileb://translateContent.zip \
  --timeout 30 \
  --memory-size 512 \
  --region us-east-1
```

### 3. Create API Gateway

```bash
# Create REST API
aws apigateway create-rest-api --name CreatorCopilotAPI --region us-east-1

# Get API ID (replace YOUR_API_ID below)
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='CreatorCopilotAPI'].id" --output text)

# Get root resource ID
ROOT_ID=$(aws apigateway get-resources --rest-api-id $API_ID --query "items[?path=='/'].id" --output text)

# Create resources for each endpoint
aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part generate-hook
aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part generate-assembly
aws apigateway create-resource --rest-api-id $API_ID --parent-id $ROOT_ID --path-part translate-content
```

### 4. Add Environment Variables to .env

```env
VITE_LAMBDA_GENERATE_HOOK=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/generate-hook
VITE_LAMBDA_GENERATE_ASSEMBLY=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/generate-assembly
VITE_LAMBDA_TRANSLATE_CONTENT=https://YOUR_API_ID.execute-api.us-east-1.amazonaws.com/prod/translate-content
```

## Testing Locally

Test each Lambda function:

```bash
# Test generateHook
aws lambda invoke --function-name generateHook \
  --payload '{"body":"{\"content\":\"AI tips\",\"niche\":\"tech\",\"platform\":\"Instagram\"}"}' \
  response.json

# Test generateAssembly
aws lambda invoke --function-name generateAssembly \
  --payload '{"body":"{\"content\":\"Check out this amazing AI tool!\"}"}' \
  response.json

# Test translateContent
aws lambda invoke --function-name translateContent \
  --payload '{"body":"{\"content\":\"Hello World\",\"targetLanguage\":\"Hindi\"}"}' \
  response.json
```

## Notes
- All functions use Amazon Bedrock Nova Pro (us.amazon.nova-pro-v1:0)
- CORS is enabled for all endpoints
- Error handling included
- Region: us-east-1
- Replace YOUR_ACCOUNT_ID with your AWS account ID
