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
    const { content, niche, platform, hookStyle, targetAudience, tone } = body;

    if (!content || !niche || !platform) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const prompt = `You are an expert social media hook writer. Generate attention-grabbing hooks for ${platform}.

Content: ${content}
Niche: ${niche}
Hook Style: ${hookStyle || 'engaging'}
Target Audience: ${targetAudience || 'general'}
Tone: ${tone || 'professional'}

Generate 1 main hook and 5 alternative hooks. Respond ONLY with valid JSON (no markdown):
{
  "mainHook": "best hook here",
  "alternativeHooks": ["hook1", "hook2", "hook3", "hook4", "hook5"],
  "engagementScore": 85,
  "clarityScore": 78,
  "hookStrength": 82,
  "reachPotential": "High"
}`;

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-pro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 1000, temperature: 0.7 }
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
      body: JSON.stringify({ error: 'Hook generation failed', details: error.message })
    };
  }
};
