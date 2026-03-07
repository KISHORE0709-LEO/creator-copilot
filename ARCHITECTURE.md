# System Architecture - Gemini AI Integration

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React + Vite)                  │
│                   http://localhost:5173                      │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Requests
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND API (Express.js)                    │
│                   http://localhost:3001                      │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/analyze-content                                 │  │
│  │  /api/generate-content                                │  │
│  │  /api/chat                                            │  │
│  │  /api/scan-content                                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ API Calls
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              Google Gemini API (gemini-2.5-flash)            │
│   https://generativelanguage.googleapis.com/v1beta/...      │
└─────────────────────────────────────────────────────────────┘
```

## 📦 Component Structure

### Frontend Components

```
src/
├── pages/
│   ├── ContentAnalyzer.tsx      → /api/analyze-content
│   ├── ContentStudio.tsx        → /api/generate-content
│   └── SafetyCopyright.tsx      → /api/scan-content
│
├── components/
│   └── ChatbotRobot.tsx         → /api/chat
│
└── lib/
    └── gemini.ts                (Legacy - now uses backend)
```

### Backend Endpoints

```
server.js
├── POST /api/analyze-content
│   ├── Input: { content, platform, region }
│   └── Output: { score, suggestions, hashtags, ... }
│
├── POST /api/generate-content
│   ├── Input: { content, niche, platform, hookStyle, ... }
│   └── Output: { hooks, titles, platformContent, ... }
│
├── POST /api/chat
│   ├── Input: { message, conversationHistory }
│   └── Output: { response }
│
└── POST /api/scan-content
    ├── Input: { content }
    └── Output: { riskLevel, copyrightIssues, ... }
```

## 🔄 Data Flow

### Content Analyzer Flow
```
User Input (Content + Platform + Region)
    ↓
ContentAnalyzer.tsx
    ↓
POST /api/analyze-content
    ↓
Gemini API (Analysis Prompt)
    ↓
JSON Response (Scores, Suggestions, Hashtags)
    ↓
Display Results with Tabs
```

### Content Studio Flow
```
User Input (Idea + Settings)
    ↓
ContentStudio.tsx
    ↓
POST /api/generate-content
    ↓
Gemini API (Generation Prompt)
    ↓
JSON Response (Hooks, Titles, Content, Thumbnails)
    ↓
Display in Multiple Sections
```

### Chatbot Flow
```
User Message
    ↓
ChatbotRobot.tsx
    ↓
POST /api/chat (with history)
    ↓
Gemini API (Conversation Prompt)
    ↓
Text Response
    ↓
Display in Chat Window
```

### Safety Scanner Flow
```
User Content
    ↓
SafetyCopyright.tsx
    ↓
POST /api/scan-content
    ↓
Gemini API (Safety Analysis Prompt)
    ↓
JSON Response (Risks, Issues, Scores)
    ↓
Display Issues and Recommendations
```

## 🔐 Security Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Environment Variables                 │
│                                                          │
│  .env file (NOT in git)                                 │
│  ├── VITE_GEMINI_API_KEY=***                           │
│  ├── VITE_FIREBASE_API_KEY=***                         │
│  └── Other Firebase configs                             │
└─────────────────────────────────────────────────────────┘
                         │
                         │ Loaded by
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    Backend Server                        │
│                                                          │
│  - API key stored in process.env                        │
│  - Never exposed to frontend                            │
│  - Used for Gemini API calls                            │
└─────────────────────────────────────────────────────────┘
```

## 📊 Request/Response Patterns

### Standard Request Pattern
```javascript
// Frontend
const response = await fetch('http://localhost:3001/api/endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ...data })
});

const result = await response.json();
```

### Standard Response Pattern
```javascript
// Backend
try {
  // Process request
  const result = await callGeminiAPI(prompt);
  res.json(result);
} catch (error) {
  console.error('Error:', error);
  res.status(500).json({ error: 'Operation failed' });
}
```

## 🎯 Error Handling Flow

```
User Action
    ↓
Frontend Request
    ↓
Backend Validation ──→ [Invalid] ──→ 400 Error ──→ Toast Notification
    ↓ [Valid]
Gemini API Call
    ↓
API Response ──→ [Error] ──→ 500 Error ──→ Toast Notification
    ↓ [Success]                              ↓ [Fallback]
Parse JSON                              Mock Data (Demo)
    ↓
Return to Frontend
    ↓
Display Results
```

## 🔄 State Management

### Content Analyzer State
```typescript
const [content, setContent] = useState("");
const [platform, setPlatform] = useState("Instagram");
const [region, setRegion] = useState("India");
const [analyzed, setAnalyzed] = useState(false);
const [loading, setLoading] = useState(false);
const [result, setResult] = useState<AnalysisResult | null>(null);
```

### Content Studio State
```typescript
const [formData, setFormData] = useState({
  content, niche, platform, hookStyle,
  language, contentType, targetAudience, tone
});
const [generated, setGenerated] = useState(false);
const [loading, setLoading] = useState(false);
const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
```

