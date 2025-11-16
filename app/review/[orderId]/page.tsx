'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import ProductReviewForm from '@/app/components/ProductReviewForm';
import { ChevronLeft } from 'lucide-react';

import { Id } from '@/convex/_generated/dataModel';

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);

  // Fetch the order using the orderId
  const order = useQuery(api.orders.getOrder, {
    orderId: orderId as Id<'orders'>,
  });

  if (order === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#d87d4a]"></div>
          <p className="mt-4 text-gray-600">Loading your order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t find the order you&apos;re looking for. Please go
            back to track your orders.
          </p>
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 bg-[#d87d4a] text-white px-6 py-3 rounded-lg hover:bg-[#b8653b] transition"
          >
            <ChevronLeft size={20} /> Back to Tracking
          </Link>
        </div>
      </div>
    );
  }

  if (!order.deliveryConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Order Not Yet Delivered
          </h1>
          <p className="text-gray-600 mb-8">
            You can only review products after confirming delivery. Please
            confirm your delivery first from the tracking page.
          </p>
          <Link
            href="/track-order"
            className="inline-flex items-center gap-2 bg-[#d87d4a] text-white px-6 py-3 rounded-lg hover:bg-[#b8653b] transition"
          >
            <ChevronLeft size={20} /> Back to Tracking
          </Link>
        </div>
      </div>
    );
  }

  const selectedProduct = order.items[selectedProductIndex] as unknown as {
    id: string;
    name: string;
    qty: number;
    price: number;
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-[#d87d4a] transition mb-6"
          >
            <ChevronLeft size={20} /> Back
          </button>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Review Your Products
          </h1>
          <p className="text-gray-600">
            Order:{' '}
            <span className="font-mono text-sm bg-gray-200 px-2 py-1 rounded">
              {orderId.slice(0, 12)}...
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Products List */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Products Ordered
              </h2>

              <div className="space-y-2">
                {order.items.map(
                  (
                    item: {
                      id: string;
                      name: string;
                      qty: number;
                      price: number;
                    },
                    index: number
                  ) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedProductIndex(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition ${
                        selectedProductIndex === index
                          ? 'border-[#d87d4a] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      }`}
                    >
                      <p className="font-semibold text-gray-900 text-sm">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Qty: {item.qty}
                      </p>
                    </button>
                  )
                )}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>₦{order.totals.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>₦{order.totals.shipping.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes:</span>
                    <span>₦{order.totals.taxes.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span className="text-[#d87d4a]">
                      ₦{order.totals.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Review Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {selectedProduct.name}
              </h2>
              <p className="text-gray-600 mb-6">
                Share your experience with this product
              </p>

              <ProductReviewForm
                productId={selectedProduct.id}
                productName={selectedProduct.name}
                orderId={orderId}
                customerEmail={order.customer.email}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
