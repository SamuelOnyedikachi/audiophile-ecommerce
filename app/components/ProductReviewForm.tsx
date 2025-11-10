
'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Star } from 'lucide-react';

interface ProductReviewFormProps {
  productId: string;
  productName: string;
  orderId: string;
  customerEmail: string;
}

export default function ProductReviewForm({
  productId,
  productName,
  orderId,
  customerEmail,
}: ProductReviewFormProps) {
  const createReview = useMutation(api.orders.createReview);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !title || !comment || !name) {
      alert('Please fill in all fields and select a rating.');
      return;
    }

    setLoading(true);
    try {
      await createReview({
        orderId,
        productId,
        productName,
        customerName: name,
        customerEmail,
        rating,
        title,
        comment,
      });

      setSuccess(true);
      setRating(0);
      setTitle('');
      setComment('');
      setName('');
    } catch (error) {
      console.error('Failed to submit review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
      <h3 className="text-xl font-semibold mb-6 text-center md:text-left">
        Write a Review
      </h3>

      {success && (
        <p className="text-green-600 mb-4 text-sm">
          ✅ Review submitted successfully! It will appear shortly.
        </p>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Samuel O."
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#d87d4a] focus:border-[#d87d4a]"
          />
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Review Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Amazing sound quality!"
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#d87d4a] focus:border-[#d87d4a]"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={24}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`cursor-pointer transition ${
                  star <= (hoverRating || rating)
                    ? 'text-[#d87d4a] fill-[#d87d4a]'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Review
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this product..."
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#d87d4a] focus:border-[#d87d4a]"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#d87d4a] text-white px-6 py-2.5 rounded-lg hover:bg-[#b8653b] transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
