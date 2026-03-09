import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new BedrockRuntimeClient({ region: "us-east-1" });
const dynamoClient = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

const TABLE_NAME = "creator-copilot-content-analysis";

export const handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (!event.body) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'No request body' }) };
    }
    
    const { content, platform, region } = JSON.parse(event.body);

    // Calculate content metrics
    const wordCount = content.trim().split(/\s+/).length;
    const charCount = content.length;
    const hasEmojis = /[\u{1F300}-\u{1F9FF}]/u.test(content);
    const hasHashtags = /#\w+/.test(content);
    const hasQuestion = /\?/.test(content);
    const hasNumbers = /\d+/.test(content);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    
    const prompt = `You are a world-class social media strategist who has analyzed 100,000+ viral posts and generated $50M+ in engagement for Fortune 500 brands.

=== CONTENT TO ANALYZE ===
Platform: ${platform}
Target Region: ${region}
Content: "${content}"

=== CONTENT METRICS ===
- Word count: ${wordCount}
- Character count: ${charCount}
- Sentences: ${sentences}
- Has emojis: ${hasEmojis}
- Has hashtags: ${hasHashtags}
- Has questions: ${hasQuestion}
- Has numbers: ${hasNumbers}

=== YOUR TASK ===
Provide a COMPREHENSIVE, BRUTALLY HONEST analysis with SPECIFIC, ACTIONABLE suggestions.

=== SCORING GUIDELINES ===

1. QUALITY SCORE (0-100) - Be STRICT:
   - 0-20: Spam/useless (no value, terrible grammar)
   - 21-35: Very poor (< 10 words, no hook, no value)
   - 36-50: Poor (10-30 words, weak message, unclear)
   - 51-65: Average (30-80 words, decent but forgettable)
   - 66-80: Good (80-150 words, engaging, clear value)
   - 81-90: Excellent (150+ words, strong hook, compelling)
   - 91-100: Masterpiece (perfect execution, viral-worthy)
   
   STRICT RULES:
   - If ${wordCount} < 10 words: score MUST be 20-35
   - If ${wordCount} < 30 words: score MUST be 35-50
   - If ${wordCount} < 80 words: score MUST be 50-70
   - If no emojis on Instagram/TikTok: deduct 10 points
   - If no hashtags: deduct 5 points
   - If no CTA: deduct 10 points

2. HOOK RATING (0-10) - First 5-10 words:
   - 0-2: No hook, boring/generic start
   - 3-4: Weak hook, needs major improvement
   - 5-6: Decent hook, could be stronger
   - 7-8: Strong hook, attention-grabbing
   - 9-10: Exceptional hook, irresistible
   
   STRICT: If starts with "I", "The", "This", "My": max rating is 5

3. PLATFORM-SPECIFIC ANALYSIS for ${platform}:

${platform === 'Instagram' ? `INSTAGRAM OPTIMIZATION:
- Visual storytelling potential
- Reel/Story/Carousel suitability
- Caption length (optimal: 125-150 chars before "more")
- Emoji usage (MUST have 5-8 emojis)
- Hashtag strategy (NEEDS 25-30 hashtags)
- Line breaks every 2 sentences
- First line hook strength
- Carousel swipe-worthiness` : ''}

${platform === 'LinkedIn' ? `LINKEDIN OPTIMIZATION:
- Professional tone assessment
- Thought leadership value
- Industry relevance and insights
- Networking/discussion potential
- Personal story element
- Optimal length: 150-300 words
- Paragraph structure (2-3 lines max)
- B2B appeal and value` : ''}

${platform === 'YouTube' ? `YOUTUBE OPTIMIZATION:
- Title SEO (60 chars max, keyword-rich)
- Thumbnail concept potential
- Watch time prediction factors
- Retention hook strength
- Description optimization (5000 chars)
- Keyword placement strategy
- Chapter/timestamp potential
- Audience retention tactics` : ''}

${platform === 'X (Twitter)' ? `TWITTER/X OPTIMIZATION:
- Character efficiency (280 limit)
- Thread potential (3-5 tweets)
- Retweet worthiness
- Trending topic alignment
- Optimal: 71-100 characters
- Line break usage
- Quote tweet potential
- Viral mechanics` : ''}

${platform === 'TikTok' ? `TIKTOK OPTIMIZATION:
- Trend alignment score
- Sound/music potential
- Gen Z appeal (slang, humor)
- Viral hook strength
- First 3 seconds impact
- Duet/Stitch potential
- Text overlay strategy
- Algorithm optimization` : ''}

${platform === 'Facebook' ? `FACEBOOK OPTIMIZATION:
- Community engagement potential
- Shareability score
- Discussion trigger strength
- Algorithm optimization
- Optimal: 40-80 characters
- Question-based engagement
- Group posting suitability
- Story/Reel potential` : ''}

4. REGIONAL INTELLIGENCE for ${region}:
- Cultural appropriateness and sensitivity
- Local trends and viral topics
- Language nuances and slang
- Best posting times for timezone
- Regional holidays and events
- Local influencer strategies

5. ENGAGEMENT PREDICTION MODEL:
- Hook strength × Platform fit × Timing × Value
- Compare to top 1% performing content
- Low: <2% engagement (weak content)
- Medium: 2-5% engagement (average)
- High: >5% engagement (exceptional)

=== OUTPUT FORMAT ===
Return ONLY valid JSON (no markdown, no backticks, no extra text):

{
  "score": <number 0-100, follow strict rules above>,
  "hookRating": <number 0-10, be harsh on weak hooks>,
  "suggestions": [
    "Expand to 100-150 words - current ${wordCount} words is too short. Add: personal story, statistics, and emotional appeal",
    "Create powerful hook: Instead of generic start, use: 'Did you know that 90% of people...' or 'Imagine waking up to...' or 'What if I told you...'",
    "${hasEmojis ? 'Add 3-4 MORE emojis for emphasis: Use 🔥 for excitement, 💡 for ideas, ✨ for magic, 🚀 for growth, 🎯 for goals' : 'Add 5-8 strategic emojis: 🔥💡✨🚀💪🎯👏❤️ to boost engagement by 30%'}",
    "Include specific numbers: Replace vague claims with '3x more engagement', '87% of users', '$10K in revenue', '30 days to results'",
    "Add social proof: Mention '10,000+ creators use this', 'Featured in Forbes', 'Trusted by 500+ brands', or client testimonials",
    "${content.toLowerCase().includes('comment') || content.toLowerCase().includes('share') ? 'Strengthen CTA with urgency: Change to Comment NOW, Share if you agree RIGHT NOW, Tag 3 friends TODAY, Save this before it is gone' : 'Add powerful CTA: End with Comment your thoughts below, Double-tap if you agree, Share this with someone who needs it, Save for later'}",
    "Break into 4-5 short paragraphs with line breaks for mobile readability - current format is too dense",
    "Use power words: Add Amazing, Proven, Secret, Ultimate, Game-changing, Revolutionary, Exclusive, Limited, Guaranteed"
  ],
  "hashtags": ["#${platform.replace(/\s+/g, '')}", "#${platform.replace(/\s+/g, '')}Marketing", "#SocialMedia", "#ContentCreator", "#DigitalMarketing", "#Viral", "#Trending", "#ContentStrategy", "#Engagement", "#GrowthHacking", "#Marketing2024", "#SocialMediaMarketing", "#Influencer", "#CreatorEconomy", "#OnlineMarketing", "#BrandBuilding", "#${region.replace(/\s+/g, '')}", "#ContentMarketing", "#MarketingTips", "#DigitalStrategy", "#SocialMediaTips", "#MarketingStrategy", "#GrowYourBrand", "#ContentIsKing", "#SocialMediaGrowth"],
  "engagementPrediction": "${wordCount < 15 ? 'Low' : wordCount < 60 ? 'Medium' : 'High'}",
  "engagementReason": "<Write 2-3 detailed sentences explaining why this content will get Low/Medium/High engagement based on length, hook, value, emojis, CTA, and platform best practices>",
  "readabilityScore": <0-100 based on clarity, structure, sentence length>,
  "sentimentScore": <-100 to 100, analyze emotional tone>,
  "keywordDensity": {"keyword1": <percentage>, "keyword2": <percentage>, "keyword3": <percentage>, "keyword4": <percentage>, "keyword5": <percentage>},
  "optimalPostingTimes": ["9:00-10:00 AM ${region} time", "1:00-2:00 PM ${region} time", "5:00-6:00 PM ${region} time", "8:00-9:00 PM ${region} time"],
  "competitorAnalysis": "<Write 2-3 sentences: Top ${platform} creators in ${region} post X-word content with Y emojis, Z hashtags, strong hooks, and clear CTAs. They use storytelling, data, and urgency. Compare this content to top performers and explain gaps>",
  "viralPotential": <0-100, be realistic: generic=10-30, good=40-60, exceptional=70-100>,
  "brandAlignment": <0-100, professional brand building score>,
  "callToActionStrength": <0-100, no CTA=0-20, weak=20-50, strong=50-100>,
  "issues": [
    "Length: Only ${wordCount} words - needs 80-150 words for optimal ${platform} performance (current is ${wordCount < 50 ? 'way too short' : 'too short'})",
    "${hasEmojis ? 'Emoji usage: Has emojis but needs 3-4 more for emphasis and visual breaks' : 'Missing emojis: Add 5-8 emojis (🔥💡✨🚀💪) to increase engagement by 30%'}",
    "${hasHashtags ? 'Hashtags: Present but needs 15-20 more for maximum discoverability' : 'No hashtags: Add 20-30 relevant hashtags for reach and discoverability'}",
    "Value proposition: Unclear what specific benefit or transformation readers will get - add concrete outcomes",
    "Hook weakness: First sentence is ${wordCount < 5 ? 'too short and' : ''} generic - needs curiosity gap, question, or bold claim",
    "${content.toLowerCase().includes('comment') || content.toLowerCase().includes('share') ? 'CTA present but weak: Add urgency words like NOW, TODAY, LIMITED, BEFORE IT IS GONE' : 'Missing CTA: Add clear action - Comment, Share, Save, Tag, Follow, Click link'}"
  ],
  "platformTip": "<Write specific ${platform} tip with exact tactics>"
}

=== CRITICAL RULES ===
- Be BRUTALLY HONEST with scores
- Short content (<30 words) MUST get low scores (20-50)
- Provide SPECIFIC examples in every suggestion
- Issues MUST include measurements and numbers
- All suggestions must be ACTIONABLE with exact tactics
- Don't be generous - be realistic and critical`;

    const command = new InvokeModelCommand({
      modelId: "us.amazon.nova-lite-v1:0",
      body: JSON.stringify({
        messages: [{ role: "user", content: [{ text: prompt }] }],
        inferenceConfig: {
          max_new_tokens: 4000,
          temperature: 0.75,
          top_p: 0.95
        }
      })
    });

    const response = await client.send(command);
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    let text = responseBody.output.message.content[0].text.trim();
    
    console.log('Raw response:', text);
    
    // Clean markdown
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    // Try to parse, if fails, sanitize and retry
    let result;
    try {
      result = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parse failed, sanitizing...', parseError);
      // Fix common JSON issues
      text = text
        .replace(/\n/g, ' ')  // Remove newlines
        .replace(/\r/g, '')   // Remove carriage returns
        .replace(/\t/g, ' ')  // Remove tabs
        .replace(/"/g, '"')  // Fix smart quotes
        .replace(/"/g, '"')
        .replace(/'/g, "'")  // Fix smart apostrophes
        .replace(/'/g, "'");
      
      try {
        result = JSON.parse(text);
      } catch (secondError) {
        console.error('Still failed, returning fallback');
        // Return fallback
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({
            score: 50,
            hookRating: 5,
            suggestions: ["Unable to analyze - please try again"],
            hashtags: ["#content"],
            engagementPrediction: "Medium",
            engagementReason: "Analysis unavailable",
            readabilityScore: 50,
            sentimentScore: 0,
            keywordDensity: {},
            optimalPostingTimes: ["9:00 AM", "1:00 PM", "7:00 PM"],
            competitorAnalysis: "Analysis unavailable",
            viralPotential: 50,
            brandAlignment: 50,
            callToActionStrength: 50,
            issues: ["Analysis failed"],
            platformTip: "Try again"
          })
        };
      }
    }

    // Save to DynamoDB
    const timestamp = new Date().toISOString();
    const analysisId = `analysis-${Date.now()}`;

    await docClient.send(new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        analysisId,
        userId: event.requestContext?.authorizer?.claims?.sub || 'anonymous',
        content,
        platform,
        region,
        wordCount,
        charCount,
        qualityScore: result.score,
        hookRating: result.hookRating,
        readabilityScore: result.readabilityScore,
        sentimentScore: result.sentimentScore,
        viralPotential: result.viralPotential,
        brandAlignment: result.brandAlignment,
        ctaStrength: result.callToActionStrength,
        suggestions: result.suggestions,
        hashtags: result.hashtags,
        engagementPrediction: result.engagementPrediction,
        issues: result.issues,
        keywordDensity: result.keywordDensity,
        optimalPostingTimes: result.optimalPostingTimes,
        contentType: 'text',
        createdAt: timestamp,
        ttl: Math.floor(Date.now() / 1000) + (90 * 24 * 60 * 60)
      }
    }));

    return { statusCode: 200, headers, body: JSON.stringify({ ...result, analysisId }) };
  } catch (error) {
    console.error('Error:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Failed', details: error.message }) };
  }
};
