'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { Truck, MapPin, CheckCircle } from 'lucide-react';

export default function TrackOrderPage() {
  const [searchEmail, setSearchEmail] = useState('');
  const [emailInput, setEmailInput] = useState('');

  const orders = useQuery(
    api.orders.getOrdersByEmail,
    searchEmail ? { email: searchEmail } : 'skip'
  );

  const confirmDelivery = useMutation(api.orders.confirmDelivery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchEmail(emailInput.trim());
  };

  const handleConfirmDelivery = async (orderId: string) => {
    try {
      await confirmDelivery({ orderId: orderId as Id<'orders'> });
      alert('✅ Delivery confirmed successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Failed to confirm delivery.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white px-4 sm:px-6 md:px-10 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-3 tracking-wide">
          Track Your Order
        </h1>
        <p className="text-center text-gray-400 mb-8 sm:mb-12 text-sm sm:text-base">
          Enter your email address to view your recent orders and their tracking
          details.
        </p>

        {/* Email Search */}
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-lg mx-auto mb-10 w-full"
        >
          <input
            type="email"
            required
            placeholder="Enter your email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1 w-full bg-[#1E1E1E] border border-gray-700 rounded-xl px-4 py-3 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all text-sm sm:text-base"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-semibold transition-all w-full sm:w-auto text-sm sm:text-base"
          >
            Search
          </button>
        </form>

        {/* Messages */}
        {!searchEmail && (
          <p className="text-gray-500 text-center text-sm sm:text-base">
            Enter your email to see your orders.
          </p>
        )}
        {searchEmail && !orders && (
          <p className="text-gray-400 text-center text-sm sm:text-base">
            Fetching your orders...
          </p>
        )}
        {searchEmail && orders?.length === 0 && (
          <p className="text-gray-500 text-center text-sm sm:text-base">
            No orders found for <strong>{searchEmail}</strong>.
          </p>
        )}

        {/* Orders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {orders?.map((order) => (
            <div
              key={order._id}
              className="bg-[#1A1A1A]/70 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:border-orange-500/40 transition-all shadow-lg"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-2">
                <h2 className="font-semibold text-sm sm:text-base text-gray-200 truncate">
                  Order{' '}
                  <span
                    className="text-orange-400 font-mono text-xs sm:text-sm max-w-[130px] inline-block overflow-hidden text-ellipsis align-middle"
                    title={order._id}
                  >
                    #{order._id.slice(0, 10)}...
                  </span>
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-[10px] sm:text-xs font-medium uppercase self-start sm:self-auto ${
                    order.status === 'delivered'
                      ? 'bg-green-500/20 text-green-400'
                      : order.status === 'cancelled'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {order.status}
                </span>
              </div>

              {/* Items */}
              <div className="mb-4">
                <p className="text-xs sm:text-sm font-medium text-gray-400 mb-2">
                  Items in your order:
                </p>
                <ul className="space-y-1 text-gray-300 text-xs sm:text-sm">
                  {order.items.map((item: any) => (
                    <li
                      key={item.id}
                      className="flex justify-between border-b border-white/5 pb-1"
                    >
                      <span>
                        {item.name} × {item.qty}
                      </span>
                      <span className="font-semibold">
                        ₦{item.price.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tracking */}
              <div className="border-t border-white/10 pt-3 mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="text-orange-500" size={16} />
                  <p className="font-semibold text-gray-200 text-sm">
                    Tracking Info
                  </p>
                </div>

                <div className="text-xs sm:text-sm text-gray-400 space-y-1 ml-5 sm:ml-6">
                  <p>
                    <strong>Carrier:</strong>{' '}
                    {order.tracking?.carrier || 'Not assigned'}
                  </p>
                  <p>
                    <strong>Current Location:</strong>{' '}
                    {order.tracking?.currentLocation || '—'}
                  </p>
                  <p>
                    <strong>Estimated Delivery:</strong>{' '}
                    {order.tracking?.estimatedDelivery || '—'}
                  </p>
                </div>

                {order.tracking?.history &&
                  order.tracking.history.length > 0 && (
                    <div className="mt-3 ml-5 sm:ml-6 border-l border-gray-700 pl-3 space-y-2">
                      {order.tracking.history.map((step: any, i: number) => (
                        <div key={i} className="text-xs text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin size={12} className="text-orange-500" />
                            <span className="text-gray-300 font-medium">
                              {step.status}
                            </span>
                          </div>
                          <p className="ml-6 text-[11px]">
                            {step.location} •{' '}
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                {!order.deliveryConfirmed && order.status === 'delivered' && (
                  <button
                    onClick={() => handleConfirmDelivery(order._id)}
                    className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                  >
                    <CheckCircle size={14} /> Confirm Delivery
                  </button>
                )}

                {order.deliveryConfirmed && (
                  <Link
                    href={`/review/${order._id}`}
                    className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                  >
                    Leave a Review
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
