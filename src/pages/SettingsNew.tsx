import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, Lock, Palette, Eye, EyeOff } from "lucide-react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  
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
    applyTheme();
  }, [preferences.theme]);

  const applyTheme = () => {
    const root = document.documentElement;
    
    if (preferences.theme === 'light') {
      root.style.backgroundColor = '#ffffff';
      root.style.color = '#000000';
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#000000';
    } else {
      root.style.backgroundColor = '#0a0a0a';
      root.style.color = '#ffffff';
      document.body.style.backgroundColor = '#0a0a0a';
      document.body.style.color = '#ffffff';
    }
  };

  const loadSettings = async () => {
    if (!user) return;
    try {
      const settingsRef = doc(db, "settings", user.uid);
      const settingsDoc = await getDoc(settingsRef);
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (data.notifications) setNotifications(data.notifications);
        if (data.preferences) setPreferences(data.preferences);
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

  const changePassword = async () => {
    if (!user?.email) return;
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, passwordData.newPassword);
      
      toast({
        title: "Password changed!",
        description: "Your password has been updated successfully.",
      });
      setShowPasswordModal(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.code === "auth/wrong-password" 
          ? "Current password is incorrect" 
          : "Failed to change password",
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
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <div className="card-surface p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bell className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground">Notifications</h3>
            <p className="text-sm text-muted-foreground">Configure notification preferences</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 cursor-pointer">
              <div>
                <p className="font-medium text-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
              </div>
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                className="w-5 h-5 text-primary rounded"
              />
            </label>
          ))}
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
              onChange={(e) => {
                setPreferences({ ...preferences, theme: e.target.value });
                toast({ title: `Theme changed to ${e.target.value}` });
              }}
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
              onChange={(e) => {
                setPreferences({ ...preferences, language: e.target.value });
                toast({ title: `Language changed to ${e.target.options[e.target.selectedIndex].text}` });
              }}
              className="w-full px-4 py-2 rounded-lg bg-surface-input border border-border text-foreground"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="hi">हिन्दी</option>
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
            <p className="text-sm text-muted-foreground">Manage account settings</p>
          </div>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-full px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-medium text-left transition-all"
          >
            Change Password
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

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="card-surface p-6 max-w-md w-full space-y-4">
            <h3 className="text-xl font-heading font-bold text-foreground">Change Password</h3>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Current Password</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-surface-input border border-border text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">New Password</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-surface-input border border-border text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 pr-10 rounded-lg bg-surface-input border border-border text-foreground"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
                }}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary text-foreground font-medium"
              >
                Cancel
              </button>
              <button
                onClick={changePassword}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
