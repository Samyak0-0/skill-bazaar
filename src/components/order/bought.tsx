import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import OrderCard from "./ordercard";
import { Order } from "./type";

// Extended type to include purchasedOrder specific fields
interface ExtendedOrder extends Order {
  purchaseDate?: Date | string;
  purchasedOrderId?: string;
  purchasedOrderStatus?: string;
}

export default function Bought() {
  const { data: session, status: sessionStatus } = useSession();
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  
  // Separate filteredOrders state to avoid refetching from API when filter changes
  const [filteredOrders, setFilteredOrders] = useState<ExtendedOrder[]>([]);

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
        
        // Remove status filter from API call - we'll filter client-side
        const response = await fetch(`/api/orders/bought`, {
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
          rawData: data.length > 0 ? data[0] : null,
          purchasedOrdersCount: data.length > 0 && data[0].purchasedOrders ? data[0].purchasedOrders.length : 0
        });
        
        // Create a Map to deduplicate orders by ID - using purchasedOrderId when available
        const uniqueOrdersMap = new Map();
        data.forEach((order: ExtendedOrder) => {
          // Only add orders that have a seller
          if (order.sellerId && order.seller) {
            const uniqueId = order.purchasedOrderId ? `${order.id}-${order.purchasedOrderId}` : order.id;
            uniqueOrdersMap.set(uniqueId, order);
          }
        });
        
        // Convert Map back to array
        const validOrders = Array.from(uniqueOrdersMap.values());
        
        console.log(`Found ${validOrders.length} valid unique orders from ${data.length} total orders`);
        if (validOrders.length < data.length) {
          console.warn(`Filtered out ${data.length - validOrders.length} invalid or duplicate bought orders`);
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
  }, [sessionStatus, session?.user?.id]); // Remove statusFilter from dependencies

  // Apply status filter client-side when orders or statusFilter changes
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order => 
        (order.purchasedOrderStatus || order.status) === statusFilter
      );
      setFilteredOrders(filtered);
    }
  }, [orders, statusFilter]);

  const statuses = ['all', 'PENDING', 'IN PROGRESS', 'COMPLETED'];

  return (
    <div>
      <div className="flex justify-center mb-6 space-x-2">
        {statuses.map((s) => (
          <button
            key={s}
            className={`px-4 py-2 rounded-full transition-colors duration-300 ${
              statusFilter === s
                ? 'bg-[#0cb9c1] text-white font-medium shadow-md'
                : 'bg-white text-gray-700 hover:bg-[rgba(12,185,193,0.3)] border border-gray-200'
            }`}
            onClick={() => setStatusFilter(s)}
          >
            {s === "all" ? "All" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#0cb9c1]" />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center p-4 rounded-lg bg-red-50 border border-red-100">
          {error}
        </div>
      )}

      {!loading && !error && filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto w-16 h-16 text-[rgba(12,185,193,0.3)] mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">
            {orders.length > 0 
              ? `No ${statusFilter !== 'all' ? statusFilter.toLowerCase() : ''} orders found`
              : "No orders found"}
          </p>
          {process.env.NODE_ENV !== 'production' && debugInfo && (
            <div className="mt-2 p-2 border border-dashed border-gray-300 text-xs text-left max-w-md mx-auto bg-gray-50 rounded">
              <p>Debug Info:</p>
              <p>- User ID: {debugInfo.sessionUserId || 'Not found'}</p>
              <p>- Raw orders count: {debugInfo.rawCount}</p>
              <p>- Total valid orders: {orders.length}</p>
              <p>- Filtered orders: {filteredOrders.length}</p>
              <p>- Current filter: {statusFilter}</p>
              <p>- API returned data: {debugInfo.rawCount > 0 ? 'Yes' : 'No'}</p>
              <p>- Purchased orders count: {debugInfo.purchasedOrdersCount}</p>
              {debugInfo.rawData && (
                <details>
                  <summary className="cursor-pointer">Show first order data</summary>
                  <pre className="mt-2 overflow-auto max-h-40 bg-gray-100 p-2 rounded">
                    {JSON.stringify(debugInfo.rawData, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      )}

      {!loading && !error && filteredOrders.length > 0 && (
        <div className="space-y-4">
          {filteredOrders.map((order: ExtendedOrder) => (
            <OrderCard
              key={`${order.id}-${order.purchasedOrderId || ''}`}
              username={order.seller?.name || 'Unknown Seller'}
              category={order.category || 'Unknown Category'}
              work={order.workTitle || 'Untitled Work'}
              status={order.purchasedOrderStatus || 'PENDING'}
              date={order.purchaseDate ? 
                new Date(order.purchaseDate).toLocaleDateString() :
                new Date(order.createdAt).toLocaleDateString()}
              reviews={order.Review?.length || 0}
              orderId={order.id}
              type="bought"
              isPurchased={true}
              purchasedOrderId={order.purchasedOrderId}
            />
          ))}
        </div>
      )}
    </div>
  );
}