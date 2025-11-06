'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Star } from 'lucide-react';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const order = useQuery(
    api.orders.getOrder,
    orderId ? { orderId: orderId as any } : 'skip'
  );

  const createReview = useMutation(api.orders.createReview);

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (order === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d87d4a]"></div>
      </div>
    );
  }

  if (!order || !order.deliveryConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Unable to Review</h2>
          <p className="text-gray-600 mb-6">
            This order must be delivered and confirmed before you can leave a
            review.
          </p>
          <button onClick={() => router.push('/track-order')} className="btn">
            Track Orders
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct) {
      alert('Please select a product to review');
      return;
    }

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);

    try {
      const product = order.items.find(
        (item: any) => item.id === selectedProduct
      );

      await createReview({
        orderId: order._id as any,
        productId: selectedProduct,
        productName: product?.name || '',
        customerName: order.customer.name,
        customerEmail: order.customer.email,
        rating,
        title,
        comment,
      });

      alert('Thank you for your review!');
      router.push('/track-order');
    } catch (error: any) {
      alert(error.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-md p-8">
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-wider">
            Write a Review
          </h1>
          <p className="text-gray-600 mb-8">
            Share your experience with the products you purchased
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Select Product <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                      selectedProduct === item.id
                        ? 'border-[#d87d4a] bg-orange-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="product"
                      value={item.id}
                      checked={selectedProduct === item.id}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-4 h-4 text-[#d87d4a]"
                    />
                    <div className="flex-1">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    </div>
                    <p className="font-semibold">${item.price.toFixed(2)}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold mb-3">
                Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 transition ${
                        star <= (hoveredRating || rating)
                          ? 'fill-[#d87d4a] text-[#d87d4a]'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="mt-2 text-sm text-gray-600">
                  {rating === 1 && 'Poor'}
                  {rating === 2 && 'Fair'}
                  {rating === 3 && 'Good'}
                  {rating === 4 && 'Very Good'}
                  {rating === 5 && 'Excellent'}
                </p>
              )}
            </div>

            {/* Review Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Review Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Sum up your experience in a few words"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                required
                maxLength={100}
              />
              <p className="text-sm text-gray-500 mt-1">
                {title.length}/100 characters
              </p>
            </div>

            {/* Review Comment */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Your Review <span className="text-red-500">*</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience with this product..."
                rows={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] resize-none"
                required
                maxLength={1000}
              />
              <p className="text-sm text-gray-500 mt-1">
                {comment.length}/1000 characters
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-[#d87d4a] text-white py-3 rounded-lg font-semibold uppercase tracking-widest hover:bg-[#fbaf85] transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
