import React from "react";
import styles from "./Notification.module.css";

function Notification() {
  // Mock notifications
  const notifications = [
    { id: 1, title: "New Star", message: "Ram starred your skill", time: "10:30 AM" },
    { id: 2, title: "New Like", message: "Your skill has a like", time: "11:00 AM" },
    { id: 3, title: "Rating", message: "Sita rated you 3 stars", time: "12:15 PM" },
  ];
  

  return (
    <div className={styles.container}>
      <h1>Notifications</h1>
      <ul className={styles.notificationList}>
        {notifications.map((notification) => (
          <li key={notification.id} className={styles.notificationItem}>
          <div>
            <h3 className={styles.notificationTitle}>{notification.title}</h3>
            <p className={styles.notificationMessage}>{notification.message}</p>
          </div>
          <span className={styles.notificationTime}>{notification.time}</span>
        </li>
        
        ))}
      </ul>
    </div>
  );
}

export default Notification;
