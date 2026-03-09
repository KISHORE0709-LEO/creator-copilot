import { useState } from "react";
import ScoreRing from "@/components/ScoreRing";
import { Sparkles, Copy, Check, TrendingUp, Clock, Target, Zap, Heart, Eye, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzeContentWithBedrock } from "@/lib/bedrock";
interface AnalysisResult {
  score: number;
  hookRating?: number;
  suggestions: string[];
  issues?: string[];
  platformTip?: string;
  hashtags: string[];
  engagementPrediction: "Low" | "Medium" | "High";
  engagementReason: string;
  readabilityScore?: number;
  sentimentScore?: number;
  keywordDensity?: { [key: string]: number };
  optimalPostingTimes?: string[];
  competitorAnalysis?: string;
  viralPotential?: number;
  brandAlignment?: number;
  callToActionStrength?: number;
}

const ContentAnalyzer = () => {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("Instagram");
  const [region, setRegion] = useState("India");
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [copiedHashtag, setCopiedHashtag] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "metrics" | "optimization">("overview");
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter your content first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const analysisResult = await analyzeContentWithBedrock(content, platform, region);
      
      const mappedResult: AnalysisResult = {
        score: analysisResult.qualityScore || analysisResult.score || 0,
        hookRating: analysisResult.hookRating,
        suggestions: analysisResult.suggestions || [],
        issues: analysisResult.issues,
        platformTip: analysisResult.platformTip,
        hashtags: analysisResult.hashtags || [],
        engagementPrediction: analysisResult.engagementPrediction || "Medium",
        engagementReason: analysisResult.engagementReason || "Analysis complete",
        readabilityScore: analysisResult.readabilityScore,
        sentimentScore: analysisResult.sentimentScore,
        keywordDensity: analysisResult.keywordDensity,
        optimalPostingTimes: analysisResult.optimalPostingTimes,
        competitorAnalysis: analysisResult.competitorAnalysis,
        viralPotential: analysisResult.viralPotential,
        brandAlignment: analysisResult.brandAlignment,
        callToActionStrength: analysisResult.callToActionStrength,
      };
      
      setResult(mappedResult);
      setAnalyzed(true);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : "Something went wrong, please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyHashtag = (hashtag: string) => {
    navigator.clipboard.writeText(hashtag);
    setCopiedHashtag(hashtag);
    toast({
      title: "Copied!",
      description: `${hashtag} copied to clipboard`,
    });
    setTimeout(() => setCopiedHashtag(null), 2000);
  };

  const copyAllHashtags = () => {
    if (result?.hashtags) {
      const hashtagText = result.hashtags.join(' ');
      navigator.clipboard.writeText(hashtagText);
      toast({
        title: "All Hashtags Copied!",
        description: `${result.hashtags.length} hashtags copied to clipboard`,
      });
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 20) return "text-green-500";
    if (score > -20) return "text-yellow-500";
    return "text-red-500";
  };

  const getMetricColor = (score: number) => {
    if (score >= 70) return "text-green-500";
    if (score >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const exportAnalysis = () => {
    if (!result) return;
    
    const exportData = {
      content: content.substring(0, 100) + "...",
      platform,
      region,
      analysisDate: new Date().toISOString(),
      ...result
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `content-analysis-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Analysis Exported!",
      description: "Your analysis has been downloaded as a JSON file",
    });
  };

  const getScoreColor = (score: number) => {
    if (score > 70) return "text-primary";
    if (score >= 40) return "text-yellow-400";
    return "text-destructive";
  };

  const getEngagementColor = (prediction: string) => {
    if (prediction === "High") return "bg-primary/10 text-primary border-primary/20";
    if (prediction === "Medium") return "bg-yellow-400/10 text-yellow-400 border-yellow-400/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
      {/* Left — Input */}
      <div className="space-y-4">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground">Analyze Your Content (AWS Bedrock)</h3>
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Paste your content draft</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write or paste your social media post here..."
              rows={8}
              className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-muted-foreground">
                {content.length} characters
              </span>
              <span className="text-xs text-muted-foreground">
                {platform === 'X (Twitter)' && content.length > 280 ? 'Exceeds Twitter limit' : 
                 platform === 'Instagram' && content.length > 2200 ? 'Exceeds Instagram limit' : 
                 'Within limits'}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Platform</label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
              >
                <option>Instagram</option>
                <option>LinkedIn</option>
                <option>YouTube</option>
                <option>X (Twitter)</option>
                <option>TikTok</option>
                <option>Facebook</option>
                <option>Pinterest</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">Posting Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all appearance-none"
              >
                <option>India</option>
                <option>United States</option>
                <option>United Kingdom</option>
                <option>Canada</option>
                <option>Australia</option>
                <option>Germany</option>
                <option>France</option>
                <option>Japan</option>
                <option>Brazil</option>
                <option>Global</option>
                <option>Europe</option>
                <option>Asia</option>
                <option>North America</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !content}
            className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="dot-bounce"><span /><span /><span /></span>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Analyze with AWS Bedrock
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right — Output */}
      <div className="space-y-4">
        {!analyzed || !result ? (
          <div className="card-surface p-12 flex flex-col items-center justify-center text-center min-h-[300px]">
            <Sparkles className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">Paste your content and hit Analyze to get AI-powered insights</p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="card-surface p-1 flex rounded-lg">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "overview" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("metrics")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "metrics" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Advanced Metrics
              </button>
              <button
                onClick={() => setActiveTab("optimization")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                  activeTab === "optimization" 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Optimization
              </button>
              <button
                onClick={exportAnalysis}
                className="ml-2 p-2 text-muted-foreground hover:text-foreground transition-all"
                title="Export Analysis"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <>
                {/* Content Quality Score */}
                <div className="card-surface p-6 flex flex-col items-center animate-fade-in">
                  <ScoreRing score={result.score} />
                  <p className={`text-3xl font-heading font-extrabold mt-3 ${getScoreColor(result.score)}`}>
                    {result.score > 70 ? "Excellent" : result.score >= 40 ? "Good" : "Needs Work"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Content Quality Score</p>
                  {result.hookRating !== undefined && (
                    <div className="mt-4 text-center">
                      <p className="text-2xl font-bold text-primary">{result.hookRating}/10</p>
                      <p className="text-xs text-muted-foreground">Hook Rating</p>
                    </div>
                  )}
                </div>

                {/* Issues */}
                {result.issues && result.issues.length > 0 && (
                  <div className="card-surface p-6 animate-fade-in border-l-4 border-red-500" style={{ animationDelay: "0.1s" }}>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                        <span className="text-2xl">⚠️</span>
                        Critical Issues Found
                      </h4>
                      <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-full text-xs font-bold">
                        {result.issues.length} Issues
                      </span>
                    </div>
                    <div className="space-y-4">
                      {result.issues.map((issue, index) => (
                        <div key={index} className="flex gap-3 p-3 bg-red-500/5 rounded-lg border border-red-500/20">
                          <span className="text-red-500 font-bold text-lg mt-0.5">❌</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{issue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions for Improvement */}
                <div className="card-surface p-6 animate-fade-in border-l-4 border-primary" style={{ animationDelay: "0.15s" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI-Powered Suggestions
                    </h4>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                      {result.suggestions.length} Tips
                    </span>
                  </div>
                  <div className="space-y-3">
                    {result.suggestions.map((suggestion, index) => (
                      <div key={index} className="flex gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20 hover:bg-primary/10 transition-all">
                        <span className="text-primary font-bold text-lg mt-0.5">💡</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground leading-relaxed">{suggestion}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Platform Tip */}
                {result.platformTip && (
                  <div className="card-surface p-6 animate-fade-in border-l-4 border-blue-500" style={{ animationDelay: "0.2s" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Target className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-heading text-base font-bold text-foreground">
                          {platform} Pro Strategy
                        </h4>
                        <p className="text-xs text-muted-foreground">Platform-specific optimization</p>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20">
                      <p className="text-sm text-foreground leading-relaxed font-medium">
                        {result.platformTip}
                      </p>
                    </div>
                  </div>
                )}

                {/* Predicted Engagement */}
                <div className="card-surface p-6 animate-fade-in border-l-4 border-purple-500" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-foreground">
                        Engagement Forecast
                      </h4>
                      <p className="text-xs text-muted-foreground">AI-powered prediction</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className={`px-6 py-3 rounded-xl border-2 font-bold text-lg ${getEngagementColor(result.engagementPrediction)}`}>
                      {result.engagementPrediction} Engagement
                    </span>
                  </div>
                  <div className="p-4 bg-purple-500/5 rounded-lg border border-purple-500/20">
                    <p className="text-sm text-foreground leading-relaxed font-medium">
                      {result.engagementReason}
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Advanced Metrics Tab */}
            {activeTab === "metrics" && (
              <>
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 gap-4 animate-fade-in">
                  <div className="card-surface p-5 border-l-4 border-blue-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <span className="text-sm font-bold text-foreground">Readability</span>
                    </div>
                    <p className={`text-3xl font-bold ${getMetricColor(result.readabilityScore || 50)}`}>
                      {result.readabilityScore || 50}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(result.readabilityScore || 50) >= 70 ? 'Easy to read' : (result.readabilityScore || 50) >= 40 ? 'Moderate clarity' : 'Needs simplification'}
                    </p>
                  </div>
                  
                  <div className="card-surface p-5 border-l-4 border-pink-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="w-5 h-5 text-pink-500" />
                      <span className="text-sm font-bold text-foreground">Sentiment</span>
                    </div>
                    <p className={`text-3xl font-bold ${getSentimentColor(result.sentimentScore || 0)}`}>
                      {result.sentimentScore || 0}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(result.sentimentScore || 0) > 20 ? 'Very positive' : (result.sentimentScore || 0) > -20 ? 'Neutral tone' : 'Negative tone'}
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-yellow-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm font-bold text-foreground">Viral Potential</span>
                    </div>
                    <p className={`text-3xl font-bold ${getMetricColor(result.viralPotential || 30)}`}>
                      {result.viralPotential || 30}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(result.viralPotential || 30) >= 70 ? 'High viral chance' : (result.viralPotential || 30) >= 40 ? 'Moderate potential' : 'Low viral chance'}
                    </p>
                  </div>

                  <div className="card-surface p-5 border-l-4 border-green-500">
                    <div className="flex items-center gap-2 mb-3">
                      <Target className="w-5 h-5 text-green-500" />
                      <span className="text-sm font-bold text-foreground">Brand Alignment</span>
                    </div>
                    <p className={`text-3xl font-bold ${getMetricColor(result.brandAlignment || 50)}`}>
                      {result.brandAlignment || 50}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {(result.brandAlignment || 50) >= 70 ? 'Strong brand fit' : (result.brandAlignment || 50) >= 40 ? 'Decent alignment' : 'Weak brand match'}
                    </p>
                  </div>
                </div>

                {/* Keyword Density */}
                {result.keywordDensity && Object.keys(result.keywordDensity).length > 0 && (
                  <div className="card-surface p-6 animate-fade-in border-l-4 border-orange-500" style={{ animationDelay: "0.15s" }}>
                    <h4 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
                      <span className="text-xl">🔑</span>
                      Top Keywords
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(result.keywordDensity).slice(0, 5).map(([keyword, density], index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-orange-500/5 rounded-lg border border-orange-500/20">
                          <span className="text-sm font-bold text-foreground">{keyword}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${density}%` }}></div>
                            </div>
                            <span className="text-sm font-bold text-orange-500 w-12 text-right">{density}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimal Posting Times */}
                <div className="card-surface p-6 animate-fade-in border-l-4 border-cyan-500" style={{ animationDelay: "0.3s" }}>
                  <h4 className="font-heading text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-500" />
                    Best Posting Times ({region})
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {(result.optimalPostingTimes || ["9:00 AM", "1:00 PM", "7:00 PM"]).map((time, index) => (
                      <div key={index} className="p-3 bg-cyan-500/10 border-2 border-cyan-500/30 rounded-lg text-center">
                        <p className="text-lg font-bold text-cyan-500">{time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Optimization Tab */}
            {activeTab === "optimization" && (
              <>
                {/* Hashtag Recommendations */}
                <div className="card-surface p-6 animate-fade-in border-l-4 border-purple-500">
                  <div className="flex justify-between items-center mb-5">
                    <div>
                      <h4 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
                        <span className="text-xl">#️⃣</span>
                        Trending Hashtags
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{result.hashtags.length} optimized hashtags</p>
                    </div>
                    <button
                      onClick={copyAllHashtags}
                      className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 transition-all hover:scale-105"
                    >
                      <Copy className="w-4 h-4" />
                      Copy All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {result.hashtags.map((hashtag, index) => (
                      <button
                        key={index}
                        onClick={() => copyHashtag(hashtag)}
                        className="px-4 py-2 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border-2 border-purple-500/30 text-purple-500 text-sm font-bold transition-all hover:scale-105 flex items-center gap-2"
                      >
                        {hashtag}
                        {copiedHashtag === hashtag ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-3 h-3 opacity-50" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Competitor Analysis */}
                {result.competitorAnalysis && (
                  <div className="card-surface p-6 animate-fade-in border-l-4 border-indigo-500" style={{ animationDelay: "0.15s" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                      </div>
                      <div>
                        <h4 className="font-heading text-base font-bold text-foreground">
                          Competitive Analysis
                        </h4>
                        <p className="text-xs text-muted-foreground">How you compare to trending content</p>
                      </div>
                    </div>
                    <div className="p-4 bg-indigo-500/5 rounded-lg border border-indigo-500/20">
                      <p className="text-sm text-foreground leading-relaxed font-medium">
                        {result.competitorAnalysis}
                      </p>
                    </div>
                  </div>
                )}

                {/* Call-to-Action Strength */}
                <div className="card-surface p-6 animate-fade-in border-l-4 border-emerald-500" style={{ animationDelay: "0.3s" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Target className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-heading text-base font-bold text-foreground">
                        Call-to-Action Power
                      </h4>
                      <p className="text-xs text-muted-foreground">Conversion effectiveness score</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-1000"
                          style={{ width: `${result.callToActionStrength || 40}%` }}
                        ></div>
                      </div>
                      <span className={`text-2xl font-bold ${getMetricColor(result.callToActionStrength || 40)} min-w-[60px] text-right`}>
                        {result.callToActionStrength || 40}%
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {(result.callToActionStrength || 40) >= 70 ? '🚀 Strong CTA - High conversion potential' : 
                       (result.callToActionStrength || 40) >= 40 ? '💡 Moderate CTA - Room for improvement' : 
                       '⚠️ Weak CTA - Add clear action steps'}
                    </p>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ContentAnalyzer;
