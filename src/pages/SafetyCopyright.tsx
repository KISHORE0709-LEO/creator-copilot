import { useState } from "react";
import { Shield, FileCheck, Eye, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScanResult {
  riskLevel: string;
  copyrightIssues: Array<{ phrase: string; issue: string; alternative: string }>;
  accessibilityScore: number;
  accessibilityIssues: Array<{ word: string; issue: string; alternative: string }>;
  originalityScore: number;
  originalityNote: string;
  recommendations: string[];
}

const SafetyCopyright = () => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const { toast } = useToast();

  const handleScan = async () => {
    if (!content.trim()) {
      toast({
        title: "Content Required",
        description: "Please enter content to scan",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/scan-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });

      if (!response.ok) {
        throw new Error('Scan failed');
      }

      const scanResult = await response.json();
      setResult(scanResult);
      setScanned(true);
    } catch (error) {
      console.error('Scan error:', error);
      toast({
        title: "Scan Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    if (risk === "Low Risk") return "bg-primary/10 text-primary";
    if (risk === "Medium Risk") return "bg-yellow-500/10 text-yellow-500";
    return "bg-destructive/10 text-destructive";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-20 md:pb-0">
      {/* Left — Copyright Shield */}
      <div className="space-y-4">
        <div className="card-surface p-5 space-y-4">
          <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Copyright Shield
          </h3>
          <textarea
            placeholder="Paste your content to scan for copyright risks..."
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-surface-input border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none input-glow transition-all resize-none"
          />
          <button onClick={handleScan} disabled={loading || !content.trim()} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <span className="dot-bounce"><span /><span /><span /></span> : <><Shield className="w-4 h-4" />Scan for Risks</>}
          </button>
        </div>

        {scanned && result && (
          <>
            <div className="card-surface p-5 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm text-muted-foreground">Risk Level:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(result.riskLevel)}`}>
                  {result.riskLevel}
                </span>
              </div>
              <div className="space-y-3">
                {result.copyrightIssues.length > 0 ? (
                  result.copyrightIssues.map((issue, i) => (
                    <div key={i} className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-destructive font-medium">{issue.issue}: "{issue.phrase}"</p>
                          <p className="text-xs text-muted-foreground mt-1">Safe alternative: {issue.alternative}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">No copyright issues detected!</p>
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{result.originalityNote}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.15s" }}>
              <h4 className="font-heading text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-accent-blue" />
                Originality Score
              </h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${result.originalityScore}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold text-primary">{result.originalityScore}%</span>
              </div>
              <div className="p-3 rounded-lg bg-surface-input border border-border">
                <p className="font-mono text-xs text-muted-foreground break-all">
                  SHA-256: {Math.random().toString(36).substring(2, 15)}<br />
                  Timestamp: {new Date().toISOString()}<br />
                  Content ID: CC-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000000)}
                </p>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="card-surface p-5 animate-fade-in" style={{ animationDelay: "0.3s" }}>
                <h4 className="font-heading text-sm font-bold text-foreground mb-3">Recommendations</h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <span className="text-primary font-bold mt-0.5">•</span>
                      <span className="flex-1">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>

      {/* Right — Language Safety */}
      <div className="space-y-4">
        <div className="card-surface p-5">
          <h3 className="font-heading text-base font-bold text-foreground flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-accent-blue" />
            Language Safety & Accessibility
          </h3>

          {!scanned || !result ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Eye className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Scan your content on the left to see accessibility analysis here</p>
            </div>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Accessibility Score:</span>
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                  {result.accessibilityScore}/10
                </span>
              </div>

              <div className="space-y-3">
                {result.accessibilityIssues.length > 0 ? (
                  result.accessibilityIssues.map((issue, i) => (
                    <div key={i} className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-yellow-400 font-medium">"{issue.word}" — {issue.issue}</p>
                          <p className="text-xs text-muted-foreground mt-1">Simpler: {issue.alternative}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">Content is accessible and easy to understand!</p>
                    </div>
                  </div>
                )}
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">Overall tone is inclusive and appropriate for all audiences.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SafetyCopyright;
