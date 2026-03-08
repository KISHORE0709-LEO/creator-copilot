import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS' || event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const { content, platform, contentFormat, processingMode } = body;

    if (!content) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Content is required' })
      };
    }

    const prompt = `You are a multi-platform content adapter. Transform this content for all major platforms.

Original Content: ${content}
Content Format: ${contentFormat || 'text'}
Processing Mode: ${processingMode || 'standard'}

Generate platform-specific versions. Respond ONLY with valid JSON (no markdown):
{
  "Instagram": { "caption": "...", "hashtags": "#tag1 #tag2 #tag3", "charCount": 150 },
  "LinkedIn": { "post": "...", "charCount": 300 },
  "YouTube": { "script": "...", "title": "...", "charCount": 500 },
  "X (Twitter)": { "tweets": ["tweet1", "tweet2"], "charCount": 280 },
  "TikTok": { "caption": "...", "hashtags": "#tag1 #tag2", "charCount": 150 },
  "Facebook": { "post": "...", "charCount": 400 }
}

Keep it concise and optimized for each platform.`;

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-pro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 3000, temperature: 0.7 }
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const text = responseBody.output.message.content[0].text.trim();
    
    let result = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const parsed = JSON.parse(result);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(parsed)
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Assembly generation failed', details: error.message })
    };
  }
};
