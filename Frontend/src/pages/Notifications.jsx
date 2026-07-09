import { useState, useEffect } from "react";

const token = localStorage.getItem("token");

const formatTimeAgo = (dateStr) => {
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return then.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      const response = await fetch("https://localhost:7010/api/notification", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error("Network or parse error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    // optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );

    try {
      const response = await fetch(
        `https://localhost:7010/api/notification/${id}/read`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        // revert on failure
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
        );
      }
    } catch (error) {
      console.error("Network or parse error:", error);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: false } : n)),
      );
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-[14px] font-sans antialiased">
      <div className="mx-auto max-w-[600px]">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[20px] font-medium text-[#1E2A38]">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <span className="text-[11px] font-medium text-[#06B6D4] bg-[#ECFEFF] px-[10px] py-[4px] rounded-full">
              {unreadCount} unread
            </span>
          )}
        </div>

        {loading && (
          <p className="text-[13px] text-[#94A3B8] text-center py-[40px]">
            Loading notifications...
          </p>
        )}

        {!loading && notifications.length === 0 && (
          <p className="text-[13px] text-[#94A3B8] text-center py-[40px]">
            No notifications yet.
          </p>
        )}

        <div className="flex flex-col gap-[6px]">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => !n.isRead && markAsRead(n.id)}
              className={`flex items-start gap-3 rounded-[8px] border-[0.5px] px-[16px] py-[12px] transition-colors duration-150 ${
                n.isRead
                  ? "bg-white border-[#E2E8F0]"
                  : "bg-[#ECFEFF] border-[#06B6D4] cursor-pointer hover:bg-[#CFFAFE]"
              }`}
            >
              {!n.isRead && (
                <span className="mt-[6px] w-[6px] h-[6px] rounded-full bg-[#06B6D4] flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p
                  className={`text-[13px] leading-relaxed ${
                    n.isRead ? "text-[#475569]" : "text-[#2D3E52] font-medium"
                  }`}
                >
                  {n.message}
                </p>
                <span className="text-[11px] text-[#94A3B8] mt-[4px] block">
                  {formatTimeAgo(n.sentAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
