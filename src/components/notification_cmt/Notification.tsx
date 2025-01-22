"use client";

import React, { useEffect, useState } from "react";
import styles from "./Notification.module.css";
import { Loader2 } from "lucide-react";

interface NotificationData {
  id: string;
  type: string;
  message: string;
  userId: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  orderId?: string;
}

function Notification() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log('Fetching notifications...'); // Debug log
        const response = await fetch('/api/notifications');
        console.log('Response status:', response.status); // Debug log
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch notifications');
        }
        
        const data = await response.json();
        console.log('Fetched data:', data); // Debug log
        
        if (!data.notifications) {
          throw new Error('No notifications data in response');
        }
        
        setNotifications(data.notifications);
      } catch (err) {
        console.error('Fetch error:', err); // Debug log
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId: id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
      
      const data = await response.json();
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>Error: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-bold mb-4">Notifications</h1>
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No notifications to display</p>
      ) : (
        <ul className={styles.notificationList}>
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`${styles.notificationItem} ${
                notification.read ? styles.read : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div>
                <h3 className={styles.notificationTitle}>
                  {notification.type}
                </h3>
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                <span className={styles.notificationTime}>
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notification;