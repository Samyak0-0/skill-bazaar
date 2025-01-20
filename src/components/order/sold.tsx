import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';  // Import useSession
import OrderCard from "./ordercard";
import { Order } from "./type";

export default function Sold() {
  const { data: session, status } = useSession();  // Get session data
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSoldOrders = async () => {
      if (status === "loading") return;  // Wait until session is ready

      if (!session) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        console.log('Starting fetch for sold orders...');
        const response = await fetch('/api/orders/sold', {
          headers: {
            Authorization: `Bearer ${session.user.id}`,  // Send user id in the header
          },
        });
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch orders');
        }
        
        setOrders(data);
      } catch (err) {
        console.error('Detailed fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSoldOrders();
  }, [session, status]);

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
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          username={order.buyer?.name || 'Unknown User'}
          skill={order.service?.name || 'Unknown Service'}
          work={order.workTitle || 'Untitled Work'}
          status={order.status}
          date={new Date(order.createdAt).toLocaleDateString()}
          reviews={order.Review?.length || 0}
        />
      ))}
    </div>
  );
}