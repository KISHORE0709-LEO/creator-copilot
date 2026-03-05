# Quick Setup - Content Analyzer with Gemini API

## 🚀 3-Step Setup

### 1. Get API Key
Visit: https://aistudio.google.com
- Sign in with Google
- Click "Get API Key"
- Copy your key

### 2. Add to .env.local
Create `.env.local` in project root:
```
VITE_GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 3. Run
```bash
npm run dev
```

**Important**: Restart dev server after adding the API key!

## ✅ What's Working

- ✅ Content analysis with Gemini AI
- ✅ Score (0-100) with color-coded ring
- ✅ 3-5 improvement suggestions
- ✅ 10-15 hashtags (click to copy)
- ✅ Engagement prediction (Low/Medium/High)
- ✅ Loading spinner + "Analyzing..." text
- ✅ Error handling & validation
- ✅ Toast notifications
- ✅ Secure API key in .env.local

## 📁 Files

- `src/lib/gemini.ts` - API service
- `src/pages/ContentAnalyzer.tsx` - UI component
- `.env.local` - API key (not in git)

## 🔒 Security

- API key in `.env.local` (gitignored)
- Uses Vite's `import.meta.env.VITE_*`
- Never committed to repository

## 🎯 Usage

1. Open Content Analyzer page
2. Paste content
3. Select platform & region
4. Click "Analyze"
5. View results & copy hashtags

## ⚠️ Troubleshooting

**"API key not found" error?**
- Check `.env.local` exists in project root
- Verify key starts with `VITE_GEMINI_API_KEY=`
- Restart dev server (`npm run dev`)

**No results showing?**
- Check browser console for errors
- Verify API key is valid at aistudio.google.com
- Ensure content is not empty
