'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Star } from 'lucide-react';

export default function ProductReviews({ productId }: { productId: string }) {
  const reviews = useQuery(api.orders.getProductReviews, { productId });

  if (reviews === undefined) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d87d4a]"></div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No reviews yet for this product.</p>
        <p className="text-sm mt-1 italic">Be the first to review it!</p>
      </div>
    );
  }

  return (
    <section className="mt-12 space-y-6">
      <h3 className="text-2xl font-semibold text-center md:text-left">
        Customer Reviews
      </h3>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={18}
                  className={`${
                    star <= review.rating
                      ? 'text-[#d87d4a] fill-[#d87d4a]'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Title */}
            <h4 className="font-semibold text-lg text-gray-800">
              {review.title}
            </h4>

            {/* Comment */}
            <p className="text-gray-600 mt-2 text-sm leading-relaxed">
              {review.comment}
            </p>

            {/* Customer */}
            <p className="text-sm text-gray-500 mt-4 italic">
              — {review.customerName || 'Anonymous'}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
