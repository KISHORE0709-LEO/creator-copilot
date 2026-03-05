# Content Analyzer - Setup Instructions

## ✅ What's Been Implemented

### 1. OpenAI API Service (`src/lib/openai.ts`)
- Direct OpenAI API integration using gpt-4o-mini
- Hardcoded API key (replace with your actual key)
- Structured JSON response parsing
- Error handling with user-friendly messages

### 2. Updated Content Analyzer (`src/pages/ContentAnalyzer.tsx`)
- Full state management for analysis flow
- Toast notifications for validation and errors
- Loading state with spinner on button
- Real-time API integration

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
- Visual feedback (checkmark) when copied
- Purple/green theme matching

#### Predicted Engagement
- Color-coded badge: Low/Medium/High
- Red for Low, Yellow for Medium, Green for High
- One sentence explanation below

## 🔧 Setup Steps

### 1. Add Your OpenAI API Key
Open `src/lib/openai.ts` and replace:
```typescript
const OPENAI_API_KEY = "PASTE_YOUR_KEY_HERE";
```
with your actual OpenAI API key:
```typescript
const OPENAI_API_KEY = "sk-proj-...";
```

### 2. Run the Project
```bash
npm run dev
```

### 3. Test the Feature
1. Navigate to Content Analyzer page
2. Paste some content in the textarea
3. Select Platform (Instagram, LinkedIn, YouTube, X)
4. Select Region (India, US, UK, Global, etc.)
5. Click "Analyze" button
6. Watch the loading spinner
7. See results appear in the right panel

## 🎯 Validation Rules

- Empty content → Toast: "Please enter content first"
- API errors → Toast: "Something went wrong, please try again"
- Button disabled while loading
- Button disabled when textarea is empty

## 🎨 UI/UX Features

- Smooth animations with staggered delays
- Copy-to-clipboard for hashtags
- Visual feedback (checkmark) on copy
- Color-coded scores and predictions
- Dark theme matching existing styles
- Responsive layout

## 📝 API Prompt Structure

The system sends this exact prompt to OpenAI:
```
You are a social media expert. Analyze this content for [platform] 
targeting [region] audience.
Content: [user's content]

Respond ONLY with raw JSON (no markdown, no backticks, no explanation):
{
  "score": number between 0-100,
  "suggestions": array of 3-5 strings,
  "hashtags": array of 10-15 strings with # symbol,
  "engagementPrediction": exactly one of: "Low", "Medium", "High",
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

1. **Created**: `src/lib/openai.ts` - OpenAI API service
2. **Modified**: `src/pages/ContentAnalyzer.tsx` - Full functionality
3. **Created**: `SETUP.md` - This file

## 💡 Tips

- The API key is hardcoded for simplicity (as requested)
- For production, move to environment variables
- The region dropdown now uses select instead of input for better UX
- All colors match your existing dark theme
- Hashtags are styled with primary color (purple/green)
