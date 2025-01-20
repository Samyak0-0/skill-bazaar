// app/orders/bought.tsx (and sold.tsx with minimal changes)
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import OrderCard from "./ordercard";
import { Order } from "./type";

export default function Bought() {
  const { data: session, status: sessionStatus } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      if (sessionStatus === "loading") return;
      
      if (sessionStatus === "unauthenticated") {
        setError("Please sign in to view orders");
        setLoading(false);
        return;
      }

      try {
        const queryParams = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
        const response = await fetch(`/api/orders/bought${queryParams}`, {
          credentials: 'include',
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sessionStatus, statusFilter]);

  const statuses = ['all', 'PENDING', 'IN PROGRESS', 'COMPLETED'];

  return (
    <div>
      <div className="mb-4 flex justify-center space-x-2">
        {statuses.map((s) => (
          <button
            key={s}
            className={`px-4 py-2 rounded transition-colors ${
              statusFilter === s
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-black hover:bg-black hover:text-white'
            }`}
            onClick={() => setStatusFilter(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-300" />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center p-4">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="text-gray-500 text-center p-4">
          No orders found
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
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
      )}
    </div>
  );
}