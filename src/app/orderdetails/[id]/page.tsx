// D:\skill-bazaar\src\app\orderdetails\[id]\page.tsx
"use client";
import React, { useContext, useEffect, useState } from "react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { MessagingContext } from "@/provider/MessagingContext";

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  reviewer: {
    name: string | null;
    image: string | null;
  };
}

interface OrderData {
  id: string;
  workTitle: string;
  description: string;
  rate: string;
  category: string;
  status: string; //track order status
  sellerId: string;
  buyerId: string;
  averageRating: string;
  Review: Review[];
  buyer: {
    name: string | null;
    image: string | null;
  } | null;
  seller: {
    name: string | null;
    image: string | null;
  } | null;
}

const OrderDetailPage = () => {
  const router = useRouter();
  const params = useParams(); 

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState(false);

  const {userId} = useContext(MessagingContext)

  useEffect(() => {
    if (!params?.id) return; 

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orderdetails/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details");
        }
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params?.id]);
  const handleOrderAction = async (action: 'accept' | 'decline') => {
    if (!orderData || actionInProgress) return;
  
    try {
      setActionInProgress(true);
      
      // Log the request details
      console.log('Sending request to:', `/api/orderdetails/${orderData.id}`);
      console.log('Request body:', { status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' });
      
      // Update order status
      const orderResponse = await fetch(`/api/orderdetails/${orderData.id}`, {  // Changed from /api/orders to /api/orderdetails
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' 
        }),
      });
  
      // Log the response
      console.log('Response status:', orderResponse.status);
      const responseData = await orderResponse.json();
      console.log('Response data:', responseData);
  
      if (!orderResponse.ok) {
        throw new Error(`Failed to ${action} order: ${responseData.error || 'Unknown error'}`);
      }
  
      // Create notification for buyer
      const notificationResponse = await fetch('/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: `Order ${action.toUpperCase()}ED`,
          message: `Your order "${orderData.workTitle}" has been ${action}ed by the seller`,
          userId: orderData.buyerId,
          orderId: orderData.id,
          read: false
        }),
      });
  
      if (!notificationResponse.ok) {
        throw new Error('Failed to create notification');
      }
  
      // Update local state
      setOrderData(prev => prev ? { ...prev, status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' } : null);
      
      // Show success message and redirect after a brief delay
      setTimeout(() => {
        router.push('/notifications');
      }, 1500);
  
    } catch (err) {
      console.error('Error in handleOrderAction:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setActionInProgress(false);
    }
  };

  // const handleOrderAction = async (action: 'accept' | 'decline') => {
  //   if (!orderData || actionInProgress) return;

  //   try {
  //     setActionInProgress(true);
      
  //     // Update order status
  //     const orderResponse = await fetch(`/api/orders/${orderData.id}`, {
  //       method: 'PATCH',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ 
  //         status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' 
  //       }),
  //     });

  //     if (!orderResponse.ok) {
  //       throw new Error(`Failed to ${action} order`);
  //     }

  //     // Create notification for buyer
  //     const notificationResponse = await fetch('/api/notifications', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         type: `Order ${action.toUpperCase()}ED`,
  //         message: `Your order "${orderData.workTitle}" has been ${action}ed by the seller`,
  //         userId: orderData.buyerId,
  //         orderId: orderData.id,
  //         read: false
  //       }),
  //     });

  //     if (!notificationResponse.ok) {
  //       throw new Error('Failed to create notification');
  //     }
  //      // Update local state
  //      setOrderData(prev => prev ? { ...prev, status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' } : null);
      
  //      // Show success message and redirect after a brief delay
  //      setTimeout(() => {
  //        router.push('/notifications');
  //      }, 1500);
 
  //    } catch (err) {
  //      setError(err instanceof Error ? err.message : 'An error occurred');
  //    } finally {
  //      setActionInProgress(false);
  //    }
  //  };


  const handlePayment = async (
    rate: string,
    orderId: string
  ): Promise<void> => {
    try {
      const rateAmt = parseInt(rate.match(/\d+/)?.[0] || "0", 10);
      const requestData = {
        itemId: orderId,
        totalPrice: rateAmt,
        buyerId: userId,
      };

      const response = await fetch("http://localhost:3000/api/esewa-payment", {
        method: "POST",
        body: JSON.stringify(requestData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        console.error(
          "Payment request failed:",
          response.status,
          response.statusText
        );
        throw new Error(
          `Payment request failed with status ${response.status}`
        );
      }
      const data = await response.json();
      if (!data?.purchasedItemData?.id || !data?.payment?.signature) {
        throw new Error("Missing payment data from response.");
      }

      const form = document.createElement("form");
      form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";
      form.method = "POST";
      const formData = {
        amount: `${rateAmt}`,
        tax_amount: "0",
        total_amount: `${rateAmt}`,
        transaction_uuid: `${data.purchasedItemData.id}`,
        product_code: "EPAYTEST",
        product_service_charge: "0",
        product_delivery_charge: "0",
        success_url: "http://localhost:3000/messages",
        failure_url: "https://developer.esewa.com.np/failure",
        signed_field_names: "total_amount,transaction_uuid,product_code",
        signature: `${data.payment.signature}`,
      };
      for (const [key, value] of Object.entries(formData)) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      console.error("Error during payment processing:", error);
    }
 
 


  };


  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="max-w-4xl mx-auto p-6 text-red-500">{error}</div>;
  }

  if (!orderData) {
    return <div className="max-w-4xl mx-auto p-6">No order found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Orders
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-black">
              {orderData.workTitle}
            </h1>
            <p className="text-lg mb-4 text-black">{orderData.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              {orderData.rate}
            </div>
            <div className="text-gray-600">Category: {orderData.category}</div>
            <div className="text-gray-600 mt-2">
              Status: <span className="font-semibold">{orderData.status}</span>
            </div>
          </div>
        </div>

        {orderData.status === 'PENDING' && (
          <div className="border-t border-gray-200 pt-6 flex gap-4 mb-6">
            <button
              onClick={() => handleOrderAction('accept')}
              disabled={actionInProgress}
              className={`flex-1 py-3 px-4 rounded-lg text-white text-center font-medium
                ${actionInProgress 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600 transition'
                }`}
            >
              {actionInProgress ? 'Processing...' : 'Accept Order'}
            </button>
            <button
              onClick={() => handleOrderAction('decline')}
              disabled={actionInProgress}
              className={`flex-1 py-3 px-4 rounded-lg text-white text-center font-medium
                ${actionInProgress 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-red-500 hover:bg-red-600 transition'
                }`}
            >
              {actionInProgress ? 'Processing...' : 'Decline Order'}
            </button>
          </div>
        )}

        <div className="border-t border-gray-200 pt-6 flex justify-between">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-600">Rating:</h2>
            <span className="text-2xl text-yellow-500">
              {orderData.averageRating}
            </span>
          </div>

          <button
            onClick={() => handlePayment(orderData.rate, orderData.id)}
            className="w-1/3 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold transition duration-300 flex items-center justify-center gap-2"
          >
            Buy Now <ShoppingCart />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-600">Reviews</h2>
        <div className="space-y-6">
          {orderData.Review.length > 0 ? (
            orderData.Review.map((review) => (
              <div
                key={review.id}
                className="border-b border-gray-200 last:border-0 pb-6"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      {review.reviewer.image ? (
                        <img
                          src={review.reviewer.image}
                          alt={review.reviewer.name || "User"}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-600">@</span>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {review.reviewer.name || "Anonymous User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-yellow-500 font-medium">
                    Rating: {review.rating}/5
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No reviews yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
