"use client";
import React, { useState } from "react";
import Sold from "./sold";
import Bought from "./bought";

export default function Orders() {
  const [activeTab, setActiveTab] = useState<"sold" | "bought">("sold");
  const [hoveredTab, setHoveredTab] = useState<"sold" | "bought" | null>(null);

  return (
    <div className="w-[98%] mx-auto my-1 bg-black rounded-xl shadow-md overflow-hidden font-sans">
      <div className="flex justify-center bg-gray-300 border-b border-gray-200 rounded-t-lg sticky top-0 z-10">
        {["sold", "bought"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 p-4 font-bold cursor-pointer transition-colors duration-300 text-black
              ${activeTab === tab ? 'bg-gray-500 text-white border-b-2 border-gray-300 rounded-t-lg' : ''}
              ${hoveredTab === tab ? 'bg-gray-400 text-black' : ''}`}
            onClick={() => setActiveTab(tab as "sold" | "bought")}
            onMouseEnter={() => setHoveredTab(tab as "sold" | "bought")}
            onMouseLeave={() => setHoveredTab(null)}
          >
            {tab === "sold" ? "Sold by" : "Bought by"}
          </button>
        ))}
      </div>
      <div className="p-4 bg-black text-center rounded-b-xl max-h-[530px] overflow-y-auto mt-px">
        <div className="p-1">
          {activeTab === "sold" ? <Sold /> : <Bought />}
        </div>
      </div>
    </div>
  );
}