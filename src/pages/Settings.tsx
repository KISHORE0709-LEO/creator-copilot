import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Lock, Palette, Globe, Zap } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { user, userProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    scheduleReminders: true,
    trendAlerts: true,
    engagementUpdates: false,
    weeklyReport: true,
  });

  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    timezone: "Asia/Kolkata",
  });

  useEffect(() => {
    loadSettings();
  }, [user]);

  useEffect(() => {
    // Apply theme dynamically
    document.documentElement.classList.remove('light', 'dark');
    if (preferences.theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    } else {
      document.documentElement.classList.add(preferences.theme);
    }
  }, [preferences.theme]);

  const loadSettings = async () => {
    if (!user) return;
    try {
      const settingsRef = doc(db, "settings", user.uid);
      const settingsDoc = await getDoc(settingsRef);
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        setNotifications(data.notifications || notifications);
        setPreferences(data.preferences || preferences);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const saveSettings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const settingsRef = doc(db, "settings", user.uid);
      await setDoc(settingsRef, {
        notifications,
        preferences,
        updatedAt: new Date().toISOString(),
      });
      toast({
        title: "Settings saved!",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences and notifications</p>
      </div>

      {/* Notifications */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure your notification preferences</p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
            <div>
              <p className="font-medium text-foreground">Schedule Reminders</p>
              <p className="text-sm text-muted-foreground">Get notified about scheduled posts</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.scheduleReminders}
              onChange={(e) => setNotifications({ ...notifications, scheduleReminders: e.target.checked })}
              className="w-5 h-5 text-primary rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
            <div>
              <p className="font-medium text-foreground">Trend Alerts</p>
              <p className="text-sm text-muted-foreground">Notify when new trends emerge</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.trendAlerts}
              onChange={(e) => setNotifications({ ...notifications, trendAlerts: e.target.checked })}
              className="w-5 h-5 text-primary rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
            <div>
              <p className="font-medium text-foreground">Engagement Updates</p>
              <p className="text-sm text-muted-foreground">Daily engagement statistics</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.engagementUpdates}
              onChange={(e) => setNotifications({ ...notifications, engagementUpdates: e.target.checked })}
              className="w-5 h-5 text-primary rounded"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
            <div>
              <p className="font-medium text-foreground">Weekly Report</p>
              <p className="text-sm text-muted-foreground">Summary of your content performance</p>
            </div>
            <input
              type="checkbox"
              checked={notifications.weeklyReport}
              onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
              className="w-5 h-5 text-primary rounded"
            />
          </label>
        </div>
      </div>

      {/* Preferences */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Palette className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">Preferences</h3>
            <p className="text-sm text-muted-foreground">Customize your experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Theme</label>
            <select
              value={preferences.theme}
              onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-surface-input border border-border text-foreground"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="auto">Auto</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Language</label>
            <select
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-surface-input border border-border text-foreground"
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-surface-input border border-border text-foreground"
            >
              <option value="Asia/Kolkata">India (IST)</option>
              <option value="America/New_York">US Eastern</option>
              <option value="America/Los_Angeles">US Pacific</option>
              <option value="Europe/London">UK</option>
            </select>
          </div>
        </div>
      </div>

      {/* Account */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-500/10 rounded-lg">
            <Lock className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">Account</h3>
            <p className="text-sm text-muted-foreground">Manage your account settings</p>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-left transition-all">
            Change Password
          </button>
          <button className="w-full px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-left transition-all">
            Export Data
          </button>
          <button className="w-full px-4 py-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium text-left transition-all">
            Delete Account
          </button>
        </div>
      </div>

      <button 
        onClick={saveSettings}
        disabled={loading}
        className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:opacity-90 transition-all disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default Settings;
