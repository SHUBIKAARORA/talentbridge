import { useState, useEffect } from "react";
import axios from "axios";
import NotificationDropdown from "./NotificationDropdown";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase.js";
import "./Navbar.css";

function Navbar({ userId, setActiveSection, setSelectedJobId, setHighlightedApplicationId }) {

  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    // 1. Initial fetch from backend
    axios.get(`http://localhost:8080/api/notifications/${userId}`)
      .then(res => setNotifications(res.data))
      .catch(err => console.error(err));

    // 2. Firebase real-time listener
    const notificationsRef = ref(db, `notifications/${userId}`);

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        setNotifications(prev => {
          const existingMessages = new Set(prev.map(n => n.message));

          const newNotifications = Object.values(data).filter(
            n => !existingMessages.has(n.message)
          );

          return [...newNotifications, ...prev];
        });
      }
    });

    //3. Cleanup listener
    return () => unsubscribe();

  }, [userId]);

  return (
    <div className="navbar">

      <div className="logo"></div>

      <div className="bell-container">
        
        <span
          className="bell-icon"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          🔔
        </span>

        {unreadCount > 0 && (
          <span className="notification-dot"></span>
        )}

        {showDropdown && (
          <NotificationDropdown
            notifications={notifications}
            setNotifications={setNotifications}
            setActiveSection={setActiveSection}
            setSelectedJobId={setSelectedJobId}
            setHighlightedApplicationId={setHighlightedApplicationId}
          />
        )}
      </div>
    </div>
  );
}

export default Navbar;