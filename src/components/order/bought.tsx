import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';  // Import useSession
import OrderCard from "./ordercard";
import { Order } from "./type";

export default function Bought() {
  const { data: session, status } = useSession();  // Get session data
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoughtOrders = async () => {
      if (status === "loading") return;  // Wait until session is ready

      if (!session) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        console.log('Starting fetch for bought orders...');
        const response = await fetch('/api/orders/bought', {
          headers: {
            Authorization: `Bearer ${session.user.id}`,  // Send user id in the header
          },
        });
        console.log('Response status:', response.status);
        
        const textData = await response.text();
        console.log('Raw response:', textData);
        
        if (!textData) {
          throw new Error('Empty response received');
        }
        
        const data = JSON.parse(textData);
        
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

    fetchBoughtOrders();
  }, [session, status]);

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
        No bought orders found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          username={order.seller?.name || 'Unknown User'}
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