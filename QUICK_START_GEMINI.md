# Quick Start Guide - Gemini AI Features

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend Server
```bash
node server.js
```
✅ You should see: `API server running on http://localhost:3001`

### Step 2: Start the Frontend (in a new terminal)
```bash
npm run dev
```
✅ Frontend will run on `http://localhost:5173`

### Step 3: Test the Features!

## 🎯 Feature Testing Guide

### 1️⃣ Content Analyzer (Already Working)
**What it does**: Analyzes your social media content and provides AI-powered insights

**How to test**:
1. Go to Dashboard → Content Analyzer
2. Paste: "Check out my new AI tool that helps creators make better content!"
3. Select Platform: Instagram
4. Select Region: India
5. Click "Analyze"
6. ✅ You'll get: Score, suggestions, hashtags, engagement prediction, and advanced metrics

---

### 2️⃣ Content Studio (Newly Integrated)
**What it does**: Generates complete content packages with hooks, titles, and platform-specific posts

**How to test**:
1. Go to Dashboard → Content Studio
2. Enter idea: "5 AI tools that replaced my team"
3. Set Niche: "Tech"
4. Set Platform: "Instagram"
5. Set Hook Style: "Bold Claim"
6. Click "Generate Content"
7. ✅ You'll get:
   - 5 attention-grabbing hooks
   - 4 title variations
   - Platform-specific content for Instagram, LinkedIn, YouTube, Twitter
   - 3 thumbnail concepts with color palettes
   - 8-12 relevant hashtags
   - Performance predictions

---

### 3️⃣ AI Chatbot (Newly Integrated)
**What it does**: Provides real-time AI assistance for navigation and content advice

**How to test**:
1. Click the 3D robot in bottom-right corner
2. Ask: "What features does this platform have?"
3. Ask: "How can I improve my Instagram engagement?"
4. Ask: "What's the best time to post on LinkedIn?"
5. ✅ You'll get: Context-aware, helpful responses from Gemini AI

---

### 4️⃣ Safety & Copyright Scanner (Newly Integrated)
**What it does**: Scans content for copyright risks and accessibility issues

**How to test**:
1. Go to Dashboard → Safety & Copyright
2. Paste: "This game-changing AI tool is obsolete compared to our revolutionary platform on steroids!"
3. Click "Scan for Risks"
4. ✅ You'll get:
   - Risk level assessment
   - Copyright issue detection
   - Accessibility score (0-10)
   - Language complexity warnings
   - Alternative suggestions
   - Originality score

---

## 🔧 Troubleshooting

### Server won't start?
```bash
# Kill any process on port 3001
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F

# Then restart
node server.js
```

### API calls failing?
1. Check `.env` file has `VITE_GEMINI_API_KEY`
2. Verify server is running on port 3001
3. Check browser console for errors
4. Try refreshing the page

### Features not working?
1. Make sure BOTH server and frontend are running
2. Server: `node server.js` (port 3001)
3. Frontend: `npm run dev` (port 5173)
4. Check that you're logged in to the platform

---

## 📊 What's Different Now?

### Before Integration:
- ✅ Content Analyzer: Working with Gemini
- ❌ Content Studio: Mock data only
- ❌ Chatbot: Static responses
- ❌ Safety Scanner: Fake results

### After Integration:
- ✅ Content Analyzer: Working with Gemini
- ✅ Content Studio: Real AI-generated content
- ✅ Chatbot: Real-time AI conversations
- ✅ Safety Scanner: Real copyright & accessibility analysis

---

## 🎉 Success Indicators

You'll know everything is working when:
1. ✅ Content Analyzer shows detailed metrics and suggestions
2. ✅ Content Studio generates unique hooks and content (not the same mock data)
3. ✅ Chatbot gives different responses to different questions
4. ✅ Safety Scanner shows specific issues in your content

---

## 💡 Pro Tips

1. **Content Studio**: Be specific with your content idea for better results
2. **Chatbot**: Ask follow-up questions to get more detailed help
3. **Safety Scanner**: Test with different types of content to see various risk levels
4. **Content Analyzer**: Try different platforms to see platform-specific suggestions

---

## 🆘 Need Help?

If something isn't working:
1. Check both terminals are running (server + frontend)
2. Look for error messages in browser console (F12)
3. Verify `.env` file has the Gemini API key
4. Try restarting both server and frontend

---

## 🎯 Quick Test Script

Run this to test all features quickly:

1. **Content Analyzer**: "AI is transforming content creation" → Analyze
2. **Content Studio**: "10 productivity hacks for creators" → Generate
3. **Chatbot**: "Tell me about Content Studio" → Send
4. **Safety Scanner**: "This revolutionary game-changing tool" → Scan

If all 4 work, you're all set! 🎉
