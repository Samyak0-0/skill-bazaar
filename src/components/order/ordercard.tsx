import React, { useState } from "react";
import { OrderCardProps, Review, OrderType } from "./type";
import ReviewModal from "./ReviewModal";

const getStatusColor = (status: string) => {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
      return 'bg-teal-100 text-teal-800';
    case 'IN PROGRESS':
      return 'bg-cyan-100 text-cyan-800';
    case 'PENDING':
      return 'bg-amber-100 text-amber-800';
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
  type = 'bought', // Default type parameter
  purchasedOrderId // Add this new prop
}: OrderCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const [reviewCount, setReviewCount] = useState(initialReviewCount);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(status);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const statusColor = getStatusColor(currentStatus);
  
  // Determine if status can be changed
  // For sold orders: seller can change when not completed
  // For bought orders: buyer cannot change status (can be modified if needed)
  const canChangeStatus = type === 'sold' && currentStatus.toUpperCase() !== 'COMPLETED';
  
  // Get the next status based on current status
  const getNextStatus = (currentStatus: string): string => {
    switch (currentStatus.toUpperCase()) {
      case 'PENDING':
        return 'IN PROGRESS';
      case 'IN PROGRESS':
        return 'COMPLETED';
      default:
        return currentStatus;
    }
  };
  
  const handleStatusChange = async () => {
    if (!canChangeStatus) return;
    
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus === currentStatus) return;
    
    setIsUpdatingStatus(true);
    setError(null);
    
    try {
      // Updated to include purchasedOrderId in the request body
      const response = await fetch(`/api/orders/${type}/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          status: nextStatus,
          purchasedOrderId: purchasedOrderId // Include the purchasedOrderId in the request
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update status');
      }
      
      const updatedOrder = await response.json();
      
      // Update the UI with the new status
      // Check for purchasedOrderStatus which is in our transformed response
      if (updatedOrder.purchasedOrderStatus) {
        setCurrentStatus(updatedOrder.purchasedOrderStatus);
      } else if ('status' in updatedOrder) {
        setCurrentStatus(updatedOrder.status);
      } else {
        console.error('Unexpected response structure:', updatedOrder);
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      console.error('Error updating status:', err);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleViewReviews = async () => {
    setLoading(true);
    setError(null);

    try {
      // Updated to include purchasedOrderId if available
      let url = `/api/orders/${type}/${orderId}/reviews`;
      if (purchasedOrderId) {
        url += `?purchasedOrderId=${purchasedOrderId}`;
      }
      
      const response = await fetch(url);
      
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

  // Set button text based on user type
  const reviewButtonText = type === 'bought' ? 'Review & View' : 'View Reviews';

  return (
    <>
      <div
        className={`bg-teal-50 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition duration-200 overflow-hidden p-5
          ${isHovered ? 'transform scale-[1.01]' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 font-semibold text-lg">
              {username.charAt(0)}
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{username}</h3>
              <p className="text-gray-600 text-sm">{category}</p>
              <p className="text-gray-800 mt-1 font-medium">{work}</p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex flex-col items-end justify-center">
              <span 
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
              >
                {currentStatus}
              </span>
              
              {canChangeStatus && (
                <button
                  onClick={handleStatusChange}
                  disabled={isUpdatingStatus}
                  className={`mt-2 px-3 py-1 text-xs bg-teal-500 text-white rounded-full hover:bg-teal-600 transition-colors ${
                    isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isUpdatingStatus ? 'Updating...' : `Mark as ${getNextStatus(currentStatus)}`}
                </button>
              )}
            </div>
            
            <p className="mt-2 text-gray-500 text-sm">Date: {date}</p>
            <div className="mt-3 flex items-center justify-end gap-2">
              <div className="flex items-center">
                <span className="text-amber-500 mr-1">★</span>
                <span className="text-gray-600 text-sm">{reviewCount}</span>
              </div>
              <button 
                className={`px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleViewReviews}
                disabled={loading}
                aria-label="Reviews"
              >
                {loading ? 'Loading...' : reviewButtonText}
              </button>
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-1" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={showReviews}
        onClose={handleCloseModal}
        reviews={reviewsData}
        orderId={orderId}
        type={type}
        onReviewAdded={handleReviewAdded}
        purchasedOrderId={purchasedOrderId} // Pass this to ReviewModal as well
      />
    </>
  );
}