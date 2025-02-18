"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

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

const OrderDetailsPage = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleOrderAction = async (action: 'accept' | 'decline') => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' 
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} order`);
      }

      // Create a notification for the buyer about order status
      await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: `Order ${action.toUpperCase()}`,
          message: `Your order "${order.workTitle}" has been ${action}ed`,
          userId: order.buyerId,
          orderId: order.id,
          read: false
        }),
      });

      // Redirect back to notifications or orders page
      router.push('/notifications');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
      </div>
    );
  }

  if (!order) {
    return <div className="text-center p-4">No order found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Work Title</label>
          <p className="mt-1 text-lg">{order.workTitle}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <p className="mt-1">{order.description}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <p className="mt-1">{order.category}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Rate</label>
          <p className="mt-1">{order.rate}</p>
        </div>
      </div>
      {order.status === 'PENDING' && (
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => handleOrderAction('accept')}
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            Accept Order
          </button>
          <button
            onClick={() => handleOrderAction('decline')}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Decline Order
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;