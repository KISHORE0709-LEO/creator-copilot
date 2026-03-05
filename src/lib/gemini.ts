// Google Gemini API service for content analysis

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface AnalysisResult {
  score: number;
  suggestions: string[];
  hashtags: string[];
  engagementPrediction: "Low" | "Medium" | "High";
  engagementReason: string;
  // Enhanced metrics
  readabilityScore: number;
  sentimentScore: number;
  keywordDensity: { [key: string]: number };
  optimalPostingTimes: string[];
  competitorAnalysis: string;
  viralPotential: number;
  brandAlignment: number;
  callToActionStrength: number;
}

export async function analyzeContent(
  content: string,
  platform: string,
  region: string
): Promise<AnalysisResult> {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key not found. Please add VITE_GEMINI_API_KEY to .env.local");
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

Regional considerations for ${region}:
- Cultural relevance and sensitivity
- Local trends and interests  
- Time zone and posting schedule optimization
- Language nuances and preferences`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content_text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!content_text) {
      throw new Error("No response from Gemini");
    }

    // Clean up the response - remove markdown code blocks if present
    let cleanText = content_text;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Parse the JSON response
    const result: AnalysisResult = JSON.parse(cleanText);

    // Validate the response structure
    if (
      typeof result.score !== "number" ||
      !Array.isArray(result.suggestions) ||
      !Array.isArray(result.hashtags) ||
      !["Low", "Medium", "High"].includes(result.engagementPrediction) ||
      typeof result.engagementReason !== "string" ||
      typeof result.readabilityScore !== "number" ||
      typeof result.sentimentScore !== "number" ||
      typeof result.keywordDensity !== "object" ||
      !Array.isArray(result.optimalPostingTimes) ||
      typeof result.competitorAnalysis !== "string" ||
      typeof result.viralPotential !== "number" ||
      typeof result.brandAlignment !== "number" ||
      typeof result.callToActionStrength !== "number"
    ) {
      console.warn("Incomplete response from Gemini, using fallback values");
      // Provide fallback values for missing fields
      result.readabilityScore = result.readabilityScore || 50;
      result.sentimentScore = result.sentimentScore || 0;
      result.keywordDensity = result.keywordDensity || {};
      result.optimalPostingTimes = result.optimalPostingTimes || ["9:00 AM", "1:00 PM", "7:00 PM"];
      result.competitorAnalysis = result.competitorAnalysis || "Analysis not available";
      result.viralPotential = result.viralPotential || 30;
      result.brandAlignment = result.brandAlignment || 50;
      result.callToActionStrength = result.callToActionStrength || 40;
    }

    return result;
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw new Error("Analysis failed, please try again");
  }
}
