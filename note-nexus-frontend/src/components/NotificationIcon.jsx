import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../config";

const NotificationIcon = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem("username");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/user/notifications/${userId}`);
        setUnreadCount(res.data.unseenCount || 0);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userId]);

  return (
    <Link to="/notifications" style={{ position: "relative", marginRight: "20px", textDecoration: "none" }}>
      🔔
      {unreadCount > 0 && (
        <span style={{
          position: "absolute",
          top: "-5px",
          right: "-10px",
          background: "red",
          color: "white",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "12px"
        }}>
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default NotificationIcon;
