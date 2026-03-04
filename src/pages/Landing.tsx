import { useNavigate } from "react-router-dom";
import { Sparkles, BarChart3, Palette, Shield, TrendingUp, DollarSign, Zap } from "lucide-react";
import heroDashboard from "@/assets/hero-dashboard.jpg";
import SplineRobot from "@/components/SplineRobot";

const features = [
  { icon: BarChart3, title: "Content Analyzer", desc: "Get instant AI-powered scores on engagement, clarity, and hook strength for any post." },
  { icon: Palette, title: "Content Studio", desc: "Generate platform-native content, hooks, and thumbnails from a single idea." },
  { icon: Shield, title: "Safety & Copyright", desc: "Scan content for copyright risks and get proof of originality instantly." },
  { icon: TrendingUp, title: "Trend Intelligence", desc: "Discover trending hashtags, viral ideas, and optimal posting times." },
  { icon: DollarSign, title: "Monetization", desc: "Predict earnings, find brand matches, and optimize your revenue strategy." },
  { icon: Zap, title: "Smart Calendar", desc: "AI-generated 7-day content plans tailored to your niche and audience." },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <img src={heroDashboard} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />
        </div>

        {/* Floating orbs */}
        <div className="orb orb-green w-72 h-72 top-[20%] left-[5%]" />
        <div className="orb orb-blue w-48 h-48 bottom-[20%] right-[20%]" style={{ animationDelay: "3s" }} />

        {/* Nav */}
        <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            <span className="font-heading text-lg font-bold text-foreground">Creator Copilot</span>
          </div>
          <button
            onClick={() => navigate("/auth?tab=signin")}
            className="px-5 py-2 rounded-lg bg-secondary border border-border text-sm font-medium text-foreground hover:border-primary/50 transition-all"
          >
            Sign In
          </button>
        </nav>

        {/* Hero content with robot */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between gap-12">
          {/* Left content */}
          <div className="flex-1 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary">AI-Powered Content Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground mb-5 leading-[1.1] tracking-tight">
              Your AI-powered<br />content team
            </h1>
            <p className="text-muted-foreground text-lg max-w-lg mb-8 leading-relaxed">
              Plan, analyze, create, and monetize your content — all from one intelligent dashboard built for modern creators.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <button
                onClick={() => navigate("/auth?tab=signup")}
                className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-primary/20"
              >
                Get Started Free →
              </button>
              <button
                onClick={() => navigate("/auth?tab=signin")}
                className="px-8 py-3.5 rounded-lg bg-secondary text-foreground font-medium text-sm border border-border hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Right robot */}
          <div className="hidden lg:block flex-shrink-0 w-[500px] h-[600px]">
            <SplineRobot />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Everything you need to grow</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">Six powerful tools working together so you can focus on creating, not managing.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title} className="card-surface p-6 hover:-translate-y-1 transition-transform duration-200 group">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-5 h-5" />
                </div>
                <h3 className="font-heading text-base font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-2xl mx-auto text-center card-surface p-12">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-3">Ready to create smarter?</h2>
          <p className="text-muted-foreground mb-6">Join thousands of creators using AI to plan, analyze, and monetize their content.</p>
          <button
            onClick={() => navigate("/auth?tab=signup")}
            className="px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-primary/20"
          >
            Get Started Free →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
