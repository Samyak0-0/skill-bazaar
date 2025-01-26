"use client";
"use client";
import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderData {
  id: string;
  workTitle: string;
  description: string;
  rate: string;
  category: string;
}

interface Comment {
  userId: string;
  username: string;
  date: string;
  rating: string;
  content: string;
}

interface OrderDetailProps {
  params: {
    id: string;
  };
}

const OrderDetailPage = ({ params }: OrderDetailProps) => {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded comments (can be replaced with fetched comments later)
  const comments: Comment[] = [
    {
      userId: "user1",
      username: "User1",
      date: "January 15",
      rating: "3/5",
      content: "Good great work boy got 4.0 GPA within a month."
    },
    {
      userId: "user2",
      username: "User2",
      date: "January 16",
      rating: "5/5",
      content: "My son started doing drugs"
    }
  ];

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orderdetails/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrderData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-red-500">
        {error}
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        No order found.
      </div>
    );
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
            <h1 className="text-3xl font-bold mb-2 text-black">{orderData.workTitle}</h1>
            <p className="text-lg mb-4 text-black">{orderData.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">{orderData.rate}</div>
            <div className="text-gray-600">Category: {orderData.category}</div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-600">Rating:</h2>
            <span className="text-2xl text-yellow-500">4/5</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-600">Comments</h2>
        <div className="space-y-6">
          {comments.map((comment, index) => (
            <div key={index} className="border-b border-gray-200 last:border-0 pb-6">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-600">@</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{comment.username}</div>
                    <div className="text-sm text-gray-500">{comment.date}</div>
                  </div>
                </div>
                <div className="text-yellow-500 font-medium">
                  Rating: {comment.rating}
                </div>
              </div>
              <p className="text-gray-700 mt-2">{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
// import React from 'react';
// import { ArrowLeft } from 'lucide-react';
// import { useRouter } from 'next/navigation';

// interface Comment {
//     userId: string;
//     username: string;
//     date: string;
//     rating: string;
//     content: string;
// }

// interface OrderDetailProps {
//     params: {
//         id: string;
//     };
// }

// const OrderDetailPage = ({ params }: OrderDetailProps) => {
//     const router = useRouter();

//     // Hardcoded data for now
//     const orderData = {
//         workTitle: "Tutor",
//         description: "Tutoring",
//         rate: "50$",
//         category: "Education",
//         rating: "4/5",
//         comments: [
//             {
//                 userId: "user1",
//                 username: "User1",
//                 date: "January 15",
//                 rating: "3/5",
//                 content: "Good great work boy got 4.0 GPA within a month."
//             },
//             {
//                 userId: "user2",
//                 username: "User2",
//                 date: "January 16",
//                 rating: "5/5",
//                 content: "My son started doing drugs"
//             }
//         ]
//     };

//     return (
//         <div className="max-w-4xl mx-auto p-6">
//             <button 
//                 onClick={() => router.back()}
//                 className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mb-6"
//             >
//                 <ArrowLeft size={20} />
//                 Back to Orders
//             </button>

//             <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
//                 <div className="flex justify-between items-start mb-6">
//                     <div>
//                         <h1 className="text-3xl font-bold mb-2 text-black">{orderData.workTitle}</h1>
//                         <p className="text-gray-600 text-lg mb-4">{orderData.description}</p>
//                     </div>
//                     <div className="text-right">
//                         <div className="text-2xl font-bold text-green-600">{orderData.rate}</div>
//                         <div className="text-gray-500">Category: {orderData.category}</div>
//                     </div>
//                 </div>
                
//                 <div className="border-t border-gray-200 pt-6">
//                     <div className="flex items-center gap-2 mb-4">
//                         <h2 className="text-2xl font-bold text-black">Rating:</h2>
//                         <span className="text-2xl text-yellow-500">{orderData.rating}</span>
//                     </div>
//                 </div>
//             </div>

//             <div className="bg-white rounded-lg shadow-lg p-6">
//                 <h2 className="text-2xl font-bold mb-6 text-black">Comments</h2>
//                 <div className="space-y-6">
//                     {orderData.comments.map((comment, index) => (
//                         <div key={index} className="border-b border-gray-200 last:border-0 pb-6">
//                             <div className="flex justify-between items-start mb-2">
//                                 <div className="flex items-center gap-2">
//                                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
//                                         <span className="text-gray-600">@</span>
//                                     </div>
//                                     <div>
//                                         <div className="font-medium text-black">{comment.username}</div>
//                                         <div className="text-sm text-gray-500">{comment.date}</div>
//                                     </div>
//                                 </div>
//                                 <div className="text-yellow-500 font-medium">
//                                     Rating: {comment.rating}
//                                 </div>
//                             </div>
//                             <p className="text-gray-700 mt-2">{comment.content}</p>
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default OrderDetailPage;
