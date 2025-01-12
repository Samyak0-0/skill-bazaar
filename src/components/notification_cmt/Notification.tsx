"use client"

import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";

// Define the type for a notification
type Notification = {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
};

function Notification() {
  const [notifications, setNotifications] = useState<Notification[]>([]); // State for storing notifications
  const [loading, setLoading] = useState(true); // State for loading status
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch notifications from the backend API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications"); // Adjust the endpoint if needed
        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }
        const data: Notification[] = await response.json(); // Type the response data
        setNotifications(data);
      } catch (err) {
        setError((err as Error).message); // Handle errors
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    fetchNotifications();
  }, []); // Runs once on component mount

  if (loading) {
    return <p>Loading notifications...</p>; // Show loading message
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message
  }

  return (
    <div className={styles.container}>
      <h1>Notifications</h1>
      {notifications.length === 0 ? (
        <p>No notifications to display</p> // Handle empty notifications
      ) : (
        <ul className={styles.notificationList}>
          {notifications.map((notification) => (
            <li key={notification._id} className={styles.notificationItem}>
              <div>
                <h3 className={styles.notificationTitle}>
                  {notification.type.toUpperCase()} {/* Display type as title */}
                </h3>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
              </div>
              <span className={styles.notificationTime}>
                {new Date(notification.createdAt).toLocaleString()} {/* Format time */}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;
