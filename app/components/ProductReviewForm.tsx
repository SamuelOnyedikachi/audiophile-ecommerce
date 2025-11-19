// 'use client';

// import { useState } from 'react';
// import { useMutation } from 'convex/react';
// import { api } from '@/convex/_generated/api';
// import { Star } from 'lucide-react';

// interface ProductReviewFormProps {
//   productId: string;
//   productName: string;
//   orderId: string;
//   customerEmail: string;
// }

// export default function ProductReviewForm({
//   productId,
//   productName,
//   orderId,
//   customerEmail,
// }: ProductReviewFormProps) {
//   const createReview = useMutation(api.orders.createReview);
//   const [rating, setRating] = useState(0);
//   const [hoverRating, setHoverRating] = useState(0);
//   const [name, setName] = useState('');
//   const [title, setTitle] = useState('');
//   const [comment, setComment] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!rating || !title || !comment || !name) {
//       alert('Please fill in all fields and select a rating.');
//       return;
//     }

//     setLoading(true);
//     try {
//       await createReview({
//         orderId,
//         productId,
//         productName,
//         customerName: name,
//         customerEmail,
//         rating,
//         title,
//         comment,
//       });

//       setSuccess(true);
//       setRating(0);
//       setTitle('');
//       setComment('');
//       setName('');
//     } catch (error) {
//       console.error('Failed to submit review:', error);
//       alert('Failed to submit review. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
//       <h3 className="text-xl font-semibold mb-6 text-center md:text-left">
//         Write a Review
//       </h3>

//       {success && (
//         <p className="text-green-600 mb-4 text-sm">
//           ✅ Review submitted successfully! It will appear shortly.
//         </p>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-5">
//         {/* Name */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Your Name
//           </label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             placeholder="e.g. Samuel O."
//             className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#d87d4a] focus:border-[#d87d4a]"
//           />
//         </div>

//         {/* Title */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Review Title
//           </label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             placeholder="e.g. Amazing sound quality!"
//             className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#d87d4a] focus:border-[#d87d4a]"
//           />
//         </div>

//         {/* Rating */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Rating
//           </label>
//           <div className="flex items-center gap-2">
//             {[1, 2, 3, 4, 5].map((star) => (
//               <Star
//                 key={star}
//                 size={24}
//                 onClick={() => setRating(star)}
//                 onMouseEnter={() => setHoverRating(star)}
//                 onMouseLeave={() => setHoverRating(0)}
//                 className={`cursor-pointer transition ${
//                   star <= (hoverRating || rating)
//                     ? 'text-[#d87d4a] fill-[#d87d4a]'
//                     : 'text-gray-300'
//                 }`}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Comment */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Your Review
//           </label>
//           <textarea
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             rows={4}
//             placeholder="Share your experience with this product..."
//             className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-[#d87d4a] focus:border-[#d87d4a]"
//           />
//         </div>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-[#d87d4a] text-white px-6 py-2.5 rounded-lg hover:bg-[#b8653b] transition disabled:opacity-50"
//         >
//           {loading ? 'Submitting...' : 'Submit Review'}
//         </button>
//       </form>
//     </div>
//   );
// }
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';

interface ProductReviewFormProps {
  productId: string;
  productName?: string;
  orderId?: string;
  customerEmail?: string;
}

export default function ProductReviewForm({
  productId,
  productName = '',
  orderId = '',
  customerEmail = '',
}: ProductReviewFormProps) {
  const createReview = useMutation(api.orders.createReview);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(customerEmail);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!rating || !title || !comment || !name || !email) {
      const msg = ' Please fill in all fields and select a rating to continue.';
      setError(msg);
      console.warn(' Review Validation:', msg);
      toast.warning(msg);
      return;
    }

    // If orderId is missing, show message to user
    if (!orderId) {
      const msg =
        '📦 You must complete a purchase first to leave a review. Shop now!';
      setError(msg);
      console.warn(' No Order Found:', msg);
      toast.info(msg);
      return;
    }

    setLoading(true);

    try {
      console.log('  Submitting review with data:', {
        orderId,
        productId,
        productName,
        customerName: name,
        customerEmail: email,
        rating: Number(rating),
        title,
        comment,
      });

      const reviewData = {
        orderId: orderId as unknown as Id<'orders'>,
        productId,
        productName,
        customerName: name,
        customerEmail: email,
        rating: Number(rating),
        title,
        comment,
      };

      await createReview(reviewData);

      setSuccess(true);
      setRating(0);
      setTitle('');
      setComment('');
      setName('');
      setEmail('');
      console.log('✅ Review submitted successfully!');
      toast.success(
        '⭐ Thank you! Your review has been submitted and will appear shortly.'
      );

      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error('❌ Failed to submit review:', error);

      // Provide detailed error message
      let errorMessage = 'Failed to submit review. ';
      if (error instanceof Error) {
        errorMessage += error.message;
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }

      const fullMsg =
        errorMessage + ' Please check the browser console for more details.';
      setError(fullMsg);
      console.error(' Review Submission Failed:', errorMessage);
      toast.warning(' Could not submit your review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If user hasn't completed an order, show limited info
  if (!orderId || !customerEmail) {
    return (
      <div className="mt-12 bg-gray-50 border border-gray-300 rounded-2xl p-8 shadow-sm">
        <h3 className="text-xl font-semibold mb-4 text-center md:text-left">
          Write a Review
        </h3>
        <p className="text-gray-600 text-center md:text-left">
          You must complete a purchase to leave a review.
          <Link
            href="/checkout"
            className="text-[#d87d4a] font-semibold hover:underline"
          >
            {' '}
            Start shopping
          </Link>
        </p>
      </div>
    );
  }

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

      {error && <p className="text-red-600 mb-4 text-sm">❌ {error}</p>}

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
