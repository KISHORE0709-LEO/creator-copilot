import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

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

// Content Studio - Generate Content
app.post('/api/generate-content', async (req, res) => {
  try {
    const { content, niche, platform, hookStyle, language, contentType, targetAudience, tone } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content idea is required' });
    }

    const prompt = `You are an expert content creator and social media strategist specializing in viral content creation.

Generate comprehensive content based on this idea:
Content Idea: "${content}"
Niche: ${niche || 'General'}
Platform: ${platform}
Hook Style: ${hookStyle}
Language: ${language}
Content Type: ${contentType}
Target Audience: ${targetAudience || 'General audience'}
Tone: ${tone}

Provide a detailed content package in the following JSON format (no markdown, no backticks):
{
  "hooks": array of 5 attention-grabbing hooks in the specified style,
  "titles": array of 4 compelling titles optimized for the platform,
  "platformContent": {
    "Instagram": full post text optimized for Instagram,
    "LinkedIn": full post text optimized for LinkedIn,
    "YouTube": video description/script optimized for YouTube,
    "X (Twitter)": thread starter optimized for Twitter/X
  },
  "thumbnails": array of 3 thumbnail concepts with {text: string, palette: array of 3 hex colors, tip: design tip},
  "hashtags": array of 8-12 relevant hashtags with # symbol,
  "captions": array of 3 alternative caption variations,
  "estimatedReach": {min: number, max: number} (realistic reach estimates),
  "engagementPrediction": number 0-100 (predicted engagement score)
}

Make the content:
- Highly engaging and platform-specific
- Optimized for the ${platform} algorithm
- Tailored to ${targetAudience}
- Written in ${tone} tone
- Using ${hookStyle} hook style
- Culturally appropriate for ${language} speakers`;

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
    res.status(500).json({ error: 'Content generation failed, please try again' });
  }
});

// Chatbot - AI Assistant
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const historyContext = conversationHistory && conversationHistory.length > 0
      ? conversationHistory.map(msg => `${msg.isUser ? 'User' : 'Assistant'}: ${msg.text}`).join('\n')
      : '';

    const prompt = `You are a helpful AI assistant for a content creator platform called Creator Copilot. 
You help users navigate the platform and answer questions about content creation, social media strategy, and platform features.

The platform has these main features:
- Content Analyzer: Analyzes social media content and provides improvement suggestions
- Content Studio: Generates hooks, titles, platform-specific content, and thumbnails
- Safety & Copyright: Scans content for copyright risks and accessibility issues
- Trends & Calendar: Shows trending topics and optimal posting times
- Monetization & Engagement: Provides monetization strategies and engagement analytics
- Profile: User profile and settings

${historyContext ? `Previous conversation:\n${historyContext}\n\n` : ''}User: ${message}

Provide a helpful, friendly, and concise response. If the user asks about features, explain them clearly. If they need help with content creation, provide actionable advice.`;

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

    res.json({ response: text });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Chat failed, please try again' });
  }
});

// Safety & Copyright Scanner
app.post('/api/scan-content', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const prompt = `You are an expert content safety and copyright analyst.

Analyze this content for copyright risks and accessibility issues:
Content: "${content}"

Provide a detailed analysis in the following JSON format (no markdown, no backticks):
{
  "riskLevel": exactly one of: "Low Risk", "Medium Risk", "High Risk",
  "copyrightIssues": array of objects with {phrase: string, issue: string, alternative: string},
  "accessibilityScore": number 0-10,
  "accessibilityIssues": array of objects with {word: string, issue: string, alternative: string},
  "originalityScore": number 0-100,
  "originalityNote": string explaining originality assessment,
  "recommendations": array of 3-5 specific recommendations for improvement
}

Check for:
- Copyrighted phrases, slogans, or brand names
- Plagiarism indicators
- Complex or non-inclusive language
- Accessibility barriers
- Trademark issues`;

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
    res.status(500).json({ error: 'Content scan failed, please try again' });
  }
});

// Content Studio - Generate Hook
app.post('/api/generate-hook', async (req, res) => {
  try {
    const { content, niche, platform, hookStyle, targetAudience, tone } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content idea is required' });
    }

    const prompt = `You are an expert content creator specializing in viral hooks.

Generate a hook package for this content:
Content Idea: "${content}"
Niche: ${niche || 'General'}
Platform: ${platform}
Hook Style: ${hookStyle}
Target Audience: ${targetAudience || 'General audience'}
Tone: ${tone}

Provide a JSON response (no markdown, no backticks):
{
  "mainHook": "the primary attention-grabbing hook",
  "alternativeHooks": ["3 alternative hook variations"],
  "engagementScore": number 0-100 (predicted engagement),
  "clarityScore": number 0-100 (how clear the message is),
  "hookStrength": number 0-100 (overall hook effectiveness),
  "reachPotential": exactly one of: "Low", "Medium", "High"
}

Make the hooks:
- Attention-grabbing and scroll-stopping
- Platform-optimized for ${platform}
- In ${tone} tone
- Using ${hookStyle} style`;

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
    res.status(500).json({ error: 'Hook generation failed, please try again' });
  }
});

