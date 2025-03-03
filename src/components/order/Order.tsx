// app/orders/page.tsx
"use client";
import React, { useState } from "react";
import Sold from "./sold";
import Bought from "./bought";

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"sold" | "bought">("sold");
  const [hoveredTab, setHoveredTab] = useState<"sold" | "bought" | null>(null);

  
  return (
    <div className="w-full h-screen flex flex-col bg-gray-50 font-sans">
    
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
          {/* Tabs */}
          <div className="flex bg-gray-50 border-b border-gray-100 rounded-t-lg sticky top-0 z-10">
            {["sold", "bought"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-4 font-medium text-center transition-colors
                  ${activeTab === tab ? 'bg-teal-100 text-teal-600' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setActiveTab(tab as "sold" | "bought")}
                onMouseEnter={() => setHoveredTab(tab as "sold" | "bought")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                {tab === "sold" ? "Sold" : "Bought"}
              </button>
            ))}
          </div>

          {/* Content Area - Fills remaining height */}
          <div className="p-6 rounded-b-xl flex-1 overflow-y-auto">
            <div className="p-1">
              {activeTab === "sold" ? <Sold /> : <Bought />}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}