import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { content, targetLanguage, culturalContext, accessibilityLevel } = JSON.parse(event.body);

    if (!content || !targetLanguage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Content and targetLanguage are required' })
      };
    }

    const isHindi = targetLanguage.toLowerCase().includes('hindi');
    const romanizedField = isHindi ? ', "romanized": "romanized Hindi text here"' : '';

    const prompt = `You are a professional translator specializing in ${targetLanguage} with cultural awareness.

Content to translate: ${content}
Target Language: ${targetLanguage}
Cultural Context: ${culturalContext || 'general'}
Accessibility Level: ${accessibilityLevel || 'standard'}

Translate the content accurately while maintaining tone and cultural appropriateness. ${isHindi ? 'Also provide romanized version.' : ''}

Respond ONLY with valid JSON (no markdown):
{
  "translated": "translated text here"${romanizedField},
  "culturalNotes": ["note1", "note2", "note3"]
}

Cultural notes should highlight any adaptations made for cultural sensitivity or context.`;

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-pro-v1:0",
      contentType: "application/json",
      accept: "application/json",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: { maxTokens: 1500, temperature: 0.5 }
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
      body: JSON.stringify({ error: 'Translation failed', details: error.message })
    };
  }
};
