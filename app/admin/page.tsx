'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Package, Truck, MapPin, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const orders = useQuery(api.orders.getAllOrders);
  const updateTracking = useMutation(api.orders.updateOrderTracking);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
            />
            <button
              type="submit"
              className="w-full bg-[#d87d4a] text-white py-3 rounded-lg font-semibold hover:bg-[#fbaf85] transition"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-gray-500 mt-4 text-center">
            Demo password: Admin123
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Order Management</h1>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={orders?.length || 0}
            icon={<Package className="w-6 h-6" />}
            color="bg-blue-500"
          />
          <StatCard
            title="Processing"
            value={
              orders?.filter((o: any) => o.status === 'processing').length || 0
            }
            icon={<Truck className="w-6 h-6" />}
            color="bg-purple-500"
          />
          <StatCard
            title="In Transit"
            value={
              orders?.filter((o: any) =>
                ['shipped', 'in-transit', 'out-for-delivery'].includes(o.status)
              ).length || 0
            }
            icon={<MapPin className="w-6 h-6" />}
            color="bg-orange-500"
          />
          <StatCard
            title="Delivered"
            value={
              orders?.filter((o: any) => o.status === 'delivered').length || 0
            }
            icon={<CheckCircle className="w-6 h-6" />}
            color="bg-green-500"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Items
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders?.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-mono">
                      {order._id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-semibold">{order.customer.name}</p>
                        <p className="text-gray-600">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.items.length} item(s)
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      ${order.totals.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#d87d4a] hover:text-[#fbaf85] font-semibold text-sm"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {selectedOrder && (
          <UpdateTrackingModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onUpdate={updateTracking}
          />
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} text-white p-3 rounded-lg`}>{icon}</div>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <p className="text-gray-600 text-sm font-semibold">{title}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: 'bg-gray-100 text-gray-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    'in-transit': 'bg-purple-100 text-purple-800',
    'out-for-delivery': 'bg-orange-100 text-orange-800',
    delivered: 'bg-green-100 text-green-800',
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
        colors[status] || colors.pending
      }`}
    >
      {status}
    </span>
  );
}

function UpdateTrackingModal({
  order,
  onClose,
  onUpdate,
}: {
  order: any;
  onClose: () => void;
  onUpdate: any;
}) {
  const [formData, setFormData] = useState({
    status: order.status,
    trackingNumber: order.tracking?.trackingNumber || '',
    carrier: order.tracking?.carrier || '',
    currentLocation: '',
    estimatedDelivery: order.tracking?.estimatedDelivery || '',
    description: '',
  });

  const [updating, setUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      await onUpdate({
        orderId: order._id,
        status: formData.status,
        trackingNumber: formData.trackingNumber,
        carrier: formData.carrier,
        currentLocation: formData.currentLocation,
        estimatedDelivery: formData.estimatedDelivery,
        description: formData.description,
      });
      alert('✅ Tracking updated! Customer will receive an email.');
      onClose();
    } catch (error) {
      console.error(error);
      alert('❌ Failed to update tracking');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h3 className="text-2xl font-bold">Update Order Tracking</h3>
          <p className="text-sm text-gray-600 mt-1">Order ID: {order._id}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
              required
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="in-transit">In Transit</option>
              <option value="out-for-delivery">Out for Delivery</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Carrier</label>
            <input
              type="text"
              value={formData.carrier}
              onChange={(e) =>
                setFormData({ ...formData, carrier: e.target.value })
              }
              placeholder="e.g., DHL, FedEx, UPS"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Tracking Number
            </label>
            <input
              type="text"
              value={formData.trackingNumber}
              onChange={(e) =>
                setFormData({ ...formData, trackingNumber: e.target.value })
              }
              placeholder="Enter tracking number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Current Location *
            </label>
            <input
              type="text"
              value={formData.currentLocation}
              onChange={(e) =>
                setFormData({ ...formData, currentLocation: e.target.value })
              }
              placeholder="e.g., Lagos Distribution Center"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Update Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="e.g., Package has arrived at sorting facility"
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Estimated Delivery
            </label>
            <input
              type="date"
              value={formData.estimatedDelivery}
              onChange={(e) =>
                setFormData({ ...formData, estimatedDelivery: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="flex-1 bg-[#d87d4a] text-white py-3 rounded-lg font-semibold hover:bg-[#fbaf85] transition disabled:opacity-50"
            >
              {updating ? 'Updating...' : 'Update Tracking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}