import { useState } from "react";
import { DollarSign, TrendingUp, MessageSquare, AlertTriangle, Sparkles, Clock, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { analyzePromotionTiming, predictMonetization, analyzeComments } from "@/lib/lambda";

const MonetizationEngagement = () => {
  const { toast } = useToast();
  
  const [promoForm, setPromoForm] = useState({ contentDescription: "", brand: "", length: "", contentType: "YouTube Video" });
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<any>(null);

  const [monetForm, setMonetForm] = useState({ topic: "", reach: "", audience: "", platform: "YouTube" });
  const [monetLoading, setMonetLoading] = useState(false);
  const [monetResult, setMonetResult] = useState<any>(null);

  const [comments, setComments] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentResult, setCommentResult] = useState<any>(null);
  const [copiedReply, setCopiedReply] = useState<string | null>(null);

  const handlePromoAnalysis = async () => {
    if (!promoForm.contentDescription || !promoForm.brand || !promoForm.length) {
      toast({ title: "Missing Fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setPromoLoading(true);
    try {
      const response = await analyzePromotionTiming({ ...promoForm, length: parseInt(promoForm.length) });
      setPromoResult(response.analysis);
      toast({ title: "✅ Analysis Complete", description: "Promotional timing suggestions ready" });
    } catch (error) {
      toast({ title: "Analysis Failed", description: error instanceof Error ? error.message : "Try again", variant: "destructive" });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleMonetPrediction = async () => {
    if (!monetForm.topic || !monetForm.reach || !monetForm.audience) {
      toast({ title: "Missing Fields", description: "Please fill all fields", variant: "destructive" });
      return;
    }
    setMonetLoading(true);
    try {
      const response = await predictMonetization(monetForm);
      setMonetResult(response.prediction);
      toast({ title: "✅ Prediction Complete", description: "Monetization insights ready" });
    } catch (error) {
      toast({ title: "Prediction Failed", description: error instanceof Error ? error.message : "Try again", variant: "destructive" });
    } finally {
      setMonetLoading(false);
    }
  };

  const handleCommentAnalysis = async () => {
    if (!comments.trim()) {
      toast({ title: "No Comments", description: "Please paste comments to analyze", variant: "destructive" });
      return;
    }
    setCommentLoading(true);
    try {
      const commentArray = comments.split('\n').filter(c => c.trim());
      const response = await analyzeComments({ comments: commentArray });
      setCommentResult(response.analysis);
      toast({ title: "✅ Analysis Complete", description: "Comment insights ready" });
    } catch (error) {
      toast({ title: "Analysis Failed", description: error instanceof Error ? error.message : "Try again", variant: "destructive" });
    } finally {
      setCommentLoading(false);
    }
  };

  const copyReply = (reply: string) => {
    navigator.clipboard.writeText(reply);
    setCopiedReply(reply);
    toast({ title: "Copied!", description: "Reply copied to clipboard" });
    setTimeout(() => setCopiedReply(null), 2000);
  };

  const loadExample = (type: 'promo' | 'monet' | 'comment') => {
    if (type === 'promo') {
      setPromoForm({ contentDescription: "Complete tutorial on building AI chatbots with Python and OpenAI API", brand: "Notion", length: "12", contentType: "YouTube Video" });
    } else if (type === 'monet') {
      setMonetForm({ topic: "AI and Automation", reach: "50K-100K", audience: "Tech professionals, 25-40 years", platform: "YouTube" });
    } else {
      setComments("This is amazing! Thanks for the tutorial\nPlease make part 2\nThe link doesn't work for me\nBUY CHEAP FOLLOWERS NOW!!!\nThis is garbage\nVery helpful, subscribed!");
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-0">
      {/* Promotional Timing */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Promotional Timing Advisor
          </h3>
          <button onClick={() => loadExample('promo')} className="text-xs text-primary hover:text-primary/80">Load Example</button>
        </div>
        <div className="card-surface p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input value={promoForm.contentDescription} onChange={(e) => setPromoForm({...promoForm, contentDescription: e.target.value})} placeholder="Content description (e.g., Tech review video)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input value={promoForm.brand} onChange={(e) => setPromoForm({...promoForm, brand: e.target.value})} placeholder="Product/brand name" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input value={promoForm.length} onChange={(e) => setPromoForm({...promoForm, length: e.target.value})} placeholder="Length (minutes)" type="number" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
          </div>
          <button onClick={handlePromoAnalysis} disabled={promoLoading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
            {promoLoading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Sparkles className="w-4 h-4" />Analyze Timing</>}
          </button>
        </div>
        {promoResult && (
          <div className="card-surface p-5 animate-fade-in space-y-4">
            <h4 className="font-heading text-sm font-bold text-foreground">Recommended Placements</h4>
            {promoResult.placements?.map((p: any, i: number) => (
              <div key={i} className="p-4 rounded-lg bg-secondary border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-primary">{p.timestamp}</span>
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{p.type}</span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">{p.reason}</p>
                <div className="p-2 rounded bg-surface-input border border-border">
                  <p className="text-xs text-foreground italic">"{p.example}"</p>
                </div>
              </div>
            ))}
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <h5 className="text-sm font-bold text-foreground mb-2">Risk Assessment</h5>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-xs text-muted-foreground">Intrusiveness</p><p className="text-lg font-bold text-primary">{promoResult.riskScore?.intrusiveness}%</p></div>
                <div><p className="text-xs text-muted-foreground">Retention Risk</p><p className="text-lg font-bold text-green-500">{promoResult.riskScore?.retentionRisk}</p></div>
                <div><p className="text-xs text-muted-foreground">Authenticity</p><p className="text-lg font-bold text-primary">{promoResult.riskScore?.authenticityScore}</p></div>
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-border" />

      {/* Monetization Predictor */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Monetization Predictor
          </h3>
          <button onClick={() => loadExample('monet')} className="text-xs text-primary hover:text-primary/80">Load Example</button>
        </div>
        <div className="card-surface p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input value={monetForm.topic} onChange={(e) => setMonetForm({...monetForm, topic: e.target.value})} placeholder="Topic (e.g., AI tools)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input value={monetForm.reach} onChange={(e) => setMonetForm({...monetForm, reach: e.target.value})} placeholder="Monthly reach (e.g., 50K)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <input value={monetForm.audience} onChange={(e) => setMonetForm({...monetForm, audience: e.target.value})} placeholder="Audience (e.g., 18-35 males, India)" className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all" />
            <select value={monetForm.platform} onChange={(e) => setMonetForm({...monetForm, platform: e.target.value})} className="px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground text-sm focus:outline-none input-glow transition-all">
              <option>YouTube</option><option>Instagram</option><option>LinkedIn</option><option>TikTok</option><option>X (Twitter)</option>
            </select>
          </div>
          <button onClick={handleMonetPrediction} disabled={monetLoading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
            {monetLoading ? <span className="dot-bounce"><span /><span /><span /></span> : <><TrendingUp className="w-4 h-4" />Predict Earnings</>}
          </button>
        </div>
        {monetResult && (
          <div className="space-y-4 animate-fade-in">
            <div className="card-surface p-5">
              <h4 className="font-heading text-sm font-bold text-foreground mb-3">Estimated Monthly Earnings</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-lg bg-secondary"><p className="text-xs text-muted-foreground mb-1">Ad Revenue</p><p className="text-sm font-bold text-primary">${monetResult.monthlyEarnings?.adRevenue?.min}-${monetResult.monthlyEarnings?.adRevenue?.max}</p></div>
                <div className="p-3 rounded-lg bg-secondary"><p className="text-xs text-muted-foreground mb-1">Affiliate</p><p className="text-sm font-bold text-primary">${monetResult.monthlyEarnings?.affiliateRevenue?.min}-${monetResult.monthlyEarnings?.affiliateRevenue?.max}</p></div>
                <div className="p-3 rounded-lg bg-secondary"><p className="text-xs text-muted-foreground mb-1">Brand Deals</p><p className="text-sm font-bold text-primary">${monetResult.monthlyEarnings?.brandDeals?.min}-${monetResult.monthlyEarnings?.brandDeals?.max}</p></div>
                <div className="p-3 rounded-lg bg-primary/10 border border-primary"><p className="text-xs text-muted-foreground mb-1">Total</p><p className="text-sm font-bold text-primary">${monetResult.monthlyEarnings?.total?.min}-${monetResult.monthlyEarnings?.total?.max}</p></div>
              </div>
            </div>
            <div className="card-surface p-5">
              <h4 className="font-heading text-sm font-bold text-foreground mb-3">Brand Suggestions</h4>
              <div className="space-y-2">
                {monetResult.brandSuggestions?.map((brand: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                    <div><p className="text-sm font-medium text-foreground">{brand.name}</p><p className="text-xs text-muted-foreground">{brand.avgDeal}</p></div>
                    <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">{brand.fit}% fit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      <div className="h-px bg-border" />

      {/* Comment Sentiment */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            Comment Sentiment & Moderation
          </h3>
          <button onClick={() => loadExample('comment')} className="text-xs text-primary hover:text-primary/80">Load Example</button>
        </div>
        <div className="card-surface p-5 space-y-4">
          <textarea value={comments} onChange={(e) => setComments(e.target.value)} placeholder="Paste comments (one per line)..." rows={6} className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none" />
          <button onClick={handleCommentAnalysis} disabled={commentLoading} className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center gap-2">
            {commentLoading ? <span className="dot-bounce"><span /><span /><span /></span> : <><MessageSquare className="w-4 h-4" />Analyze Comments</>}
          </button>
        </div>
        {commentResult && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-3 gap-3">
              <div className="card-surface p-4"><p className="text-xs text-muted-foreground mb-2">Positive</p><div className="h-2 bg-secondary rounded-full overflow-hidden mb-1"><div className="h-full rounded-full bg-green-500" style={{width: `${commentResult.sentimentBreakdown?.positive}%`}} /></div><p className="font-heading text-lg font-extrabold text-green-500">{commentResult.sentimentBreakdown?.positive}%</p></div>
              <div className="card-surface p-4"><p className="text-xs text-muted-foreground mb-2">Neutral</p><div className="h-2 bg-secondary rounded-full overflow-hidden mb-1"><div className="h-full rounded-full bg-blue-500" style={{width: `${commentResult.sentimentBreakdown?.neutral}%`}} /></div><p className="font-heading text-lg font-extrabold text-blue-500">{commentResult.sentimentBreakdown?.neutral}%</p></div>
              <div className="card-surface p-4"><p className="text-xs text-muted-foreground mb-2">Negative</p><div className="h-2 bg-secondary rounded-full overflow-hidden mb-1"><div className="h-full rounded-full bg-red-500" style={{width: `${commentResult.sentimentBreakdown?.negative}%`}} /></div><p className="font-heading text-lg font-extrabold text-red-500">{commentResult.sentimentBreakdown?.negative}%</p></div>
            </div>
            {commentResult.flaggedComments?.length > 0 && (
              <div className="card-surface p-5 space-y-2">
                <h4 className="font-heading text-sm font-bold text-foreground mb-2">Flagged Comments</h4>
                {commentResult.flaggedComments.map((fc: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-start gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive text-[10px] font-bold uppercase flex-shrink-0">{fc.reason}</span>
                    <p className="text-sm text-foreground">"{fc.comment}"</p>
                  </div>
                ))}
              </div>
            )}
            {commentResult.suggestedReplies?.length > 0 && (
              <div className="card-surface p-5 space-y-3">
                <h4 className="font-heading text-sm font-bold text-foreground">AI Suggested Replies</h4>
                {commentResult.suggestedReplies.map((sr: any, i: number) => (
                  <div key={i} className="p-3 rounded-lg bg-secondary border border-border">
                    <p className="text-xs text-muted-foreground mb-2">Comment: "{sr.comment}"</p>
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm text-foreground flex-1">"{sr.reply}"</p>
                      <button onClick={() => copyReply(sr.reply)} className="p-1 text-muted-foreground hover:text-foreground transition-colors">
                        {copiedReply === sr.reply ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {commentResult.engagementInsights && (
              <div className="card-surface p-5">
                <h4 className="font-heading text-sm font-bold text-foreground mb-3">Engagement Insights</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Best performing type:</span> <span className="text-primary font-medium">{commentResult.engagementInsights.bestPerformingType}</span></p>
                  <p><span className="text-muted-foreground">Best trigger:</span> <span className="text-primary font-medium">{commentResult.engagementInsights.bestTrigger}</span></p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commentResult.engagementInsights.audienceInterest?.map((interest: string, i: number) => (
                      <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{interest}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default MonetizationEngagement;
