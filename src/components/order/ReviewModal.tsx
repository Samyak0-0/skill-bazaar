import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Review, OrderType } from './type';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  orderId: string;
  purchasedOrderId?: string; // Add purchasedOrderId prop
  type: OrderType; // Use the OrderType from the types file
  onReviewAdded?: (review: Review) => void;
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  reviews, 
  orderId,
  type,
  onReviewAdded 
}: ReviewModalProps) {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  if (!isOpen) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session || !session.user) {
      setError('You must be logged in to submit a review');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Fixed API endpoint to match the route definition (/review instead of /reviews)
      const response = await fetch(`/api/orders/${type}/${orderId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating,
          comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const newReview: Review = await response.json();
      if (onReviewAdded) {
        onReviewAdded(newReview);
      }
      setComment('');
      setRating(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const canSubmitReview = type === 'bought' && status === "authenticated" && session?.user;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header with the specified teal color */}
        <div className="bg-[#0cb9c1] px-6 py-4 rounded-t-lg flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">Reviews</h2>
          <button 
            onClick={onClose}
            className="text-[#0cb9c1] hover:text-[#0aa9b1] bg-white w-8 h-8 rounded-full flex items-center justify-center shadow transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="p-6">
          {/* Show review form only for buyers */}
          {canSubmitReview ? (
            <form onSubmit={handleSubmitReview} className="mb-6 border-b pb-6">
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-colors ${star <= rating ? 'text-[#0cb9c1]' : 'text-[#f2f2f2]'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2 font-medium">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring focus:ring-[rgba(12,185,193,0.3)] focus:border-[#0cb9c1] text-black transition-all outline-none"
                  rows={3}
                  placeholder="Share your experience..."
                  required
                />
              </div>
              {error && (
                <p className="text-red-500 mb-4 px-4 py-2 bg-red-50 rounded-lg">{error}</p>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-[#0cb9c1] text-white rounded-lg hover:bg-[#0aa9b1] transition-colors font-medium ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : type === 'sold' ? (
            <div className="mb-6 border-b pb-6 px-4 py-3 bg-[rgba(192, 252, 255, 0.93)] text-[#0cb9c1] rounded-lg text-center">
              As a seller, you can view reviews but cannot submit them
            </div>
          ) : (
            <div className="mb-6 border-b pb-6 px-4 py-3 bg-red-50 text-red-600 rounded-lg text-center">
              You must be logged in to submit a review
            </div>
          )}

          {/* Reviews display */}
          <h3 className="font-medium text-lg mb-4 text-gray-800">Customer Feedback</h3>
          {!reviews || reviews.length === 0 ? (
            <div className="bg-[#f2f2f2] rounded-lg p-6 text-gray-600 text-center">
              <p>No reviews yet</p>
              <p className="text-sm mt-2">Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 hover:bg-[rgba(12,185,193,0.05)] p-3 rounded-lg transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={i < review.rating ? "text-[#0cb9c1]" : "text-[#f2f2f2]"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-500 text-sm">
                      by {review.reviewer.name} • {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}