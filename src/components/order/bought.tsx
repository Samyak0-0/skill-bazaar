// app/orders/bought.tsx
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
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (sessionStatus === "loading") return;
      
      if (sessionStatus === "unauthenticated") {
        setError("Please sign in to view orders");
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching bought orders...');
        console.log('Session info:', {
          hasSession: !!session,
          user: session?.user,
          userId: session?.user?.id,
        });
        
        const queryParams = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
        
        // Use correct API path with type parameter
        const response = await fetch(`/api/orders/bought${queryParams}`, {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',  // Prevent caching issues
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Error response:', errorData);
          throw new Error(errorData.error || `Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        console.log(`Received ${data.length} bought orders`, data);
        
        // Store raw data for debugging purposes
        setDebugInfo({
          rawCount: data.length,
          sessionUserId: session?.user?.id,
          rawData: data.length > 0 ? data[0] : null
        });
        
        // Make sure we only show orders where we are the buyer and there's a seller
        // For bought orders, we are the buyer
        const validOrders = data.filter((order: Order) => 
          order.sellerId && 
          order.seller
        );
        
        if (validOrders.length < data.length) {
          console.warn(`Filtered out ${data.length - validOrders.length} invalid bought orders`);
        }
        
        setOrders(validOrders);
        setError(null);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sessionStatus, statusFilter, session?.user?.id]);

  const statuses = ['all', 'PENDING', 'IN PROGRESS', 'COMPLETED'];

  return (
    <div>
      <div className="mb-4 flex justify-center space-x-2">
        {statuses.map((s) => (
          <button
            key={s}
            className={`px-4 py-2 rounded transition-colors ${
              statusFilter === s
                ? 'bg-blue-500 text-black'
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
          <p>No orders found</p>
          {process.env.NODE_ENV !== 'production' && debugInfo && (
            <div className="mt-2 p-2 border border-dashed border-gray-300 text-xs text-left">
              <p>Debug Info:</p>
              <p>- User ID: {debugInfo.sessionUserId || 'Not found'}</p>
              <p>- Raw orders count: {debugInfo.rawCount}</p>
              <p>- API returned data: {debugInfo.rawCount > 0 ? 'Yes' : 'No'}</p>
              {debugInfo.rawData && (
                <details>
                  <summary className="cursor-pointer">Show first order data</summary>
                  <pre className="mt-2 overflow-auto max-h-40 bg-gray-100 p-2">
                    {JSON.stringify(debugInfo.rawData, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4 text-black">
          {orders.map((order: Order) => (
            <OrderCard
              key={order.id}
              username={order.seller?.name || 'Unknown Seller'} // Ensure we display the seller's name
              category={order.category || 'Unknown Category'}
              work={order.workTitle || 'Untitled Work'}
              status={order.status}
              date={new Date(order.createdAt).toLocaleDateString()}
              reviews={order.Review?.length || 0}
              orderId={order.id}
              type="bought" // Explicitly set type as "bought"
            />
          ))}
        </div>
      )}
    </div>
  );
}