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
    const { niche, platforms, contentGoal, postingFrequency, contentMix } = body;

    console.log('📅 Calendar Request:', { niche, platforms, contentGoal, postingFrequency, contentMix });

    const today = new Date();
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const dates = days.map((_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
    });

    const prompt = `Generate a 7-day content calendar for:
Niche: ${niche}
Platforms: ${platforms?.join(', ')}
Content Goal: ${contentGoal} - optimize content to achieve this goal
Posting Frequency: ${postingFrequency}
Content Mix: ${contentMix} - balance content types accordingly

Return ONLY valid JSON array with 7 UNIQUE days:
[
  {"day": "Mon", "date": "${dates[0]}", "platform": "Instagram", "type": "Reel", "topic": "Specific idea for ${niche} aligned with ${contentGoal}", "time": "9:00 AM", "status": "scheduled", "engagement": "High"}
]

Rules:
- 7 days: ${days.join(', ')}
- dates: ${dates.join(', ')}
- platform: ${platforms?.join(', ')}
- type: Post, Reel, Story, Video, Article, Thread, Carousel, Short
- topic: UNIQUE specific idea for ${niche} that supports ${contentGoal}
- time: realistic (9:00 AM, 1:00 PM, 6:00 PM, etc)
- status: "scheduled", "draft", "idea"
- engagement: "High", "Medium", "Low"
- Consider ${contentMix} mix when choosing content types`;

    const payload = {
      messages: [{ role: "user", content: [{ text: prompt }] }],
      inferenceConfig: { maxTokens: 2500, temperature: 0.9, topP: 0.95 }
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

    const jsonMatch = generatedText.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('No JSON array in response');
    }

    const calendar = JSON.parse(jsonMatch[0]);
    
    if (!Array.isArray(calendar) || calendar.length !== 7) {
      throw new Error('Invalid calendar format');
    }

    console.log('✅ Generated calendar with', calendar.length, 'days');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ calendar })
    };
  } catch (error) {
    console.error('❌ Error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message, details: 'Calendar generation failed' })
    };
  }
};
