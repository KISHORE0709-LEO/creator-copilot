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
    const { contentDescription, brand, length, contentType } = body;

    console.log('⏰ Promotion Timing Request:', { brand, length, contentType });

    const prompt = `Analyze promotional timing for this content:

Content: ${contentDescription}
Brand: ${brand}
Length: ${length} minutes
Type: ${contentType}

Return ONLY valid JSON:
{
  "placements": [
    {
      "timestamp": "1:20 - 1:40",
      "type": "Soft Mention",
      "reason": "Early authenticity builds trust",
      "example": "I've been using ${brand} to organize this research."
    },
    {
      "timestamp": "5:10 - 5:40",
      "type": "Main Promotion",
      "reason": "Peak engagement point",
      "example": "If you want the same workflow, try ${brand} using my link."
    },
    {
      "timestamp": "9:00 - 9:20",
      "type": "Reminder CTA",
      "reason": "Final conversion opportunity",
      "example": "Link to ${brand} is in the description below."
    }
  ],
  "riskScore": {
    "intrusiveness": 22,
    "retentionRisk": "Low",
    "authenticityScore": 86
  },
  "recommendations": [
    "Keep first mention natural and contextual",
    "Show product value before asking for action",
    "End with clear but soft CTA"
  ]
}

Rules:
- 3 placements for ${length} min content
- Timestamps based on content length
- intrusiveness: 0-100 (lower is better)
- retentionRisk: Low/Medium/High
- authenticityScore: 0-100`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 2000, temperature: 0.6, topP: 0.9 }
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

    console.log('✅ Timing analysis complete');

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
