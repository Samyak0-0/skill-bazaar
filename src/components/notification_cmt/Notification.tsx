"use client";

import React, { useEffect, useState } from "react";
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
        const response = await fetch('/api/notifications');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch notifications');
        }
        const data = await response.json();
        if (!data.notifications) {
          throw new Error('No notifications data in response');
        }
        setNotifications(data.notifications);
      } catch (err) {
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
    <div className="max-w-4xl mx-auto px-4 py-6">
      {notifications.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No notifications to display</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-[#E5F0F3] rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md
                ${notification.read ? 'bg-gray-100' : ''}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Notification
                </h3>
                <p className="text-gray-600">
                  {notification.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;