// Content Assembly - Generate Platform Content
app.post('/api/generate-assembly', async (req, res) => {
  try {
    const { content, platform, contentFormat, processingMode } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    const prompt = `You are an expert content strategist.

Transform this raw content into platform-specific versions:
Raw Content: "${content}"
Target Platform: ${platform}
Content Format: ${contentFormat}
Processing Mode: ${processingMode}

Provide a JSON response (no markdown, no backticks):
{
  "Instagram": {
    "caption": "short punchy caption with emojis",
    "hashtags": "relevant hashtags with # symbol",
    "charCount": number
  },
  "LinkedIn": {
    "post": "professional long-form version with line breaks",
    "charCount": number
  },
  "YouTube": {
    "script": "video script intro and main points",
    "title": "compelling video title",
    "charCount": number
  },
  "X (Twitter)": {
    "tweets": ["array of 3-4 tweets for a thread"],
    "charCount": 280
  }
}

Make each version:
- Platform-optimized
- Engaging and actionable
- Properly formatted
- Within character limits`;

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
    res.status(500).json({ error: 'Content assembly failed, please try again' });
  }
});

// Translation - Translate and Adapt Content
app.post('/api/translate-content', async (req, res) => {
  try {
    const { content, targetLanguage, culturalContext, accessibilityLevel } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    // Language code mapping
    const languageMap = {
      'English': 'en',
      'Hindi': 'hi',
      'Tamil': 'ta',
      'Telugu': 'te',
      'Kannada': 'kn',
      'Malayalam': 'ml',
      'Bengali': 'bn',
      'Marathi': 'mr',
      'Gujarati': 'gu',
      'Punjabi': 'pa'
    };

    const targetLangCode = languageMap[targetLanguage] || 'hi';

    // Use Google Translate API for actual translation
    let translatedText = content;
    let romanizedText = null;

    try {
      // Google Translate API call
      const translateResponse = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${process.env.VITE_GOOGLE_TRANSLATE_API_KEY || GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: content,
            target: targetLangCode,
            format: 'text'
          })
        }
      );

      if (translateResponse.ok) {
        const translateData = await translateResponse.json();
        translatedText = translateData.data?.translations?.[0]?.translatedText || content;
      }
    } catch (translateError) {
      console.log('Google Translate not available, using Gemini for translation');
    }

    // Use Gemini for cultural adaptation and romanization
    const prompt = `You are an expert translator and cultural adaptation specialist.

Original Content: "${content}"
Translated Content: "${translatedText}"
Target Language: ${targetLanguage}
Cultural Context: ${culturalContext}
Accessibility Level: ${accessibilityLevel}

Provide a JSON response (no markdown, no backticks):
{
  "translated": "improved translation with cultural adaptation",
  "romanized": "romanized version if applicable (for Hindi/Hinglish, Tamil, Telugu, etc.)",
  "culturalNotes": ["array of 3-4 cultural adaptation notes explaining changes made"]
}

Make the translation:
- Culturally appropriate for ${culturalContext}
- Natural and idiomatic
- Accessible at ${accessibilityLevel} level
- Include Hinglish mix if translating to Hindi
- Provide romanized version for Indian languages`;

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

    let cleanText = text;
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    const result = JSON.parse(cleanText);
    
    // If Google Translate was used, prefer that translation
    if (translatedText !== content) {
      result.translated = translatedText;
    }
    
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Translation failed, please try again' });
  }
});

// YouTube Content Extraction
app.post('/api/extract-youtube', async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'YouTube URL is required' });
    }

    // Extract video ID from URL
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Use Gemini to analyze the video URL and extract content idea
    const prompt = `You are a content analysis expert.

Analyze this YouTube video URL and extract the main content idea:
Video URL: ${url}
Video ID: ${videoId}

Based on the URL structure and video ID, provide a JSON response (no markdown, no backticks):
{
  "extractedContent": "a detailed content idea extracted from analyzing the video URL pattern and typical content for such videos (2-3 sentences)"
}

Make it:
- Specific and actionable
- Suitable for content creation
- Based on common patterns for such video IDs`;

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
    res.status(500).json({ error: 'YouTube extraction failed, please try again' });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
