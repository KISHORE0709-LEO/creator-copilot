# 🚀 AI Creator Copilot

> Your AI-powered content creation and optimization platform for social media creators

## ✨ Features

### 🎯 Content Analyzer
- **Advanced AI Analysis**: 8-metric comprehensive content scoring system
- **Platform-Specific Optimization**: Tailored insights for Instagram, LinkedIn, YouTube, X (Twitter), TikTok, Facebook, Pinterest
- **Regional Intelligence**: Cultural and timezone-aware recommendations for 13+ regions
- **Smart Hashtag Generation**: AI-powered hashtag recommendations with engagement potential scoring
- **Competitor Analysis**: AI-driven competitive intelligence
- **Export Functionality**: Professional JSON export for reporting

### 👤 Profile Management
- **Complete User Profiles**: Avatar upload, social media links, platform status
- **Performance Analytics**: Content performance graphs and engagement tracking
- **Social Media Integration**: Connect and manage multiple platform accounts
- **Real-time Stats**: Follower counts, engagement rates, content analytics

### 🔒 Security & Privacy
- **Enterprise-grade Security**: All API keys and sensitive data properly protected
- **Firebase Authentication**: Secure user authentication and data management
- **Environment Protection**: Comprehensive .gitignore and security validation

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **AI Integration**: Google Gemini API
- **Charts**: Recharts
- **State Management**: React Context + Hooks

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Firebase account
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd creator-copilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example file
   cp .env.example.gemini .env.local
   
   # Edit .env.local with your actual API keys
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:3001

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   └── ...
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
│   ├── auth.ts         # Authentication functions
│   ├── firebase.ts     # Firebase configuration
│   └── gemini.ts       # AI integration
├── pages/              # Application pages
│   ├── Auth.tsx        # Authentication page
│   ├── Profile.tsx     # User profile management
│   ├── ContentAnalyzer.tsx  # AI content analysis
│   └── ...
└── ...
```

## 🔑 Environment Variables

Create a `.env.local` file with:

```bash
# Gemini AI
VITE_GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## 🔒 Security

- All sensitive data is protected via `.gitignore`
- API keys are never committed to version control
- Run `./security-check.sh` to validate security
- See [SECURITY.md](SECURITY.md) for detailed guidelines

## 📊 Content Analyzer Features

### Advanced Metrics
- **Content Quality Score** (0-100)
- **Readability Score** (0-100)
- **Sentiment Analysis** (-100 to +100)
- **Viral Potential** (0-100)
- **Brand Alignment** (0-100)
- **Call-to-Action Strength** (0-100)
- **Keyword Density Analysis**
- **Optimal Posting Times**

### Platform Intelligence
- **Instagram**: Visual appeal, story potential, reel optimization
- **LinkedIn**: Professional tone, thought leadership, networking
- **YouTube**: SEO optimization, thumbnail potential, watch time
- **X (Twitter)**: Character efficiency, trending topics, retweet potential
- **TikTok**: Trend alignment, viral hooks, Gen Z appeal

## 👤 Profile Features

### Social Media Management
- Connect multiple social platforms
- Active/inactive status per platform
- Follower count tracking
- Clickable social media badges

### Performance Analytics
- Content performance graphs (7 days / 6 months)
- Engagement trend analysis
- Follower growth tracking
- Average engagement rate calculation

### Avatar & Customization
- Avatar upload functionality
- Profile editing capabilities
- Account statistics and insights

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

### Environment Setup
- Use your hosting platform's environment variable system
- Never deploy `.env.local` files
- Set up proper secrets management
- Enable API key restrictions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: support@creatorcopilot.com
- 📖 Documentation: [docs.creatorcopilot.com](https://docs.creatorcopilot.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-repo/creator-copilot/issues)

## 🙏 Acknowledgments

- [Google Gemini](https://ai.google.dev/) for AI capabilities
- [Firebase](https://firebase.google.com/) for authentication and database
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Recharts](https://recharts.org/) for data visualization

---

**Made with ❤️ for content creators worldwide**
