#!/bin/bash

# Trends & Calendar AWS Lambda Deployment Script
set -e

echo "🚀 Deploying Trends & Calendar Lambda Functions..."

# Configuration
REGION="us-east-1"
ROLE_NAME="CreatorCopilotTrendsLambdaRole"
FUNCTIONS=("trendAnalyzer" "contentIdeaGenerator" "schedulingIntelligence")

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if role exists, create if not
echo -e "${BLUE}Checking IAM Role...${NC}"
ROLE_ARN=$(aws iam get-role --role-name $ROLE_NAME --query 'Role.Arn' --output text 2>/dev/null || echo "")

if [ -z "$ROLE_ARN" ]; then
  echo "Creating IAM Role..."
  ROLE_ARN=$(aws iam create-role \
    --role-name $ROLE_NAME \
    --assume-role-policy-document file://iam-policy.json \
    --query 'Role.Arn' \
    --output text)
  
  aws iam attach-role-policy \
    --role-name $ROLE_NAME \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  
  aws iam put-role-policy \
    --role-name $ROLE_NAME \
    --policy-name BedrockAccess \
    --policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Action": ["bedrock:InvokeModel"],
        "Resource": "*"
      }]
    }'
  
  echo "Waiting for IAM role propagation..."
  sleep 10
fi

echo -e "${GREEN}✓ IAM Role ready: $ROLE_ARN${NC}"

# Install dependencies
echo -e "${BLUE}Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# Deploy each function
for FUNCTION in "${FUNCTIONS[@]}"; do
  echo -e "${BLUE}Deploying $FUNCTION...${NC}"
  
  # Create deployment package
  zip -q ${FUNCTION}.zip ${FUNCTION}.mjs node_modules -r
  
  # Check if function exists
  FUNCTION_EXISTS=$(aws lambda get-function --function-name $FUNCTION --region $REGION 2>/dev/null || echo "")
  
  if [ -z "$FUNCTION_EXISTS" ]; then
    # Create new function
    aws lambda create-function \
      --function-name $FUNCTION \
      --runtime nodejs20.x \
      --role $ROLE_ARN \
      --handler ${FUNCTION}.handler \
      --zip-file fileb://${FUNCTION}.zip \
      --timeout 30 \
      --memory-size 512 \
      --region $REGION \
      --environment Variables={AWS_REGION=$REGION}
  else
    # Update existing function
    aws lambda update-function-code \
      --function-name $FUNCTION \
      --zip-file fileb://${FUNCTION}.zip \
      --region $REGION
  fi
  
  # Clean up
  rm ${FUNCTION}.zip
  
  echo -e "${GREEN}✓ $FUNCTION deployed${NC}"
done

# Create API Gateway (if not exists)
echo -e "${BLUE}Setting up API Gateway...${NC}"

API_NAME="CreatorCopilotTrendsAPI"
API_ID=$(aws apigateway get-rest-apis --query "items[?name=='$API_NAME'].id" --output text --region $REGION)

if [ -z "$API_ID" ]; then
  echo "Creating API Gateway..."
  API_ID=$(aws apigateway create-rest-api \
    --name $API_NAME \
    --description "Trends & Calendar API" \
    --region $REGION \
    --query 'id' \
    --output text)
fi

echo -e "${GREEN}✓ API Gateway ID: $API_ID${NC}"

# Get root resource
ROOT_ID=$(aws apigateway get-resources \
  --rest-api-id $API_ID \
  --region $REGION \
  --query 'items[?path==`/`].id' \
  --output text)

# Create resources and methods for each function
for FUNCTION in "${FUNCTIONS[@]}"; do
  echo -e "${BLUE}Configuring API endpoint for $FUNCTION...${NC}"
  
  # Create resource
  RESOURCE_ID=$(aws apigateway get-resources \
    --rest-api-id $API_ID \
    --region $REGION \
    --query "items[?pathPart=='$FUNCTION'].id" \
    --output text)
  
  if [ -z "$RESOURCE_ID" ]; then
    RESOURCE_ID=$(aws apigateway create-resource \
      --rest-api-id $API_ID \
      --parent-id $ROOT_ID \
      --path-part $FUNCTION \
      --region $REGION \
      --query 'id' \
      --output text)
  fi
  
  # Create POST method
  aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method POST \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || true
  
  # Get Lambda ARN
  LAMBDA_ARN=$(aws lambda get-function \
    --function-name $FUNCTION \
    --region $REGION \
    --query 'Configuration.FunctionArn' \
    --output text)
  
  # Set integration
  aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method POST \
    --type AWS_PROXY \
    --integration-http-method POST \
    --uri "arn:aws:apigateway:$REGION:lambda:path/2015-03-31/functions/$LAMBDA_ARN/invocations" \
    --region $REGION 2>/dev/null || true
  
  # Add Lambda permission
  aws lambda add-permission \
    --function-name $FUNCTION \
    --statement-id apigateway-access-$FUNCTION \
    --action lambda:InvokeFunction \
    --principal apigateway.amazonaws.com \
    --source-arn "arn:aws:execute-api:$REGION:*:$API_ID/*/*" \
    --region $REGION 2>/dev/null || true
  
  # Enable CORS
  aws apigateway put-method \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --authorization-type NONE \
    --region $REGION 2>/dev/null || true
  
  aws apigateway put-integration \
    --rest-api-id $API_ID \
    --resource-id $RESOURCE_ID \
    --http-method OPTIONS \
    --type MOCK \
    --request-templates '{"application/json": "{\"statusCode\": 200}"}' \
    --region $REGION 2>/dev/null || true
  
  echo -e "${GREEN}✓ API endpoint configured for $FUNCTION${NC}"
done

# Deploy API
echo -e "${BLUE}Deploying API...${NC}"
aws apigateway create-deployment \
  --rest-api-id $API_ID \
  --stage-name prod \
  --region $REGION

API_URL="https://$API_ID.execute-api.$REGION.amazonaws.com/prod"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "API Endpoints:"
echo "  Trend Analyzer: $API_URL/trendAnalyzer"
echo "  Content Ideas: $API_URL/contentIdeaGenerator"
echo "  Scheduling Intelligence: $API_URL/schedulingIntelligence"
echo ""
echo "Add to your .env.local:"
echo "VITE_TRENDS_API_URL=$API_URL"
echo ""
