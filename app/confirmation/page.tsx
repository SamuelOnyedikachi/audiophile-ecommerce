'use client';

import { useSearchParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Suspense } from 'react';

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params?.get('orderId');

  // Use Convex query directly
  const order = useQuery(
    api.orders.getOrder,
    orderId ? { orderId: orderId as any } : 'skip'
  );

  if (!orderId) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 text-lg">No order ID provided.</p>
        <Link href="/" className="mt-6 inline-block btn">
          Go Home
        </Link>
      </div>
    );
  }

  if (order === undefined) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#d87d4a]"></div>
        <p className="mt-4 text-gray-600">Loading your order...</p>
      </div>
    );
  }

  if (order === null) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 text-lg mb-4">Order not found.</p>
        <p className="text-gray-600 mb-8">
          We couldn't find the order you're looking for.
        </p>
        <Link href="/" className="btn inline-block">
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <section className="py-12 max-w-4xl mx-auto px-6">
      {/* Success Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#d87d4a] rounded-full mb-6">
          <CheckCircle className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase">
          Thank You, {order.customer?.name}!
        </h1>
        <p className="text-gray-600 text-lg">
          Your order has been placed successfully
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Order ID: <span className="font-mono font-semibold">{orderId}</span>
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Shipping Information */}
        <div className="p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-4 text-[#d87d4a] uppercase tracking-wider">
            Shipping Information
          </h2>
          <div className="space-y-1 text-gray-700">
            <p className="font-semibold">{order.customer?.name}</p>
            <p>{order.customer?.email}</p>
            <p>{order.customer?.phone}</p>
            <p className="mt-3">
              {order.shipping?.address}
              <br />
              {order.shipping?.city}, {order.shipping?.zipcode}
              <br />
              {order.shipping?.country}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="p-6 md:p-8 border-b">
          <h2 className="text-xl font-bold mb-4 text-[#d87d4a] uppercase tracking-wider">
            Order Items
          </h2>
          <ul className="space-y-4">
            {order.items?.map((item: any, index: number) => (
              <li
                key={index}
                className="flex justify-between items-center py-3 border-b last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                </div>
                <p className="font-bold text-gray-900">
                  ${(item.price * item.qty).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        </div>

        {/* Order Summary */}
        <div className="p-6 md:p-8 bg-[#f1f1f1]">
          <h2 className="text-xl font-bold mb-4 text-[#d87d4a] uppercase tracking-wider">
            Order Summary
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-semibold">
                ${order.totals?.subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className="font-semibold">
                ${order.totals?.shipping.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Taxes</span>
              <span className="font-semibold">
                ${order.totals?.taxes.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t-2 border-gray-300">
              <span>Grand Total</span>
              <span className="text-[#d87d4a]">
                ${order.totals?.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-gray-600 mb-4">
          A confirmation email has been sent to{' '}
          <span className="font-semibold">{order.customer?.email}</span>
        </p>
        <p className="text-sm text-gray-500 mb-8">
          If you have any questions, please contact our support team.
        </p>
        <Link
          href="/"
          className="btn inline-block bg-[#d87d4a] text-white px-8 py-3 rounded-lg font-semibold uppercase tracking-widest hover:bg-[#fbaf85] transition"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#d87d4a]"></div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}