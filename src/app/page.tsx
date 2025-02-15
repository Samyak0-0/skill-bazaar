// app/page.tsx
"use client";
import { useContext, useEffect, useState } from 'react';
import Home_page from "../components/home_page/Home_page";
import Create_order from "../components/home_page/create_order";
import { useSession } from 'next-auth/react';
import { MessagingContext } from '@/provider/MessagingContext';
import { User } from 'lucide-react';

export default function Home() {
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const {data} = useSession();
  const {setUserId} = useContext(MessagingContext)

  useEffect(() => {
    const fetchId = async () => {
      if (data?.user?.email) {
        try {
          const response = await fetch(`/api/userId?mail=${data.user.email}`);
          const result = await response.json();
          
          setUserId(result.userId); // Correctly update state
        } catch (error) {
          console.error("Error fetching user ID:", error);
        }
      }
    };
    fetchId();
  }, [data?.user?.email, setUserId]);

  return (
    <div className="relative">
      {/* Navigation Button */}
      <div className="absolute top-6 right-20 z-10 pr-6">
        <button 
          onClick={() => setShowCreateOrder(!showCreateOrder)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {showCreateOrder ? 'Back to Home' : 'Create Request'}
        </button>
      </div>

      {/* Conditional Rendering */}
      {showCreateOrder ? (
        <Create_order />
      ) : (
        <Home_page />
      )}
    </div>
  );
}