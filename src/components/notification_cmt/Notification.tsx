"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Bell, CheckCircle } from "lucide-react";
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  const {data: session, status: sessionStatus } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (sessionStatus === "loading") return;
      
      if (sessionStatus === "unauthenticated") {
        setError("Please sign in to view notifications");
        setLoading(false);
        return;
      }

      // Log session info for debugging
      console.log('Session info:', {
        hasSession: !!session,
        user: session?.user,
        userId: session?.user?.id,
      });

      try {
        const response = await fetch('/api/notifications', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Error response:', errorData);
          throw new Error(errorData.error || `Failed to fetch notifications: ${response.status}`);
        }

        const data = await response.json();
        console.log('Raw notifications from API:', data);
        
        // Ensure we have notifications
        const validNotifications = data.notifications || [];
        
        setNotifications(validNotifications);
        
        // Count unread notifications
        const unread = validNotifications.filter(
          (notif: NotificationData) => !notif.read
        ).length;
        setUnreadCount(unread);
        
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [sessionStatus]);

  const handleNotificationClick = async (notification: NotificationData) => {
    try {
      // Mark as read
      if (!notification.read) {
        await markAsRead(notification.id);
      }
    
      // Navigate based on notification type
      if (notification.orderId) {
        router.push(`/orderdetails/${notification.orderId}`);
      }
    } catch (error) {
      console.error("Error handling notification click:", error);
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
      
      //update local state
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
       // Update unread count
       setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    setMarkingAllAsRead(true);
    try {
      const response = await fetch(`/api/notifications`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
      
      // Update local state
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-[#f2f2f2] min-h-screen"> 
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
      </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-red-500 p-4 text-center">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Main render
  return (
    <div className="bg-[#f2f2f2] min-h-screen"> 
    <div className="max-w-4xl mx-auto px-4 py-6 bg-[#f2f2f2]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <>
             <div className="bg-[#0cb9c1] text-white px-3 py-1 rounded-full text-sm font-medium">
                {unreadCount} new
              </div>
              <button
                onClick={markAllAsRead}
                disabled={markingAllAsRead}
                className="text-sm text-[#0cb9c1] hover:text-blue-800 flex items-center"
              >
                {markingAllAsRead ? (
                  <Loader2 className="animate-spin w-3 h-3 mr-1" />
                ) : (
                  <CheckCircle className="w-3 h-3 mr-1" />
                )}
                Mark all as read
              </button>
            </>
          )}
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No notifications to display</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-lg p-4 cursor-pointer transition-all duration-200 
                ${!notification.read ? 'bg-[rgba(12,185,193,0.3)]' : 'bg-white'}
                border border-[#D0E3E8] hover:shadow-md`}
              onClick={() => handleNotificationClick(notification)}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">
                    Notification
                    {!notification.read && (
                      <span className="ml-2 inline-block w-2 h-2 bg-[#0cb9c1] rounded-full"></span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {notification.message}
                  </p>
                  <small className="text-gray-500 block mt-2 text-xs">
                    {new Date(notification.createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}

export default Notification;