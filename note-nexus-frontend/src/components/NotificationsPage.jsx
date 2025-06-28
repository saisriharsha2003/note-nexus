import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/notification.css";
import Nav from "./Nav";
import { BASE_URL } from "../config";

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const notificationsPerPage = 4;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const username = localStorage.getItem("username");
        const response = await axios.get(
          `${BASE_URL}/api/user/notifications/${username}`
        );
        setNotifications(response.data.notifications);

        await axios.post(
          `${BASE_URL}/api/user/notifications/reset/${username}`
        );
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, []);

  const totalPages = Math.ceil(notifications.length / notificationsPerPage);
  const startIndex = (currentPage - 1) * notificationsPerPage;
  const currentNotifications = notifications.slice(
    startIndex,
    startIndex + notificationsPerPage
  );

  const changePage = (newPage) => setCurrentPage(newPage);

  return (
    <div>
      <Nav />
      <div className="notification-container">
        <div className="notification-box">
          <h2>Notifications</h2>
          <ul className="notification-list">
            {currentNotifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              currentNotifications.map((notif, index) => (
                <li key={notif._id || index} className="notification-item">
                  {notif.noteTitle && (
                    <div className="notification-note-title">
                      📝 Original Note Title: <span style={{color: "white", fontSize: "15px"}}>"{notif.noteTitle}"</span>
                    </div>
                  )}
                  <div className="notification-message">{notif.message}</div>
                  <div className="notification-date">
                    {new Date(notif.createdAt).toLocaleString()}
                  </div>
                </li>
              ))
            )}
          </ul>

          {notifications.length > notificationsPerPage && (
            <div className="pagination">
              {currentPage > 1 && (
                <button
                  onClick={() => changePage(currentPage - 1)}
                  className="pagination-btn"
                >
                  Previous
                </button>
              )}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => changePage(i + 1)}
                  className={`pagination-btn ${
                    currentPage === i + 1 ? "active" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => changePage(currentPage + 1)}
                  className="pagination-btn"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
