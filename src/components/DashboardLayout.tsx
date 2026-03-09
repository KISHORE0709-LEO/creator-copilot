import { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { logOut } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { generateInitialsAvatar } from "@/lib/avatars";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  LayoutDashboard,
  Search,
  Palette,
  Image,
  TrendingUp,
  Shield,
  DollarSign,
  Settings,
  LogOut,
  Sparkles,
  Bell,
  ChevronLeft,
  Menu,
  User,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Content Analyzer", icon: Search, path: "/dashboard/analyzer" },
  { label: "Content Studio", icon: Palette, path: "/dashboard/studio" },
  { label: "Thumbnail Generator", icon: Image, path: "/dashboard/thumbnail" },
  { label: "Trends & Calendar", icon: TrendingUp, path: "/dashboard/trends" },
  { label: "Safety & Copyright", icon: Shield, path: "/dashboard/safety" },
  { label: "Monetization", icon: DollarSign, path: "/dashboard/monetization" },
];

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/analyzer": "Content Analyzer",
  "/dashboard/studio": "Content Studio",
  "/dashboard/thumbnail": "Thumbnail Generator",
  "/dashboard/trends": "Trends & Calendar",
  "/dashboard/safety": "Safety & Copyright",
  "/dashboard/monetization": "Monetization & Engagement",
  "/dashboard/profile": "Profile",
};

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;
  const pageTitle = pageTitles[currentPath] || "Dashboard";

  useEffect(() => {
    loadNotificationCount();
    // Refresh count every minute
    const interval = setInterval(loadNotificationCount, 60000);
    return () => clearInterval(interval);
  }, [user]);

  const loadNotificationCount = async () => {
    if (!user) return;
    try {
      const schedulesRef = collection(db, "schedules");
      const q = query(
        schedulesRef,
        where("userId", "==", user.uid),
        orderBy("scheduledDate", "desc")
      );
      const snapshot = await getDocs(q);
      const upcomingCount = snapshot.docs.filter(doc => {
        const scheduledDate = new Date(doc.data().scheduledDate);
        return scheduledDate > new Date();
      }).length;
      setNotificationCount(upcomingCount);
    } catch (error) {
      console.error("Error loading notification count:", error);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = async () => {
    try {
      await logOut();
      navigate("/");
      toast({ title: "Logged out successfully" });
    } catch (error) {
      toast({ title: "Error logging out", variant: "destructive" });
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return userProfile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    const { initials, colorClass } = generateInitialsAvatar(name);
    return { initials, colorClass };
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-primary flex-shrink-0" />
        {sidebarOpen && (
          <span className="font-heading text-lg font-extrabold text-foreground">Creator Copilot</span>
        )}
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse-green ml-auto flex-shrink-0" />
      </div>

      {/* Profile */}
      {sidebarOpen && (
        <div className="px-4 py-3 mx-3 rounded-lg bg-secondary mb-4">
          <div className="flex items-center gap-3">
            {userProfile?.photoURL ? (
              <img
                src={userProfile.photoURL}
                alt={getUserDisplayName()}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className={`w-9 h-9 rounded-full ${getUserInitials().colorClass} flex items-center justify-center text-white font-heading font-bold text-sm flex-shrink-0`}>
                {getUserInitials().initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{getUserDisplayName()}</p>
              <p className="text-xs text-muted-foreground truncate">@{getUserDisplayName().toLowerCase().replace(/\s+/g, '')}</p>
            </div>
          </div>
          <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium capitalize">
            {userProfile?.subscription || 'Free'} Plan
          </span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 space-y-1 border-t border-border pt-3 mt-3">
        <button 
          onClick={() => {
            navigate("/dashboard/profile");
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <User className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Profile</span>}
        </button>
        <button 
          onClick={() => {
            navigate("/dashboard/settings");
            setMobileOpen(false);
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Settings</span>}
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {sidebarOpen && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed top-0 left-0 h-screen bg-card border-r border-border z-30 transition-all duration-300 ${
          sidebarOpen ? "w-60" : "w-16"
        }`}
      >
        <SidebarContent />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-6 w-6 h-6 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className={`w-3 h-3 transition-transform ${!sidebarOpen ? "rotate-180" : ""}`} />
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-60 h-full bg-card border-r border-border flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-60" : "md:ml-16"}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className="md:hidden text-muted-foreground">
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-heading text-base font-bold text-foreground">{pageTitle}</h2>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-muted-foreground">
              {getGreeting()}, <span className="text-foreground font-medium">{getUserDisplayName()}</span> 👋
            </span>
            <button 
              onClick={() => navigate("/dashboard/notifications")}
              className="relative text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <>
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                </>
              )}
            </button>
            <button 
              onClick={() => navigate("/dashboard/profile")}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-primary/30 transition-colors"
            >
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={getUserDisplayName()}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className={`w-8 h-8 rounded-full ${getUserInitials().colorClass} flex items-center justify-center text-white font-heading font-bold text-xs`}>
                  {getUserInitials().initials}
                </div>
              )}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 page-transition">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex z-30">
        {navItems.slice(0, 5).map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <item.icon className="w-5 h-5 mb-0.5" />
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default DashboardLayout;
