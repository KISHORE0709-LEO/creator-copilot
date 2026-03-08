import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

export const handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  const httpMethod = event.httpMethod || event.requestContext?.http?.method;
  
  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { comments } = body;

    console.log('💬 Comment Analysis Request:', { commentCount: comments?.length });

    const prompt = `Analyze these comments:

Comments: ${JSON.stringify(comments)}

Return ONLY valid JSON:
{
  "sentimentBreakdown": {
    "positive": 62,
    "neutral": 21,
    "negative": 17
  },
  "keyReactions": [
    "Very helpful tutorial",
    "Please make part 2",
    "Link is not working"
  ],
  "flaggedComments": [
    {
      "comment": "Spam comment example",
      "reason": "Spam",
      "action": "Delete"
    }
  ],
  "suggestedReplies": [
    {
      "comment": "This didn't work for me",
      "reply": "Sorry about that! Could you tell me which step didn't work so I can help?"
    }
  ],
  "engagementInsights": {
    "bestPerformingType": "Questions",
    "bestTrigger": "Tutorial explanations",
    "audienceInterest": ["AI tools", "automation", "productivity"]
  }
}

Rules:
- Sentiment percentages must add to 100
- Flag spam, toxic, promotional comments
- Suggest helpful, friendly replies
- Identify audience interests`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 2500, temperature: 0.6, topP: 0.9 }
    };

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify(payload)
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const generatedText = responseBody.output.message.content[0].text;

    console.log('🤖 AI Response:', generatedText);

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON in response');
    }

    const analysis = JSON.parse(jsonMatch[0]);

    console.log('✅ Comment analysis complete');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ analysis })
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