### Chatbot State
```typescript
const [isOpen, setIsOpen] = useState(false);
const [messages, setMessages] = useState<{text: string, isUser: boolean}[]>([]);
const [input, setInput] = useState('');
const [loading, setLoading] = useState(false);
```

### Safety Scanner State
```typescript
const [content, setContent] = useState("");
const [loading, setLoading] = useState(false);
const [scanned, setScanned] = useState(false);
const [result, setResult] = useState<ScanResult | null>(null);
```

## 🚀 Performance Optimization

### Response Times
```
Content Analyzer:    3-5 seconds
Content Studio:      5-8 seconds (more content)
Chatbot:            2-4 seconds
Safety Scanner:     3-5 seconds
```

### Optimization Strategies
1. **Loading States**: Show progress to users
2. **Error Handling**: Graceful degradation with fallbacks
3. **Caching**: (Future) Cache repeated queries
4. **Rate Limiting**: (Future) Prevent API abuse
5. **Compression**: JSON responses are compact

## 📱 User Experience Flow

```
Landing Page
    ↓
Authentication (Firebase)
    ↓
Dashboard
    ├── Content Analyzer
    │   └── Analyze → Results → Export
    │
    ├── Content Studio
    │   └── Generate → Review → Copy/Save
    │
    ├── Safety Scanner
    │   └── Scan → Issues → Fix
    │
    └── Chatbot (Always Available)
        └── Ask → Answer → Follow-up
```

## 🔧 Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui + Tailwind CSS
- **State**: React Hooks
- **Routing**: React Router
- **HTTP**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **API**: RESTful
- **CORS**: Enabled for frontend
- **Environment**: dotenv

### AI Integration
- **Provider**: Google Gemini
- **Model**: gemini-2.5-flash
- **API**: REST API
- **Format**: JSON

### Database
- **Auth**: Firebase Authentication
- **Storage**: Firebase Firestore
- **Files**: Firebase Storage

## 📈 Scalability Considerations

### Current Architecture
- Single server instance
- Direct API calls to Gemini
- No caching layer
- No load balancing

### Future Enhancements
1. **Caching Layer**: Redis for repeated queries
2. **Load Balancing**: Multiple server instances
3. **Rate Limiting**: Prevent API abuse
4. **Queue System**: Handle high traffic
5. **CDN**: Static asset delivery
6. **Database**: Store generated content
7. **Analytics**: Track usage patterns

## 🔍 Monitoring & Logging

### Current Logging
```javascript
console.log('API server running on http://localhost:3001');
console.error('Error:', error);
```

### Future Monitoring
1. **Error Tracking**: Sentry or similar
2. **Performance**: Response time tracking
3. **Usage Analytics**: API call statistics
4. **User Behavior**: Feature usage patterns
5. **API Quotas**: Gemini API usage monitoring

## 🎯 Integration Points

### External Services
```
Creator Copilot Platform
    ├── Google Gemini API (AI)
    ├── Firebase Auth (Authentication)
    ├── Firebase Firestore (Database)
    ├── Firebase Storage (Files)
    └── Spline (3D Robot)
```

### Internal Services
```
Frontend ←→ Backend ←→ Gemini API
    ↓           ↓
Firebase    Logging
```

## 📝 API Documentation

### Endpoint: /api/analyze-content
**Method**: POST
**Input**:
```json
{
  "content": "string",
  "platform": "Instagram|LinkedIn|YouTube|X (Twitter)|...",
  "region": "India|United States|..."
}
```
**Output**:
```json
{
  "score": 85,
  "suggestions": ["..."],
  "hashtags": ["#..."],
  "engagementPrediction": "High",
  "readabilityScore": 78,
  "sentimentScore": 45,
  "viralPotential": 72,
  ...
}
```

### Endpoint: /api/generate-content
**Method**: POST
**Input**:
```json
{
  "content": "string",
  "niche": "string",
  "platform": "string",
  "hookStyle": "string",
  "language": "string",
  "contentType": "string",
  "targetAudience": "string",
  "tone": "string"
}
```
**Output**:
```json
{
  "hooks": ["..."],
  "titles": ["..."],
  "platformContent": {...},
  "thumbnails": [{...}],
  "hashtags": ["..."],
  "estimatedReach": {...},
  "engagementPrediction": 78
}
```

### Endpoint: /api/chat
**Method**: POST
**Input**:
```json
{
  "message": "string",
  "conversationHistory": [{text: "string", isUser: boolean}]
}
```
**Output**:
```json
{
  "response": "string"
}
```

### Endpoint: /api/scan-content
**Method**: POST
**Input**:
```json
{
  "content": "string"
}
```
**Output**:
```json
{
  "riskLevel": "Low Risk|Medium Risk|High Risk",
  "copyrightIssues": [{...}],
  "accessibilityScore": 8,
  "accessibilityIssues": [{...}],
  "originalityScore": 92,
  "recommendations": ["..."]
}
```

---

**Architecture Version**: 1.0
**Last Updated**: March 7, 2026
**Status**: Production Ready ✅
