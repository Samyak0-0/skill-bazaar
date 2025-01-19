// components/order/bought.tsx
import { useState, useEffect } from 'react';
import OrderCard from "./ordercard";
import { Order } from "./type";

export default function Bought() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBoughtOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        // Filter orders where the current user is the buyer
        const boughtOrders = data.filter((order: Order) => order.buyerId === 'CURRENT_USER_ID');
        setOrders(boughtOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBoughtOrders();
  }, []);

  // ... rest of the component is identical to Sold component
  // just replacing "sold" with "bought" in the messages
  
  return (
    <div className="space-y-4">
      {orders.map((order, index) => (
        <OrderCard
          key={order.id || index}
          username={order.sellerId || 'Unknown User'}
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