import React, { useState } from "react";
import { OrderCardProps } from "./type";

export default function OrderCard({ username, skill, work, status, date, reviews }: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`flex justify-between bg-gray-100 p-4 my-2 rounded-lg shadow-md transition-transform duration-300 ${isHovered ? 'transform scale-[1.015] shadow-lg' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex gap-4">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
          👤
        </div>
        <div>
          <p><strong>Username</strong>: {username}</p>
          <p><strong>Skill</strong>: {skill}</p>
          <p><strong>Work</strong>: {work}</p>
        </div>
      </div>
      <div>
        <p><strong>Status</strong>: {status}</p>
        <p>Date: {date}</p>
        <div className="flex items-center gap-2">
          ⭐⭐⭐⭐☆ {reviews} 
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
            REVIEWS
          </button>
        </div>
      </div>
    </div>
  );
}