import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;

app.post('/api/analyze-content', async (req, res) => {
  try {
    const { content, platform, region } = req.body;

    if (!content || !platform || !region) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prompt = `You are an expert social media strategist and content analyst with deep knowledge of ${platform} algorithms and ${region} audience behavior.

Analyze this content comprehensively:
Content: "${content}"
Platform: ${platform}
Target Region: ${region}

Provide a detailed analysis in the following JSON format (no markdown, no backticks):
{
  "score": number between 0-100 (overall content quality),
  "suggestions": array of 4-6 specific, actionable improvement recommendations,
  "hashtags": array of 12-20 highly relevant hashtags with # symbol, prioritized by engagement potential,
  "engagementPrediction": exactly one of: "Low", "Medium", "High",
  "engagementReason": detailed explanation of engagement prediction,
  "readabilityScore": number 0-100 (how easy to read/understand),
  "sentimentScore": number -100 to 100 (negative to positive sentiment),
  "keywordDensity": object with top 5 keywords and their frequency percentages,
  "optimalPostingTimes": array of 3-4 best posting time recommendations for this region,
  "competitorAnalysis": brief analysis of how this compares to trending content in this niche,
  "viralPotential": number 0-100 (likelihood of going viral),
  "brandAlignment": number 0-100 (how well it aligns with professional brand building),
  "callToActionStrength": number 0-100 (effectiveness of call-to-action elements)
}

Consider platform-specific factors:
- ${platform === 'Instagram' ? 'Visual appeal, story potential, reel-worthy content, hashtag strategy' : ''}
- ${platform === 'LinkedIn' ? 'Professional tone, thought leadership, industry relevance, networking potential' : ''}
- ${platform === 'YouTube' ? 'Title optimization, thumbnail potential, watch time factors, SEO keywords' : ''}
- ${platform === 'X (Twitter)' ? 'Character efficiency, trending topics, retweet potential, thread-worthy content' : ''}
- ${platform === 'TikTok' ? 'Trend alignment, music potential, viral hooks, generation Z appeal' : ''}
- ${platform === 'Facebook' ? 'Community engagement, shareability, discussion potential, algorithm optimization' : ''}

Regional considerations for ${region}:
- Cultural relevance and sensitivity
- Local trends and interests  
- Time zone and posting schedule optimization
- Language nuances and preferences`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Clean up the response - remove markdown code blocks if present
    let cleanText = text;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const result = JSON.parse(cleanText);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Analysis failed, please try again' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
