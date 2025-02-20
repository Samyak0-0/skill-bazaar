"use client";

import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from 'next/navigation';//for orderdetails page nav

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

interface OrderData {
  id: string;
  workTitle: string;
  description: string;
  rate: string;
  category: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  status: string;
}

function Notification() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

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

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, []); 

  const handleNotificationClick = async (notification: NotificationData) => {
    // Mark as read
    await markAsRead(notification.id);
  
    // Navigate to order details if it's a new order notification
    if (notification.type === 'New Order' && notification.orderId) {
      router.push(`/orderdetails/${notification.orderId}`);
    }
  };
  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
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
              onClick={() => handleNotificationClick(notification)}
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {notification.type}
                </h3>
                <p className="text-gray-600">
                  {notification.message}
                </p>
                <small className="text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notification;