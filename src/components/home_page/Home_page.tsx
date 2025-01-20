//Home_page.tsx
import React, { useEffect, useState } from 'react';
import { ChevronRight, Loader2, X } from "lucide-react";

import { useRouter } from 'next/navigation';//for orderdetails page nav


interface OrderData {
  id: string;
  workTitle: string;
  description: string;
  rate: string;
  category: string;
  serviceId: string;
  buyerId: string;
  sellerId: string;
  status: string;
}

const Home_page = () => {
  const router = useRouter();//agaiin for orderdetail page nav
  const recommendedScrollContainer = React.useRef<HTMLDivElement>(null);
  const categoryScrollContainer = React.useRef<HTMLDivElement>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const [categoryOrders, setCategoryOrders] = useState<OrderData[]>([]);

  // Fetch all orders for the recommended section
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data.orders || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Fetch category-specific orders when a category is selected
  useEffect(() => {
    const fetchCategoryOrders = async () => {
      if (!selectedCategory) {
        setCategoryOrders([]);
        return;
      }

      try {
        setIsChangingCategory(true);
        const response = await fetch(`/api/orders?category=${selectedCategory}`);
        if (!response.ok) {
          throw new Error('Failed to fetch category orders');
        }
        const data = await response.json();
        setCategoryOrders(data.orders || data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch category orders');
      } finally {
        setTimeout(() => {
          setIsChangingCategory(false);
        }, 300);
      }
    };

    fetchCategoryOrders();
  }, [selectedCategory]);

  const scroll = (direction: 'left' | 'right', containerRef: React.RefObject<HTMLDivElement>) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -15 : 15;
      containerRef.current.scrollBy({ left: scrollAmount * 16, behavior: 'smooth' });
    }
  };

  // Get unique categories from all orders
  const availableCategories = [...new Set(orders.map(order => order.category))];

  const OrdersSection = ({ title, orders, scrollContainerRef, isLoading }: {
    title: string;
    orders: OrderData[];
    scrollContainerRef: React.RefObject<HTMLDivElement>;
    isLoading?: boolean;
  }) => (
    <div className="mb-8 relative">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-3xl font-bold text-white pt-2">{title}</h2>
        {isLoading && (
          <Loader2 className="animate-spin w-6 h-6 text-blue-500 mt-2" />
        )}
      </div>
      <div className="relative">
        <div 
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pr-4 pb-4 pt-4 scrollbar-hide"
        >
          {orders.map((order, index) => (
          <div 
            key={index} 
            onClick={() => router.push(`/orderdetails/${order.id}`)}
            className={`min-w-[18.75rem] h-[14.0625rem] p-4 mt-3 mb-2 border rounded-lg shadow-sm transition-all duration-500 cursor-pointer bg-gray-300 hover:scale-105 ${isLoading ? 'opacity-50' : 'opacity-100'} animate-fadeIn`}
            style={{
            animationDelay: `${index * 100}ms`
          }}
          >
          <h3 className="font-medium mb-3 text-black">Work: {order.workTitle}</h3>
          <p className="font-medium text-black mb-4">Description: {order.description}</p>
          <p className="font-medium text-black mb-5">Rate: {order.rate}</p>
          <p className="font-medium text-black">Category: {order.category}</p>
          </div>
          ))}
          {/* {orders.map((order, index) => (
            <div 
              key={index} 
              className={`min-w-[18.75rem] h-[14.0625rem] p-4 mt-3 mb-2 border rounded-lg shadow-sm transition-all duration-500 cursor-pointer bg-gray-300 hover:scale-105 ${isLoading ? 'opacity-50' : 'opacity-100'} animate-fadeIn`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <h3 className="font-medium mb-3 text-black">Work: {order.workTitle}</h3>
              <p className="font-medium text-black mb-4">Description: {order.description}</p>
              <p className="font-medium text-black mb-5">Rate: {order.rate}</p>
              <p className="font-medium text-black">Category: {order.category}</p>
            </div>
          ))} */}
          {isLoading && orders.length === 0 && (
            <div className="flex items-center justify-center w-full h-[14.0625rem]">
              <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
            </div>
          )}
        </div>

        <button 
          onClick={() => scroll('right', scrollContainerRef)} 
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black rounded-full p-2 shadow-md"
        >
          <ChevronRight size={10} />
        </button>
      </div>
    </div>
  );

  return (
    <div className="pt-4 px-2 sm:px-4 lg:px-6 w-full max-w-[1350px] mx-auto">
      <OrdersSection 
        title="Recommended" 
        orders={orders} 
        scrollContainerRef={recommendedScrollContainer}
        isLoading={loading}
      />

      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl font-bold text-white">Categories</h2>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors duration-200"
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {availableCategories.map((category, index) => (
            <div
              key={index}
              onClick={() => setSelectedCategory(
                category === selectedCategory ? null : category
              )}
              className={`font-medium min-w-[9.375rem] p-4 border rounded-lg shadow-sm transition-all duration-300 cursor-pointer bg-gray-300 text-black text-center hover:scale-105 hover:shadow-lg ${
                selectedCategory === category ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:bg-gray-200'
              }`}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <OrdersSection 
          title={`${selectedCategory} Orders`}
          orders={categoryOrders}
          scrollContainerRef={categoryScrollContainer}
          isLoading={isChangingCategory}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Home_page;
// "use client";
// import React, { useEffect, useState } from 'react';
// import { ChevronRight, Loader2, X } from "lucide-react";

// interface OrderData {
//   workTitle: string;
//   description: string;
//   rate: string;
//   category: string;
//   serviceId: string;
//   buyerId: string;
//   sellerId: string;
//   status: string;
// }

// const Home_page = () => {
//   const scrollContainer = React.useRef<HTMLDivElement>(null);
//   const [orders, setOrders] = useState<OrderData[]>([]);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [isChangingCategory, setIsChangingCategory] = useState(false);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         setIsChangingCategory(true);
//         const url = selectedCategory 
//           ? `/api/orders?category=${selectedCategory}`
//           : '/api/orders';
        
//         const response = await fetch(url);
//         if (!response.ok) {
//           throw new Error('Failed to fetch orders');
//         }
//         const data = await response.json();
//         setOrders(data.orders || data);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'Failed to fetch orders');
//       } finally {
//         setLoading(false);
//         setTimeout(() => {
//           setIsChangingCategory(false);
//         }, 300);
//       }
//     };

//     fetchOrders();
//   }, [selectedCategory]);

//   const scroll = (direction: 'left' | 'right') => {
//     if (scrollContainer.current) {
//       const scrollAmount = direction === 'left' ? -15 : 15;
//       scrollContainer.current.scrollBy({ left: scrollAmount * 16, behavior: 'smooth' });
//     }
//   };

//   // Get unique categories from actual orders
//   const availableCategories = [...new Set(orders.map(order => order.category))];

//   const displayedOrders = selectedCategory 
//     ? orders.filter(order => order.category === selectedCategory)
//     : orders;

//   return (
//     <div className="pt-4 px-2 sm:px-4 lg:px-6 w-full max-w-[1350px] mx-auto">
//       <div className="mb-8 relative">
//         <div className="flex items-center gap-3 mb-4">
//           <h2 className="text-3xl font-bold text-white pt-2">
//             {selectedCategory ? selectedCategory : 'Recommended'}
//           </h2>
//           {isChangingCategory && (
//             <Loader2 className="animate-spin w-6 h-6 text-blue-500 mt-2" />
//           )}
//         </div>
//         <div className="relative">
//           <div 
//             ref={scrollContainer}
//             className="flex gap-4 overflow-x-auto pr-4 pb-4 pt-4 scrollbar-hide"
//           >
//             {displayedOrders.map((order, index) => (
//               <div 
//                 key={index} 
//                 className={`min-w-[18.75rem] h-[14.0625rem] p-4 mt-3 mb-2 border rounded-lg shadow-sm transition-all duration-500 cursor-pointer bg-gray-300 hover:scale-105 ${isChangingCategory ? 'opacity-50' : 'opacity-100'} animate-fadeIn`}
//                 style={{
//                   animationDelay: `${index * 100}ms`
//                 }}
//               >
//                 <h3 className="font-medium mb-3 text-black">Work: {order.workTitle}</h3>
//                 <p className="font-medium text-black mb-4">Description: {order.description}</p>
//                 <p className="font-medium text-black mb-5">Rate: {order.rate}</p>
//                 <p className="font-medium text-black">Category: {order.category}</p>
//               </div>
//             ))}
//             {isChangingCategory && displayedOrders.length === 0 && (
//               <div className="flex items-center justify-center w-full h-[14.0625rem]">
//                 <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
//               </div>
//             )}
//           </div>

//           <button 
//             onClick={() => scroll('right')} 
//             className="absolute right-0 top-1/2 -translate-y-1/2 bg-black rounded-full p-2 shadow-md"
//           >
//             <ChevronRight size={10} />
//           </button>
//         </div>
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.5s ease-out forwards;
//         }
//       `}</style>

//       <div>
//         <div className="flex items-center gap-4 mb-4">
//           <h2 className="text-3xl font-bold text-white">Categories</h2>
//           {selectedCategory && (
//             <button
//               onClick={() => setSelectedCategory(null)}
//               className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm transition-colors duration-200"
//             >
//               <X size={14} />
//               Clear
//             </button>
//           )}
//         </div>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
//           {availableCategories.map((category, index) => (
//             <div
//               key={index}
//               onClick={() => setSelectedCategory(
//                 category === selectedCategory ? null : category
//               )}
//               className={`font-medium min-w-[9.375rem] p-4 border rounded-lg shadow-sm transition-all duration-300 cursor-pointer bg-gray-300 text-black text-center hover:scale-105 hover:shadow-lg ${
//                 selectedCategory === category ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:bg-gray-200'
//               }`}
//             >
//               {category}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home_page;
