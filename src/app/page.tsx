// app/page.tsx
"use client";
import { useState } from 'react';
import Home_page from "../components/home_page/Home_page";
import Create_order from "../components/home_page/create_order";

export default function Home() {
  const [showCreateOrder, setShowCreateOrder] = useState(false);

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