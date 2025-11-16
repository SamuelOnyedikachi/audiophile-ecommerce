'use client';

import { useParams } from 'next/navigation';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { ArrowLeft, MapPin, Truck, CheckCircle } from 'lucide-react';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const order = useQuery(api.orders.getOrder, {
    orderId: id as Id<'orders'>,
  });

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#121212] text-gray-400">
        Loading order details...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#121212] text-white px-6 py-10">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/track-order"
          className="flex items-center gap-2 text-gray-400 hover:text-orange-400 transition mb-8"
        >
          <ArrowLeft size={18} /> Back to Orders
        </Link>

        <div className="bg-[#1A1A1A]/70 border border-white/10 rounded-2xl p-8 shadow-lg backdrop-blur-md">
          <h1 className="text-2xl font-semibold mb-2">
            Order <span className="text-orange-400">#{order._id}</span>
          </h1>
          <p className="text-gray-400 mb-6">{order.customer.email}</p>

          {/* Status */}
          <div className="flex items-center justify-between mb-6">
            <span
              className={`px-4 py-1 rounded-full text-sm font-medium uppercase ${
                order.status === 'delivered'
                  ? 'bg-green-500/20 text-green-400'
                  : order.status === 'cancelled'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-yellow-500/20 text-yellow-400'
              }`}
            >
              {order.status}
            </span>
            <span className="text-gray-400 text-sm">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          {/* Items */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Items</h2>
            <ul className="space-y-2">
              {order.items.map(
                (item: {
                  id: string;
                  name: string;
                  qty: number;
                  price: number;
                }) => (
                  <li
                    key={item.id}
                    className="flex justify-between border-b border-white/5 pb-2 text-sm"
                  >
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span className="font-semibold">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Tracking */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="text-orange-500" size={18} /> Tracking Info
            </h2>
            <p className="text-gray-400 text-sm mb-2">
              <strong>Carrier:</strong>{' '}
              {order.tracking?.carrier || 'Not assigned'}
            </p>
            <p className="text-gray-400 text-sm mb-2">
              <strong>Current Location:</strong>{' '}
              {order.tracking?.currentLocation || '—'}
            </p>
            <p className="text-gray-400 text-sm mb-4">
              <strong>Estimated Delivery:</strong>{' '}
              {order.tracking?.estimatedDelivery || '—'}
            </p>

            {/* Tracking history */}
            {order.tracking?.history && order.tracking.history.length > 0 && (
              <div className="border-l border-gray-700 pl-4 space-y-2">
                {order.tracking.history.map(
                  (
                    step: {
                      status: string;
                      location: string;
                      timestamp: string;
                    },
                    i: number
                  ) => (
                    <div key={i}>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-orange-500" />
                        <span className="text-gray-300">{step.status}</span>
                      </div>
                      <p className="ml-6 text-xs text-gray-500">
                        {step.location} •{' '}
                        {new Date(step.timestamp).toLocaleString()}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Confirm Delivery */}
          {order.status === 'delivered' && !order.deliveryConfirmed && (
            <button className="mt-6 bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition">
              <CheckCircle size={18} /> Confirm Delivery
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
