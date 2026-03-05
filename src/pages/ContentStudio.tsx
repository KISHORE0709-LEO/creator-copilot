import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import PillTabs from "@/components/PillTabs";
import { 
  Sparkles, Instagram, Linkedin, Youtube, Twitter, Zap, Globe, Copy, Check, 
  Download, Save, Wand2, Image, Video, FileText, Hash, Clock, Target,
  TrendingUp, Users, Eye, Heart, MessageCircle, Share, BarChart3
} from "lucide-react";

const hookStyles = ["Question", "Bold Claim", "Statistic", "Story", "Contrarian", "How-to", "List", "Behind-the-scenes"];
const languages = ["English", "Hindi", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", "Gujarati"];
const platforms = ["Instagram", "LinkedIn", "YouTube", "X (Twitter)", "TikTok", "Facebook"];
const contentTypes = ["Post", "Reel", "Story", "Carousel", "Video", "Thread", "Article"];

interface GeneratedContent {
  hooks: string[];
  titles: string[];
  platformContent: { [key: string]: string };
  thumbnails: Array<{ text: string; palette: string[]; tip: string }>;
  hashtags: string[];
  captions: string[];
  estimatedReach: { min: number; max: number };
  engagementPrediction: number;
}

const ContentStudio = () => {
  const [subTab, setSubTab] = useState("Hook & Platform Writer");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    niche: "",
    platform: "Instagram",
    hookStyle: "Question",
    language: "English",
    contentType: "Post",
    targetAudience: "",
    tone: "Professional"
  });
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!formData.content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter your content idea first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          userId: user?.uid
        })
      });

      if (!response.ok) {
        throw new Error('Content generation failed');
      }

      const result = await response.json();
      setGeneratedContent(result);
      setGenerated(true);
      
      toast({
        title: "Content Generated!",
        description: "Your AI-powered content is ready",
      });
    } catch (error) {
      // Fallback to mock data for demo
      const mockContent: GeneratedContent = {
        hooks: [
          "🤖 These 5 AI tools just made my entire team obsolete...",
          "What if I told you AI can do 90% of your work?",
          "Stop hiring. Start automating. Here's how →",
          "I replaced 5 employees with these AI tools (results shocked me)",
          "The AI revolution isn't coming — it's already here"
        ],
        titles: [
          "5 AI Tools That Replace Teams",
          "The AI Automation Playbook", 
          "Why I Fired My Team (For AI)",
          "AI vs Human: The Real Cost"
        ],
        platformContent: {
          Instagram: "🤖 I replaced 5 team members with AI tools — and my productivity went UP 300%. Here are the exact tools I'm using (save this post): 1. ChatGPT for writing 2. Midjourney for design... #AITools #Productivity #CreatorTips",
          LinkedIn: "I made a controversial decision last month. I let go of 5 team members. Not because of budget cuts — because AI could do their jobs better, faster, and 24/7. Here's what happened next...",
          YouTube: "I Replaced My Entire Team With AI — Here's What Happened (5 tools, real results, no BS). Watch as I walk through each tool and show you exactly how I set them up...",
          "X (Twitter)": "I replaced 5 employees with AI tools. My output went up 300%. My costs went down 80%. Here are the 5 tools (thread) 🧵"
        },
        thumbnails: [
          { text: '"5 AI TOOLS"', palette: ["#b5ff4d", "#0a0a0f", "#ffffff"], tip: "Bold text overlay, shocked face, split screen" },
          { text: '"AI vs TEAM"', palette: ["#ff6b6b", "#4d9fff", "#ffffff"], tip: "VS layout, contrast colors, minimal text" },
          { text: '"I FIRED MY TEAM"', palette: ["#ff4444", "#b5ff4d", "#0a0a0f"], tip: "Clickbait style, emoji overlay, dark bg" }
        ],
        hashtags: ["#AITools", "#Productivity", "#CreatorTips", "#Automation", "#TechStartup", "#SoloFounder", "#AIRevolution", "#FutureOfWork"],
        captions: [
          "The future of work is here, and it's powered by AI. Which tool will you try first?",
          "Controversial take: AI isn't replacing jobs, it's replacing inefficiency. Thoughts?",
          "From skeptic to believer: My AI transformation journey in 30 days."
        ],
        estimatedReach: { min: 5000, max: 25000 },
        engagementPrediction: 78
      };
      
      setGeneratedContent(mockContent);
      setGenerated(true);
      
      toast({
        title: "Demo Content Generated!",
        description: "Using sample data for demonstration",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
    setTimeout(() => setCopiedText(null), 2000);
  };

  const saveContent = async (content: string, type: string) => {
    // TODO: Save to user's content library
    toast({
      title: "Content Saved!",
      description: `${type} saved to your content library`,
    });
  };

  const platformIcons: { [key: string]: React.ReactNode } = {
    Instagram: <Instagram className="w-5 h-5 text-pink-400" />,
    LinkedIn: <Linkedin className="w-5 h-5 text-blue-400" />,
    YouTube: <Youtube className="w-5 h-5 text-red-400" />,
    "X (Twitter)": <Twitter className="w-5 h-5 text-sky-400" />,
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <PillTabs
        tabs={["Hook & Platform Writer", "Content Assembly", "Language & Accessibility", "Content Library"]}
        active={subTab}
        onChange={(t) => { setSubTab(t); setGenerated(false); }}
      />

      {subTab === "Hook & Platform Writer" && (
        <div className="space-y-6 animate-fade-in">
          {/* Enhanced Input Form */}
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Wand2 className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">AI Content Generator</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Content Idea</label>
                <textarea
                  placeholder="Enter your raw content idea (e.g., '5 AI tools that replaced my team')..."
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
                />
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-muted-foreground">{formData.content.length} characters</span>
                  <span className="text-xs text-muted-foreground">Tip: Be specific for better results</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Niche</label>
                  <input 
                    placeholder="e.g., Tech, Fitness, Business" 
                    value={formData.niche}
                    onChange={(e) => setFormData({...formData, niche: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" 
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {platforms.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Hook Style</label>
                  <select 
                    value={formData.hookStyle}
                    onChange={(e) => setFormData({...formData, hookStyle: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {hookStyles.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Content Type</label>
                  <select 
                    value={formData.contentType}
                    onChange={(e) => setFormData({...formData, contentType: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {contentTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Target Audience</label>
                  <input 
                    placeholder="e.g., Entrepreneurs, Students, Professionals" 
                    value={formData.targetAudience}
                    onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" 
                  />
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Tone</label>
                  <select 
                    value={formData.tone}
                    onChange={(e) => setFormData({...formData, tone: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    <option>Professional</option>
                    <option>Casual</option>
                    <option>Humorous</option>
                    <option>Inspirational</option>
                    <option>Educational</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading || !formData.content.trim()} 
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="dot-bounce"><span /><span /><span /></span>
                  <span>Generating AI Content...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Content
                </>
              )}
            </button>
          </div>

          {generated && generatedContent && (
            <>
              {/* Performance Prediction */}
              <div className="card-surface p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-primary" />
                    Performance Prediction
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    generatedContent.engagementPrediction > 70 ? 'bg-green-500/10 text-green-500' :
                    generatedContent.engagementPrediction > 40 ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-red-500/10 text-red-500'
                  }`}>
                    {generatedContent.engagementPrediction}% Engagement Score
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Est. Reach</p>
                      <p className="text-xs text-muted-foreground">{generatedContent.estimatedReach.min.toLocaleString()} - {generatedContent.estimatedReach.max.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Est. Likes</p>
                      <p className="text-xs text-muted-foreground">{Math.round(generatedContent.estimatedReach.min * 0.05).toLocaleString()} - {Math.round(generatedContent.estimatedReach.max * 0.08).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Est. Comments</p>
                      <p className="text-xs text-muted-foreground">{Math.round(generatedContent.estimatedReach.min * 0.02).toLocaleString()} - {Math.round(generatedContent.estimatedReach.max * 0.03).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Generated Hooks */}
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Generated Hooks
                  </h4>
                  <span className="text-xs text-muted-foreground">{generatedContent.hooks.length} variations</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {generatedContent.hooks.map((hook, i) => (
                    <div key={i} className="card-surface p-4 text-sm text-foreground hover:border-primary/50 transition-colors group">
                      <div className="flex justify-between items-start gap-3">
                        <p className="flex-1">{hook}</p>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(hook)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copiedText === hook ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => saveContent(hook, 'Hook')}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title Suggestions */}
              <div className="animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Title Suggestions</h4>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.titles.map((title, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(title)}
                      className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium cursor-pointer hover:bg-primary/20 transition-colors flex items-center gap-2"
                    >
                      {title}
                      {copiedText === title ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-50" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Platform-Specific Content */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in">
                {Object.entries(generatedContent.platformContent).map(([platform, content]) => (
                  <div key={platform} className="card-surface border border-border rounded-lg p-5 group">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {platformIcons[platform]}
                        <span className="font-heading text-sm font-bold text-foreground">{platform}</span>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(content)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {copiedText === content ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => saveContent(content, platform)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed">{content}</p>
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Est. {Math.round(generatedContent.estimatedReach.min * (platform === 'Instagram' ? 1.2 : platform === 'LinkedIn' ? 0.8 : 1)).toLocaleString()} reach</span>
                        <span>{content.length} chars</span>
                        <span>{(content.match(/#\w+/g) || []).length} hashtags</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hashtag Recommendations */}
              <div className="card-surface p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-heading text-sm font-bold text-foreground flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" />
                    Hashtag Recommendations
                  </h4>
                  <button
                    onClick={() => copyToClipboard(generatedContent.hashtags.join(' '))}
                    className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy All
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((hashtag, i) => (
                    <button
                      key={i}
                      onClick={() => copyToClipboard(hashtag)}
                      className="px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-1"
                    >
                      {hashtag}
                      {copiedText === hashtag ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3 opacity-50" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Thumbnail Concepts */}
              <div className="space-y-3 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Thumbnail Concepts
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatedContent.thumbnails.map((thumb, i) => (
                    <div key={i} className="card-surface p-4 group">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-heading text-lg font-extrabold text-foreground">{thumb.text}</p>
                        <button
                          onClick={() => saveContent(`${thumb.text} - ${thumb.tip}`, 'Thumbnail')}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex gap-1.5 mb-2">
                        {thumb.palette.map((color, j) => (
                          <span 
                            key={j} 
                            className="w-6 h-6 rounded-full border border-border cursor-pointer hover:scale-110 transition-transform" 
                            style={{ background: color }}
                            title={color}
                          />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{thumb.tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "Content Assembly" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">Content Assembly Line</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Raw Content Input</label>
                <textarea 
                  placeholder="Paste raw text, voice transcript, or a link..." 
                  rows={6} 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" 
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>{formData.content.split(' ').length} words</span>
                    <span>{formData.content.length} characters</span>
                  </div>
                  <div className="flex gap-2">
                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      From Video
                    </button>
                    <button className="text-xs text-primary hover:text-primary/80 flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      From URL
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Target Platform</label>
                  <select 
                    value={formData.platform}
                    onChange={(e) => setFormData({...formData, platform: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {platforms.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Content Format</label>
                  <select 
                    value={formData.contentType}
                    onChange={(e) => setFormData({...formData, contentType: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {contentTypes.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Processing Mode</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
                    <option>Smart Summary</option>
                    <option>Key Points</option>
                    <option>Story Format</option>
                    <option>Tutorial Steps</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading || !formData.content.trim()} 
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="dot-bounce"><span /><span /><span /></span>
                  <span>Processing Content...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Generate Post
                </>
              )}
            </button>
          </div>
          
          {generated && (
            <>
              <div className="card-surface p-6 animate-fade-in space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-heading text-sm font-bold text-foreground">Ready-to-Post Content</h4>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3" /> 
                      Saved ~45 mins
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => copyToClipboard("Generated content here...")}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => saveContent("Generated content", "Assembled Post")}
                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 rounded-lg bg-surface-input border border-border text-sm text-foreground leading-relaxed space-y-3">
                  <p className="font-semibold">🚀 Stop scrolling — this might change how you create content forever.</p>
                  <p>I spent the last 30 days testing every AI tool that promises to "10x your productivity." Most were garbage. But these 5? They actually delivered.</p>
                  <p>Here's the breakdown: 🧵</p>
                  <div className="space-y-1">
                    <p>1/ ChatGPT-4 — Writing partner that never sleeps</p>
                    <p>2/ Midjourney — Visual content without a designer</p>
                    <p>3/ Descript — Video editing with AI magic</p>
                    <p>4/ Notion AI — Research assistant on steroids</p>
                    <p>5/ Buffer AI — Smart scheduling</p>
                  </div>
                  <p className="text-primary font-medium">💬 Which AI tool changed YOUR workflow? Drop it below 👇</p>
                  <p className="text-blue-400">#AITools #ContentCreator #Productivity #TechCreator #CreatorEconomy</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">8.5/10</p>
                    <p className="text-xs text-muted-foreground">Readability Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-500">12</p>
                    <p className="text-xs text-muted-foreground">Engagement Hooks</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-500">5</p>
                    <p className="text-xs text-muted-foreground">Call-to-Actions</p>
                  </div>
                </div>
              </div>

              {/* Content Variations */}
              <div className="card-surface p-5 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-foreground mb-4">Alternative Versions</h4>
                <div className="space-y-3">
                  {[
                    { type: "Short Form", content: "5 AI tools that replaced my team. Results: 300% productivity ⬆️, 80% costs ⬇️. Thread below 🧵" },
                    { type: "Story Format", content: "Last month I made a controversial decision. I let go of 5 team members. Not because of budget cuts..." },
                    { type: "Question Hook", content: "What if I told you 5 AI tools could replace your entire team? Here's exactly what happened when I tried it..." }
                  ].map((variation, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary border border-border group">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-primary">{variation.type}</span>
                          <p className="text-sm text-foreground mt-1">{variation.content}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => copyToClipboard(variation.content)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => saveContent(variation.content, variation.type)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Save className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "Language & Accessibility" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-primary" />
              <h3 className="font-heading text-lg font-bold text-foreground">Language & Accessibility Adapter</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Content to Translate</label>
                <textarea 
                  placeholder="Paste content to translate and adapt..." 
                  rows={6} 
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Target Language</label>
                  <select 
                    value={formData.language}
                    onChange={(e) => setFormData({...formData, language: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
                  >
                    {languages.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Cultural Context</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
                    <option>Indian Context</option>
                    <option>Western Context</option>
                    <option>Southeast Asian</option>
                    <option>Middle Eastern</option>
                    <option>Global Neutral</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Accessibility Level</label>
                  <select className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none">
                    <option>Standard</option>
                    <option>High Readability</option>
                    <option>Simple Language</option>
                    <option>Technical Audience</option>
                  </select>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate} 
              disabled={loading || !formData.content.trim()} 
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="dot-bounce"><span /><span /><span /></span>
                  <span>Translating & Adapting...</span>
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4" />
                  Translate & Adapt
                </>
              )}
            </button>
          </div>
          
          {generated && (
            <>
              <div className="card-surface p-5 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h4 className="font-heading text-sm font-bold text-foreground">Translated Version</h4>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 text-xs font-bold">Readability: 8.2/10</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard("Translated content...")}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => saveContent("Translated content", "Translation")}
                      className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Save className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-surface-input border border-border text-sm text-foreground leading-relaxed">
                  🚀 स्क्रॉल करना बंद करो — ये आपका content creation बदल सकता है। मैंने पिछले 30 दिन हर AI tool test किया। ज़्यादातर बेकार थे। लेकिन ये 5? इन्होंने सच में deliver किया...
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
                <div className="card-surface p-5">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-3">Cultural Adaptations</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Added Indian context references (₹ instead of $)
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Used familiar Hinglish terms for better connection
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Adjusted time references to IST
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Included culturally relevant examples
                    </li>
                  </ul>
                </div>
                
                <div className="card-surface p-5">
                  <h4 className="font-heading text-sm font-bold text-foreground mb-3">Formatting Tips</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Use shorter sentences for Hindi audience — attention span is lower on mobile
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Mix Hinglish where natural — pure Hindi feels too formal
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Keep emojis — they transcend language barriers
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span> 
                      Add voice notes for better engagement in regional content
                    </li>
                  </ul>
                </div>
              </div>

              {/* Multiple Language Versions */}
              <div className="card-surface p-5 animate-fade-in">
                <h4 className="font-heading text-sm font-bold text-foreground mb-4">Quick Translations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { lang: "Tamil", content: "🚀 ஸ்க்ரோல் செய்வதை நிறுத்துங்கள் — இது உங்கள் content creation-ஐ மாற்றலாம்..." },
                    { lang: "Telugu", content: "🚀 స్క్రోల్ చేయడం ఆపండి — ఇది మీ content creation మార్చవచ్చు..." },
                    { lang: "Bengali", content: "🚀 স্ক্রল করা বন্ধ করুন — এটি আপনার content creation পরিবর্তন করতে পারে..." },
                    { lang: "Marathi", content: "🚀 स्क्रॉल करणे थांबवा — हे तुमचे content creation बदलू शकते..." }
                  ].map((translation, i) => (
                    <div key={i} className="p-3 rounded-lg bg-secondary border border-border group">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex-1">
                          <span className="text-xs font-medium text-primary">{translation.lang}</span>
                          <p className="text-sm text-foreground mt-1">{translation.content}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(translation.content)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {subTab === "Content Library" && (
        <div className="space-y-6 animate-fade-in">
          <div className="card-surface p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Save className="w-5 h-5 text-primary" />
                <h3 className="font-heading text-lg font-bold text-foreground">Your Content Library</h3>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-secondary/80 transition-colors text-sm">
                  Export All
                </button>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors text-sm">
                  New Folder
                </button>
              </div>
            </div>

            {/* Library Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-xs text-muted-foreground">Saved Posts</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Hooks</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Thumbnails</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary">
                <p className="text-2xl font-bold text-foreground">156</p>
                <p className="text-xs text-muted-foreground">Total Items</p>
              </div>
            </div>

            {/* Content Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-heading text-sm font-bold text-foreground">Recent Content</h4>
                <div className="flex gap-2">
                  <button className="text-xs text-muted-foreground hover:text-foreground">All</button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Posts</button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Hooks</button>
                  <button className="text-xs text-muted-foreground hover:text-foreground">Thumbnails</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { type: "Instagram Post", title: "5 AI Tools That Replace Teams", date: "2 hours ago", platform: "Instagram" },
                  { type: "Hook", title: "🤖 These 5 AI tools just made my entire team obsolete...", date: "1 day ago", platform: "Multi" },
                  { type: "LinkedIn Article", title: "The AI Automation Playbook", date: "3 days ago", platform: "LinkedIn" },
                  { type: "Thumbnail", title: '"AI vs TEAM" concept', date: "1 week ago", platform: "YouTube" },
                  { type: "Twitter Thread", title: "I replaced 5 employees with AI tools...", date: "1 week ago", platform: "X (Twitter)" },
                  { type: "Translation", title: "Hindi version - AI Tools post", date: "2 weeks ago", platform: "Multi" }
                ].map((item, i) => (
                  <div key={i} className="card-surface p-4 group hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-xs font-medium text-primary">{item.type}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 text-muted-foreground hover:text-foreground">
                          <Copy className="w-3 h-3" />
                        </button>
                        <button className="p-1 text-muted-foreground hover:text-foreground">
                          <Download className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <h5 className="font-medium text-foreground text-sm mb-2 line-clamp-2">{item.title}</h5>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{item.date}</span>
                      <span>{item.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentStudio;
