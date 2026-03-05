# Content Analyzer - Google Gemini Setup

## ✅ What's Been Implemented

### 1. Google Gemini API Service (`src/lib/gemini.ts`)
- Direct Gemini API integration using gemini-1.5-flash (free tier)
- Uses environment variable from `.env.local`
- Structured JSON response parsing
- Error handling with user-friendly messages

### 2. Updated Content Analyzer (`src/pages/ContentAnalyzer.tsx`)
- Full state management for analysis flow
- Toast notifications for validation, errors, and copy actions
- Loading state with spinner + "Analyzing..." text on button
- Real-time API integration
- Click-to-copy hashtags with "Copied!" toast

### 3. UI Features Implemented

#### Content Quality Score
- Dynamic score ring (0-100)
- Color-coded: Red (<40), Yellow (40-70), Green (>70)
- Quality label: "Needs Work", "Good", or "Excellent"

#### Suggestions for Improvement
- 3-5 actionable bullet points
- Platform-specific recommendations
- Clean, readable list format

#### Hashtag Recommendations
- 10-15 hashtags with # symbol
- Clickable chips/badges
- Click to copy functionality
- Visual feedback (checkmark icon) when copied
- Toast notification: "Copied! #hashtag copied to clipboard"
- Purple/green theme matching

#### Predicted Engagement
- Color-coded badge: Low/Medium/High
- Red for Low, Yellow for Medium, Green for High
- One sentence explanation below

## 🔧 Setup Steps

### 1. Get Your Free Gemini API Key
1. Visit: https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API Key"
4. Copy your API key

### 2. Add Your API Key
Create a `.env.local` file in the project root and add:
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with your Gemini API key from aistudio.google.com

### 3. Run the Project
```bash
npm run dev
```

**Important**: Restart the dev server after adding/changing `.env.local`

### 4. Test the Feature
1. Navigate to Content Analyzer page
2. Paste some content in the textarea
3. Select Platform (Instagram, LinkedIn, YouTube, X)
4. Select Region (India, US, UK, Global, etc.)
5. Click "Analyze" button
6. Watch the loading spinner + "Analyzing..." text
7. See results appear in the right panel
8. Click any hashtag to copy it (shows "Copied!" toast)

## 🎯 Validation & Error Messages

- Empty content → Toast: "Please enter your content first"
- API errors → Toast: "Analysis failed, please try again"
- Button disabled while loading
- Button disabled when textarea is empty
- Hashtag copied → Toast: "Copied! #hashtag copied to clipboard"

## 🎨 UI/UX Features

- Smooth animations with staggered delays
- Copy-to-clipboard for hashtags
- Visual feedback (checkmark) on copy
- Toast notification on copy
- Color-coded scores and predictions
- Dark theme matching existing styles
- Responsive layout
- "Analyzing..." text during loading

## 📝 API Integration Details

### Endpoint
```
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY
```

### Request Format
```javascript
{
  contents: [{
    parts: [{
      text: "Your prompt here..."
    }]
  }]
}
```

### Response Extraction
```javascript
const text = data.candidates[0].content.parts[0].text;
const result = JSON.parse(text);
```

### Prompt Structure
```
You are a social media expert. Analyze this content for [platform] 
targeting [region] audience.
Content: [user's content]

Respond ONLY with raw JSON (no markdown, no backticks, no extra text):
{
  "score": number between 0-100,
  "suggestions": array of 3-5 actionable strings,
  "hashtags": array of 10-15 strings with # symbol,
  "engagementPrediction": exactly one of: Low, Medium, High,
  "engagementReason": one sentence string
}
```

## 🚀 No Additional Dependencies

Everything uses existing dependencies:
- `fetch()` for API calls
- Existing toast system from shadcn-ui
- Existing ScoreRing component
- Lucide React icons already installed

## 🔍 Files Modified/Created

1. **Created**: `src/lib/gemini.ts` - Gemini API service
2. **Modified**: `src/pages/ContentAnalyzer.tsx` - Full functionality with Gemini
3. **Created**: `.env.local` - Environment variables (API key)
4. **Created**: `GEMINI_SETUP.md` - This file

## 💡 Why Gemini?

- **Free tier**: gemini-1.5-flash is completely free
- **Fast**: Optimized for speed
- **No credit card**: Get started immediately at aistudio.google.com
- **High quality**: Excellent for content analysis tasks
- **Simple API**: Easy to integrate

## 🎯 Differences from OpenAI

1. **Endpoint**: Different URL structure with API key in query params
2. **Request format**: Uses `contents` array with `parts`
3. **Response format**: Extracts from `candidates[0].content.parts[0].text`
4. **No auth header**: API key goes in URL instead
5. **Model**: gemini-1.5-flash instead of gpt-4o-mini

## 🔒 Security Note

The API key is now stored in `.env.local` which is:
- ✅ Excluded from git (in .gitignore)
- ✅ Only loaded in your local environment
- ✅ Uses Vite's `import.meta.env.VITE_*` pattern

**Important**: 
- Never commit `.env.local` to git
- The `.env.local` file is already in `.gitignore`
- All environment variables must start with `VITE_` to be exposed to the client
- Restart dev server after changing environment variables
