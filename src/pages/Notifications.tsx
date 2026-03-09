import { useState, useEffect } from "react";
import { Bell, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface Notification {
  id: string;
  type: "schedule" | "trend" | "engagement";
  title: string;
  message: string;
  time: string;
  read: boolean;
  data?: any;
}

const Notifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    loadNotifications();
    // Refresh every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      // Load scheduled posts from Firestore
      const schedulesRef = collection(db, "schedules");
      const q = query(
        schedulesRef,
        where("userId", "==", user.uid),
        orderBy("scheduledDate", "desc")
      );
      
      const snapshot = await getDocs(q);
      const scheduleNotifications: Notification[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        const scheduledDate = new Date(data.scheduledDate);
        const now = new Date();
        const isUpcoming = scheduledDate > now;
        const timeDiff = Math.abs(scheduledDate.getTime() - now.getTime());
        const hoursUntil = Math.floor(timeDiff / (1000 * 60 * 60));

        return {
          id: doc.id,
          type: "schedule",
          title: `Scheduled Post: ${data.platform}`,
          message: isUpcoming
            ? `Post scheduled in ${hoursUntil} hours - "${data.content?.substring(0, 50)}..."`
            : `Post was scheduled ${hoursUntil} hours ago`,
          time: scheduledDate.toLocaleString(),
          read: !isUpcoming,
          data: data,
        };
      });

      setNotifications(scheduleNotifications);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === "unread" 
    ? notifications.filter(n => !n.read) 
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case "schedule":
        return <Calendar className="w-5 h-5 text-blue-500" />;
      case "trend":
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case "engagement":
        return <CheckCircle className="w-5 h-5 text-purple-500" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === "unread" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => setNotifications(notifications.map(n => ({ ...n, read: true })))}
              className="px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary/20 transition-all"
            >
              Mark all read
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="card-surface p-12 text-center">
          <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-foreground mb-2">No notifications yet</h3>
          <p className="text-muted-foreground">
            Schedule posts in Trends & Calendar to get reminders here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              onClick={() => markAsRead(notification.id)}
              className={`card-surface p-4 cursor-pointer transition-all hover:scale-[1.01] ${
                !notification.read ? 'border-l-4 border-primary' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${!notification.read ? 'bg-primary/10' : 'bg-secondary'}`}>
                  {getIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`font-bold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {notification.title}
                    </h4>
                    {!notification.read && (
                      <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{notification.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
