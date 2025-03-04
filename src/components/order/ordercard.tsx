import React, { useState } from "react";
import { OrderCardProps, Review } from "./type";
import ReviewModal from "./ReviewModal";

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

export default function OrderCard({ 
  username, 
  category, 
  work, 
  status, 
  date, 
  reviews: initialReviewCount, 
  orderId,
  type = 'bought' // Default type parameter (either 'bought' or 'sold')
}: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const statusColor = getStatusColor(status);

  const handleViewReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the type parameter in the API call
      const response = await fetch(`/api/orders/${type}/${orderId}/reviews`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Error: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data: Review[] = await response.json();
      setReviewsData(data);
      setShowReviews(true);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = (newReview: Review) => {
    setReviewsData(prevReviews => [newReview, ...prevReviews]);
    setReviewCount(prevCount => prevCount + 1);
  };

  const handleCloseModal = () => {
    setShowReviews(false);
    setError(null);
  };

  return (
    <>
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
            <p><strong>Category</strong>: {category}</p>
            <p><strong>Work</strong>: {work}</p>
          </div>
        </div>
        <div className="text-right">
          <span 
            className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
          >
            {status}
          </span>
          <p className="mt-2 text-black">Date: {date}</p>
          <div className="flex items-center justify-end gap-2 mt-2">
            <span className="text-black">{reviewCount} reviews</span>
            <button 
              className={`px-3 py-1 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              onClick={handleViewReviews}
              disabled={loading}
              aria-label="Reviews"
            >
              {loading ? 'Loading...' : 'Reviews'}
            </button>
          </div>
          {error && (
            <p className="text-red-500 text-sm mt-1" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>

      <ReviewModal
        isOpen={showReviews}
        onClose={handleCloseModal}
        reviews={reviewsData}
        orderId={orderId}
        type={type} // Pass the type prop to ReviewModal
        onReviewAdded={handleReviewAdded}
      />
    </>
  );
}