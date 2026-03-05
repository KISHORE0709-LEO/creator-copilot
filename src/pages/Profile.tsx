import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { logOut, updateUserProfile, uploadAvatar, updateSocialLinks, updatePlatformStatus, UserProfile } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { defaultAvatars, systemAvatars, generateInitialsAvatar, getDefaultAvatarForGender } from "@/lib/avatars";
import { 
  User, Mail, Calendar, Crown, BarChart3, LogOut, Edit, Save, X, Upload, 
  Instagram, Youtube, Twitter, Linkedin, Music, Facebook, ExternalLink,
  Users, TrendingUp, Heart, Eye, Camera
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Profile = () => {
  const { user, userProfile, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userProfile?.displayName || "");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile?.photoURL || "");
  const [chartPeriod, setChartPeriod] = useState<"7days" | "6months">("7days");
  const [socialLinks, setSocialLinks] = useState<UserProfile['socialLinks']>({
    instagram: "",
    youtube: "",
    twitter: "",
    linkedin: "",
    tiktok: "",
    facebook: ""
  });
  const [platformStatus, setPlatformStatus] = useState<UserProfile['platformStatus']>({
    instagram: { active: false, followers: 0 },
    youtube: { active: false, followers: 0 },
    twitter: { active: false, followers: 0 },
    linkedin: { active: false, followers: 0 },
    tiktok: { active: false, followers: 0 },
    facebook: { active: false, followers: 0 }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Load user data when profile is available
  useEffect(() => {
    if (userProfile) {
      setEditedName(userProfile.displayName);
      setSelectedAvatar(userProfile.photoURL || getDefaultAvatarForGender(userProfile.gender).url);
      setSocialLinks(userProfile.socialLinks || {
        instagram: "",
        youtube: "",
        twitter: "",
        linkedin: "",
        tiktok: "",
        facebook: ""
      });
      setPlatformStatus(userProfile.platformStatus || {
        instagram: { active: false, followers: 0 },
        youtube: { active: false, followers: 0 },
        twitter: { active: false, followers: 0 },
        linkedin: { active: false, followers: 0 },
        tiktok: { active: false, followers: 0 },
        facebook: { active: false, followers: 0 }
      });
    }
  }, [userProfile]);

  // Mock data for performance charts
  const performanceData7Days = [
    { day: 'Mon', likes: 45, followers: 1250 },
    { day: 'Tue', likes: 52, followers: 1265 },
    { day: 'Wed', likes: 48, followers: 1280 },
    { day: 'Thu', likes: 61, followers: 1295 },
    { day: 'Fri', likes: 55, followers: 1310 },
    { day: 'Sat', likes: 67, followers: 1325 },
    { day: 'Sun', likes: 59, followers: 1340 }
  ];

  const performanceData6Months = [
    { month: 'Jan', likes: 45, followers: 1100 },
    { month: 'Feb', likes: 52, followers: 1150 },
    { month: 'Mar', likes: 48, followers: 1200 },
    { month: 'Apr', likes: 61, followers: 1250 },
    { month: 'May', likes: 55, followers: 1300 },
    { month: 'Jun', likes: 67, followers: 1340 }
  ];

  const currentData = chartPeriod === "7days" ? performanceData7Days : performanceData6Months;

  const platformIcons = {
    instagram: Instagram,
    youtube: Youtube,
    twitter: Twitter,
    linkedin: Linkedin,
    tiktok: Music,
    facebook: Facebook
  };

  const platformColors = {
    instagram: "text-pink-500",
    youtube: "text-red-500", 
    twitter: "text-blue-500",
    linkedin: "text-blue-600",
    tiktok: "text-black dark:text-white",
    facebook: "text-blue-700"
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

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { displayName: editedName });
      await refreshProfile();
      setIsEditing(false);
      toast({ title: "Profile updated successfully" });
    } catch (error) {
      toast({ title: "Error updating profile", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateUserProfile(user.uid, { photoURL: avatarUrl });
      setSelectedAvatar(avatarUrl);
      setShowAvatarModal(false);
      await refreshProfile();
      toast({ title: "Avatar updated successfully" });
    } catch (error) {
      toast({ title: "Error updating avatar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) return;
    
    setLoading(true);
    try {
      const downloadURL = await uploadAvatar(user.uid, file);
      setSelectedAvatar(downloadURL);
      setShowAvatarModal(false);
      await refreshProfile();
      toast({ title: "Avatar uploaded successfully" });
    } catch (error) {
      toast({ title: "Error uploading avatar", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLinkSave = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateSocialLinks(user.uid, socialLinks);
      await refreshProfile();
      toast({ title: "Social links updated successfully" });
    } catch (error) {
      toast({ title: "Error updating social links", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const togglePlatformStatus = async (platform: keyof typeof platformStatus) => {
    if (!user) return;
    
    const newStatus = {
      ...platformStatus,
      [platform]: {
        ...platformStatus[platform],
        active: !platformStatus[platform].active
      }
    };
    
    setPlatformStatus(newStatus);
    
    try {
      await updatePlatformStatus(user.uid, newStatus);
      await refreshProfile();
    } catch (error) {
      toast({ title: "Error updating platform status", variant: "destructive" });
      // Revert the change on error
      setPlatformStatus(platformStatus);
    }
  };

  const updateFollowerCount = async (platform: keyof typeof platformStatus, followers: number) => {
    if (!user) return;
    
    const newStatus = {
      ...platformStatus,
      [platform]: {
        ...platformStatus[platform],
        followers
      }
    };
    
    setPlatformStatus(newStatus);
    
    try {
      await updatePlatformStatus(user.uid, newStatus);
      await refreshProfile();
    } catch (error) {
      toast({ title: "Error updating follower count", variant: "destructive" });
    }
  };

  const getTotalFollowers = () => {
    return Object.values(platformStatus).reduce((total, platform) => 
      total + (platform.active ? platform.followers : 0), 0
    );
  };

  const getAvgEngagementRate = () => {
    // Mock calculation - in real app this would be based on actual data
    const activeFollowers = getTotalFollowers();
    const avgLikes = currentData.reduce((sum, day) => sum + day.likes, 0) / currentData.length;
    return activeFollowers > 0 ? ((avgLikes / activeFollowers) * 100).toFixed(1) : "0.0";
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getSubscriptionColor = (subscription: string) => {
    switch (subscription) {
      case "pro":
        return "bg-primary/10 text-primary border-primary/20";
      case "premium":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  if (!user || !userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="card-surface p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            {selectedAvatar || userProfile.photoURL ? (
              <img
                src={selectedAvatar || userProfile.photoURL}
                alt={userProfile.displayName}
                className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border-4 border-primary/20">
                <span className="text-2xl font-bold text-primary">
                  {getInitials(userProfile.displayName)}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowAvatarModal(true)}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-primary rounded-full border-2 border-background flex items-center justify-center hover:bg-primary/80 transition-colors"
            >
              <Camera className="w-4 h-4 text-primary-foreground" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="text-2xl font-bold bg-surface-input border border-border rounded-lg px-3 py-1 text-foreground"
                  />
                  <button
                    onClick={handleSaveProfile}
                    className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(userProfile.displayName);
                    }}
                    className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-foreground">{userProfile.displayName}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Mail className="w-4 h-4" />
              <span>{user.email}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className={`px-3 py-1 rounded-full border text-sm font-medium capitalize ${getSubscriptionColor(userProfile.subscription)}`}>
                <Crown className="w-3 h-3 inline mr-1" />
                {userProfile.subscription} Plan
              </span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Joined {formatDate(userProfile.createdAt)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{userProfile.contentCount}</p>
              <p className="text-sm text-muted-foreground">Content Analyzed</p>
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">Active</p>
              <p className="text-sm text-muted-foreground">Account Status</p>
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Crown className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground capitalize">{userProfile.subscription}</p>
              <p className="text-sm text-muted-foreground">Subscription</p>
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{getTotalFollowers().toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Total Followers</p>
            </div>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{getAvgEngagementRate()}%</p>
              <p className="text-sm text-muted-foreground">Avg Engagement</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Links Section */}
      <div className="card-surface p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Social Media Links</h2>
          <button
            onClick={handleSocialLinkSave}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/80 transition-colors text-sm font-medium"
          >
            Save Links
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(socialLinks).map(([platform, link]) => {
            const Icon = platformIcons[platform as keyof typeof platformIcons];
            const isActive = platformStatus[platform as keyof typeof platformStatus].active;
            const followers = platformStatus[platform as keyof typeof platformStatus].followers;
            
            return (
              <div key={platform} className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${platformColors[platform as keyof typeof platformColors]}`} />
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                </div>
                
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder={`@${platform}username`}
                    value={link}
                    onChange={(e) => setSocialLinks(prev => ({ ...prev, [platform]: e.target.value }))}
                    className="w-full bg-surface-input border border-border rounded-md px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <input
                      type="number"
                      placeholder="Followers"
                      value={followers}
                      onChange={(e) => updateFollowerCount(platform as keyof typeof platformStatus, parseInt(e.target.value) || 0)}
                      className="w-24 bg-surface-input border border-border rounded-md px-2 py-1 text-xs text-foreground"
                    />
                    <button
                      onClick={() => togglePlatformStatus(platform as keyof typeof platformStatus)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        isActive 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : 'bg-gray-500/10 text-gray-500 border border-gray-500/20'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>
                
                {link && (
                  <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Graph Section */}
      <div className="card-surface p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-foreground">Performance Analytics</h2>
          <div className="flex bg-secondary rounded-lg p-1">
            <button
              onClick={() => setChartPeriod("7days")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartPeriod === "7days" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartPeriod("6months")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                chartPeriod === "6months" 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              6 Months
            </button>
          </div>
        </div>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={currentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey={chartPeriod === "7days" ? "day" : "month"} 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))"
                }}
              />
              <Line 
                type="monotone" 
                dataKey="likes" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name="Likes"
              />
              <Line 
                type="monotone" 
                dataKey="followers" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                name="Followers"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Account Information */}
      <div className="card-surface p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Email Address</label>
            <p className="text-foreground">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Account Created</label>
            <p className="text-foreground">{formatDate(userProfile.createdAt)}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">User ID</label>
            <p className="text-foreground font-mono text-sm">{user.uid}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Last Sign In</label>
            <p className="text-foreground">
              {user.metadata.lastSignInTime 
                ? formatDate(user.metadata.lastSignInTime) 
                : "Never"}
            </p>
          </div>
        </div>
      </div>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAvatarModal(false)} />
          <div className="relative bg-card border border-border rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-foreground">Choose Avatar</h3>
              <button
                onClick={() => setShowAvatarModal(false)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {/* Upload Custom Avatar */}
              <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">Upload your own image</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="avatar-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                />
                <label
                  htmlFor="avatar-upload"
                  className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-lg cursor-pointer hover:bg-primary/80 transition-colors text-sm font-medium"
                >
                  Choose File
                </label>
              </div>
              
              {/* Default Avatars */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Or choose from defaults:</p>
                
                {/* Gender Selection */}
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">System Avatars:</p>
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleAvatarSelect(systemAvatars.male.url)}
                      className="relative group"
                    >
                      <img
                        src={systemAvatars.male.url}
                        alt="Male Avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                      />
                    </button>
                    <button
                      onClick={() => handleAvatarSelect(systemAvatars.female.url)}
                      className="relative group"
                    >
                      <img
                        src={systemAvatars.female.url}
                        alt="Female Avatar"
                        className="w-12 h-12 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                      />
                    </button>
                  </div>
                </div>
                
                {/* Photo Avatars */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Photo Avatars:</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[...defaultAvatars.male, ...defaultAvatars.female].map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => handleAvatarSelect(avatar.url)}
                        className="relative group"
                      >
                        <img
                          src={avatar.url}
                          alt={avatar.name}
                          className="w-16 h-16 rounded-full object-cover border-2 border-border group-hover:border-primary transition-colors"
                        />
                        <div className="absolute inset-0 bg-primary/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-4 h-4 bg-primary rounded-full"></div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;