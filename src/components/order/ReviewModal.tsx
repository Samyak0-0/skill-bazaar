import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Review } from './type';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviews: Review[];
  orderId: string;
  type: string; // Type parameter for API endpoint
  onReviewAdded?: (review: Review) => void;
}

export default function ReviewModal({ 
  isOpen, 
  onClose, 
  reviews, 
  orderId,
  type, // Include type in destructuring
  onReviewAdded 
}: ReviewModalProps) {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug session state
  useEffect(() => {
    console.log('Session status:', status);
    console.log('Session data:', session);
  }, [session, status]);

  if (!isOpen) return null;

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check for both session and user data
    if (!session || !session.user) {
      setError('You must be logged in to submit a review');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Use the type parameter in the API endpoint
      const response = await fetch(`/api/orders/${type}/${orderId}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',  // Important for sending session cookies
        body: JSON.stringify({
          rating,
          comment
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      const newReview = await response.json();
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

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Reviews</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {status === "authenticated" && session?.user ? (
          <form onSubmit={handleSubmitReview} className="mb-6 border-b pb-6">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Comment</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            {error && (
              <p className="text-red-500 mb-4">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        ) : (
          <div className="mb-6 border-b pb-6 text-center text-red-500">
            You must be logged in to submit a review
          </div>
        )}

        {/* Reviews display */}
        {!reviews || reviews.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No reviews yet</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-500">
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
  );
}