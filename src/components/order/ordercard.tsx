// components/OrderCard.tsx
import React, { useState } from "react";
import { OrderCardProps } from "./type";

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'IN PROGRESS':
      return 'bg-blue-100 text-blue-800';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function OrderCard({ username, skill, work, status, date, reviews }: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const statusColor = getStatusColor(status);

  return (
    <div
      className={`flex justify-between bg-gray-100 p-4 my-2 rounded-lg shadow-md transition-transform duration-300 ${
        isHovered ? 'transform scale-[1.015] shadow-lg' : ''
      }`}
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
      <div className="text-right">
        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
          {status}
        </span>
<<<<<<< HEAD
        <p className="mt-2 text-gray-600">Date: {date}</p>
        <div className="flex items-center justify-end gap-2 mt-2">
          <span className="text-gray-600">{reviews} reviews</span>
          <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 transition-colors">
=======
        <p className="mt-2 text-black">Date: {date}</p>
        <div className="flex items-center justify-end gap-2 mt-2">
          <span className="text-black">{reviews} reviews</span>
          <button className="px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors">
>>>>>>> 2a6ac8313e6eee4963fc3b77e4240d46c18ddd4e
            View Reviews
          </button>
        </div>
      </div>
    </div>
  );
}