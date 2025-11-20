'use client';

import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/components/AuthProvider';

type OrderLocal = {
  _id: string;
  customer: { name: string; email: string; phone?: string };
  shipping?: {
    address: string;
    city: string;
    zipcode: string;
    country: string;
  };
  items?: Array<{ name?: string; price?: number; qty?: number }>;
  totals: { subtotal: number; shipping: number; taxes: number; total: number };
  status: string;
  tracking?: {
    trackingNumber?: string;
    carrier?: string;
    currentLocation?: string;
    estimatedDelivery?: string;
  };
  deliveryConfirmed?: boolean;
  createdAt: string;
};

export default function UpdateOrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const order = useQuery(api.orders.getOrder, {
    orderId: id as Id<'orders'>,
  }) as OrderLocal | undefined;

  const updateTracking = useMutation(api.orders.updateOrderTracking);

  const [formData, setFormData] = useState({
    status: '',
    trackingNumber: '',
    carrier: '',
    currentLocation: '',
    estimatedDelivery: '',
    description: '',
  });

  const [updating, setUpdating] = useState(false);

  // Populate form with current order data
  useEffect(() => {
    if (order) {
      const tracking = order.tracking as
        | {
            trackingNumber?: string;
            carrier?: string;
            currentLocation?: string;
            estimatedDelivery?: string;
          }
        | undefined;
      setFormData({
        status: order.status || 'pending',
        trackingNumber: tracking?.trackingNumber || '',
        carrier: tracking?.carrier || '',
        currentLocation: tracking?.currentLocation || '',
        estimatedDelivery: tracking?.estimatedDelivery || '',
        description: '',
      });
    }
  }, [order]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) {
      toast.error('You must be logged in to update orders');
      return;
    }

    if (!formData.currentLocation.trim()) {
      toast.error('Current location is required');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Update description is required');
      return;
    }

    setUpdating(true);

    try {
      await updateTracking({
        orderId: id as Id<'orders'>,
        status: formData.status,
        trackingNumber: formData.trackingNumber || undefined,
        carrier: formData.carrier || undefined,
        currentLocation: formData.currentLocation,
        estimatedDelivery: formData.estimatedDelivery || undefined,
        description: formData.description,
        userId: user.id as Id<'users'>,
      });

      toast.success('Order tracking updated successfully!');
      router.push('/admin/orders');
    } catch (error) {
      console.error('Error updating tracking:', error);
      toast.error('Failed to update tracking. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size={32} className="text-[#d87d4a] animate-spin" />
      </div>
    );
  }

  const statuses = [
    'pending',
    'processing',
    'shipped',
    'in-transit',
    'out-for-delivery',
    'delivered',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin/orders"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Update Order Tracking
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Order ID: {String(order._id).slice(0, 12)}...
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary (Right Sidebar) */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-6">
              <h2 className="font-semibold text-gray-900 mb-4">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Customer
                  </p>
                  <p className="font-medium text-gray-900">
                    {order.customer.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.customer.email}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Total Amount
                  </p>
                  <p className="text-xl font-bold text-[#d87d4a]">
                    ${order.totals.total.toFixed(2)}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Current Status
                  </p>
                  <p className="capitalize font-medium text-gray-900 mt-1">
                    {order.status}
                  </p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold">
                    Order Date
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {Array.isArray(order.items) && order.items.length > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-3">
                      Items ({order.items.length})
                    </p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-600">{item.name}</span>
                          <span className="font-medium text-gray-900">
                            ×{item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Update Form (Left Main) */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-sm space-y-6"
            >
              {/* Order Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Order Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                  required
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('-', ' ').toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Carrier */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Carrier
                </label>
                <input
                  type="text"
                  value={formData.carrier}
                  onChange={(e) =>
                    setFormData({ ...formData, carrier: e.target.value })
                  }
                  placeholder="e.g., DHL, FedEx, UPS, Courier"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                />
              </div>

              {/* Tracking Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Tracking Number
                </label>
                <input
                  type="text"
                  value={formData.trackingNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, trackingNumber: e.target.value })
                  }
                  placeholder="e.g., 1234567890ABC"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                />
              </div>

              {/* Current Location */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Current Location *
                </label>
                <input
                  type="text"
                  value={formData.currentLocation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentLocation: e.target.value,
                    })
                  }
                  placeholder="e.g., Lagos Distribution Center"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                  required
                />
              </div>

              {/* Estimated Delivery */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Estimated Delivery Date
                </label>
                <input
                  type="date"
                  value={formData.estimatedDelivery}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      estimatedDelivery: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                />
              </div>

              {/* Update Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Update Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="e.g., Package has arrived at sorting facility and is being prepared for delivery."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  This will be sent to the customer via email.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6 border-t">
                <Link
                  href="/admin/orders"
                  className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 bg-[#d87d4a] text-white py-3 rounded-lg font-semibold hover:bg-[#fbaf85] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {updating && <Loader size={18} className="animate-spin" />}
                  {updating ? 'Updating...' : 'Update Tracking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
