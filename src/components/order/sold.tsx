// components/order/sold.tsx
import { useState, useEffect } from 'react';
import OrderCard from "./ordercard";
import { Order } from "./type";

export default function Sold() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoldOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        // Filter orders where the current user is the seller
        const soldOrders = data.filter((order: Order) => order.sellerId === 'CURRENT_USER_ID');
        setOrders(soldOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSoldOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading orders: {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-gray-500 text-center p-4">
        No sold orders found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <OrderCard
          key={order.id || index}
          username={order.buyerId || 'Unknown User'}
          skill={order.category || 'Unknown Category'}
          work={order.workTitle || 'Untitled Work'}
          status={order.status}
          date={new Date(order.createdAt).toLocaleDateString()}
          reviews={0}
        />
      ))}
    </div>
  );
}