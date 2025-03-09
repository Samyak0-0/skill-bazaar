import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import OrderCard from "./ordercard";
import { Order, PurchasedOrder, User, UserInfo } from "./type";

// Extend the Order type to include purchasedOrder specific fields
interface ExtendedOrder extends Order {
  purchaseDate?: Date | string;
  buyerInfo?: UserInfo;
  purchasedOrderId?: string;
  purchasedOrderStatus?: string;
  buyer?: UserInfo;
}

export default function Sold() {
  const { data: session, status: sessionStatus } = useSession();
  const [orders, setOrders] = useState<ExtendedOrder[]>([]);
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
        console.log('Fetching sold orders...');
        console.log('Session info:', {
          hasSession: !!session,
          user: session?.user,
          userId: session?.user?.id,
        });
        
        const queryParams = statusFilter !== 'all' ? `?status=${statusFilter}` : '';
        
        // Use correct API path with type parameter
        const response = await fetch(`/api/orders/sold${queryParams}`, {
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
        console.log(`Received ${data.length} sold orders`, data);
        
        // Detailed debug information for the first order's structure
        if (data.length > 0) {
          const firstOrder = data[0];
          const firstPurchasedOrder = firstOrder.purchasedOrders?.[0];
          
          console.log('First order structure:', {
            id: firstOrder.id,
            hasBuyer: !!firstOrder.buyer,
            purchasedOrdersCount: firstOrder.purchasedOrders?.length || 0,
            firstPurchasedOrder: firstPurchasedOrder ? {
              id: firstPurchasedOrder.id,
              buyerId: firstPurchasedOrder.buyerId,
              hasBuyer: !!firstPurchasedOrder.buyer,
              buyerName: firstPurchasedOrder.buyer?.name
            } : 'No purchased orders'
          });
        }
        
        // Store raw data for debugging purposes
        setDebugInfo({
          rawCount: data.length,
          sessionUserId: session?.user?.id,
          rawData: data.length > 0 ? data[0] : null,
          purchasedOrdersCount: data.length > 0 && data[0].purchasedOrders ? data[0].purchasedOrders.length : 0
        });
        
        // Expand orders with purchasedOrders to create individual entries for each purchase
        // ONLY including those with a valid buyerId
        const expandedOrders: ExtendedOrder[] = [];
        
        data.forEach((order: ExtendedOrder) => {
          if (order.purchasedOrders && order.purchasedOrders.length > 0) {
            // Filter to only include purchasedOrders that have a valid buyerId
            const validPurchasedOrders = order.purchasedOrders.filter(po => 
              po.buyerId && po.buyerId !== null && po.buyerId !== undefined && po.buyerId !== ''
            );
            
            // For each valid purchasedOrder, create a separate entry
            validPurchasedOrders.forEach(po => {
              // Verify the buyer information exists
              if (po.buyerId) {
                expandedOrders.push({
                  ...order,
                  purchasedOrderId: po.id,
                  purchasedOrderStatus: po.status,
                  purchaseDate: po.purchaseDate,
                  // Use the buyer information from the purchasedOrder
                  buyer: po.buyer,
                  buyerInfo: {
                    id: po.buyerId,
                    name: po.buyer?.name || null,
                    email: po.buyer?.email || null
                  }
                });
                
                // Debug this specific entry
                console.log(`Valid order entry for purchase ${po.id}:`, {
                  buyerId: po.buyerId,
                  buyerName: po.buyer?.name || 'null',
                  buyerEmail: po.buyer?.email || 'null'
                });
              } else {
                console.log(`Skipping order entry for purchase ${po.id} due to missing buyerId`);
              }
            });
            
            // Log any filtered out entries
            if (validPurchasedOrders.length < order.purchasedOrders.length) {
              console.log(`Filtered out ${order.purchasedOrders.length - validPurchasedOrders.length} purchasedOrders without valid buyerId`);
            }
          }
          // We no longer include orders without purchasedOrders since they don't have buyers
        });
        
        console.log(`Expanded to ${expandedOrders.length} valid individual sold order entries`);
        setOrders(expandedOrders);
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

      {!loading && !error && orders.length === 0 && (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="mx-auto w-16 h-16 text-[rgba(12,185,193,0.3)] mb-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No orders found</p>
          {process.env.NODE_ENV !== 'production' && debugInfo && (
            <div className="mt-2 p-2 border border-dashed border-gray-300 text-xs text-left max-w-md mx-auto bg-gray-50 rounded">
              <p>Debug Info:</p>
              <p>- User ID: {debugInfo.sessionUserId || 'Not found'}</p>
              <p>- Raw orders count: {debugInfo.rawCount}</p>
              <p>- API returned data: {debugInfo.rawCount > 0 ? 'Yes' : 'No'}</p>
              <p>- Purchased orders count: {debugInfo.purchasedOrdersCount}</p>
              <p>- Valid orders displayed: {orders.length}</p>
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

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order: ExtendedOrder, index: number) => {
            // Improved buyer name resolution - check multiple sources
            const buyerName = order.buyerInfo?.name || 
                             order.buyer?.name || 
                             'Unknown Buyer';
                             
            // Debug the specific buyer name resolution for each card
            console.log(`Order card ${index}:`, {
              buyerId: order.buyerInfo?.id || order.buyer?.id,
              buyerInfoName: order.buyerInfo?.name,  
              buyerName: order.buyer?.name,
              finalName: buyerName
            });
            
            return (
              <OrderCard
                key={`${order.id}-${order.purchasedOrderId || index}`}
                username={buyerName}
                category={order.category || 'Unknown Category'}
                work={order.workTitle || 'Untitled Work'}
                status={order.purchasedOrderStatus || order.status || 'PENDING'}
                date={order.purchaseDate ? 
                  new Date(order.purchaseDate).toLocaleDateString() :
                  new Date(order.createdAt).toLocaleDateString()}
                reviews={order.Review?.length || 0}
                orderId={order.id}
                type="sold"
                isPurchased={true}
                purchasedOrderId={order.purchasedOrderId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}