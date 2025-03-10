// app/orders/page.tsx
"use client";
import React, { useState } from "react";
import Sold from "./sold";
import Bought from "./bought";

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"sold" | "bought">("sold");
  const [hoveredTab, setHoveredTab] = useState<"sold" | "bought" | null>(null);

  return (
    <div className="w-full h-screen flex flex-col bg-[#f2f2f2] font-sans">
      <main className="flex-1 flex flex-col p-6 overflow-hidden">
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-100 rounded-t-lg sticky top-0 z-10 bg-white">
            {["sold", "bought"].map((tab) => (
              <button
                key={tab}
                className={`flex-1 py-5 font-medium text-center transition-all duration-300 relative
                  ${activeTab === tab 
                    ? 'text-[#0cb9c1] bg-white' 
                    : 'text-gray-600 hover:bg-gray-50'}`}
                onClick={() => setActiveTab(tab as "sold" | "bought")}
                onMouseEnter={() => setHoveredTab(tab as "sold" | "bought")}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <span className="text-lg">{tab === "sold" ? "Sold" : "Bought"}</span>
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[#0cb9c1]"></span>
                )}
                {hoveredTab === tab && activeTab !== tab && (
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-[rgba(12,185,193,0.3)]"></span>
                )}
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