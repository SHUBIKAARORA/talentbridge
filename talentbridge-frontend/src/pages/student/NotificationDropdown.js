import { getTimeAgo } from "../../utils/NotificationUtils";
import "./NotificationDropdown.css";
import axios from "axios";

function NotificationDropdown({
  notifications,
  setNotifications,
  setActiveSection,
  setSelectedJobId,
  setHighlightedApplicationId,
}) {
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const handleNotificationClick = async (n) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/${n.notificationId}/read`);
    } catch (err) {
      console.error(err);
    }
    setNotifications((prev) =>
      prev.map((item) =>
        item.notificationId === n.notificationId ? { ...item, isRead: true } : item
      )
    );
    if (n.type === "JOB_POSTED") {
      setActiveSection("jobs");
      setSelectedJobId(n.relatedId);
    }
    if (n.type === "STATUS_UPDATED") {
      setActiveSection("applications");
      setHighlightedApplicationId(n.relatedId);
    }
  };

  return (
    <div className="nd-dropdown">
      <div className="nd-header">Notifications</div>
      {sorted.length === 0 ? (
        <div className="nd-empty">No notifications yet</div>
      ) : (
        sorted.map((n) => (
          <div
            key={n.notificationId}
            className={`nd-item ${!n.isRead ? "nd-item--unread" : ""}`}
            onClick={() => handleNotificationClick(n)}
          >
            <div className="nd-item-dot" style={{ opacity: n.isRead ? 0 : 1 }} />
            <div className="nd-item-body">
              <p className="nd-message">{n.message}</p>
              <span className="nd-time">{getTimeAgo(n.createdAt)}</span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationDropdown;