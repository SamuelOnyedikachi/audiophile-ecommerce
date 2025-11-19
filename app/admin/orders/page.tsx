'use client';

import { useState, useMemo } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  ChevronDown,
  Truck,
  CheckCircle,
  Clock,
  Eye,
} from 'lucide-react';

type OrderLocal = {
  _id: string;
  customer: { name: string; email: string; phone?: string };
  shipping?: {
    address: string;
    city: string;
    zipcode: string;
    country: string;
  };
  items?: Array<{
    name: string;
    qty: number;
    price: number;
    cost?: number;
  }>;
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

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<
    'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc'
  >('date-desc');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Fetch all orders
  const queryResult = useQuery(api.orders.getAllOrders);
  const allOrders = useMemo(() => queryResult || [], [queryResult]);

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    let result = [...allOrders] as OrderLocal[];

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(
        (order: OrderLocal) => order.status === statusFilter
      );
    }

    // Search filter (by order ID, customer name, or email)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((order: OrderLocal) => {
        const orderId = String(order._id).toLowerCase();
        const customerName = order.customer.name.toLowerCase();
        const customerEmail = order.customer.email.toLowerCase();
        return (
          orderId.includes(term) ||
          customerName.includes(term) ||
          customerEmail.includes(term)
        );
      });
    }

    // Sort
    if (sortBy === 'date-desc') {
      result.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (sortBy === 'date-asc') {
      result.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    } else if (sortBy === 'amount-desc') {
      result.sort((a, b) => b.totals.total - a.totals.total);
    } else if (sortBy === 'amount-asc') {
      result.sort((a, b) => a.totals.total - b.totals.total);
    }

    return result;
  }, [allOrders, statusFilter, searchTerm, sortBy]);

  // Calculate stats
  const stats = {
    total: allOrders.length,
    pending: (allOrders as OrderLocal[]).filter(
      (o: OrderLocal) => o.status === 'pending'
    ).length,
    processing: (allOrders as OrderLocal[]).filter(
      (o: OrderLocal) => o.status === 'processing'
    ).length,
    shipped: (allOrders as OrderLocal[]).filter(
      (o: OrderLocal) => o.status === 'shipped'
    ).length,
    delivered: (allOrders as OrderLocal[]).filter(
      (o: OrderLocal) => o.status === 'delivered'
    ).length,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'in-transit':
        return 'bg-orange-100 text-orange-800';
      case 'out-for-delivery':
        return 'bg-orange-100 text-orange-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={16} />;
      case 'processing':
        return <Clock size={16} />;
      case 'shipped':
      case 'in-transit':
      case 'out-for-delivery':
        return <Truck size={16} />;
      case 'delivered':
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Back to dashboard"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Orders Management
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                View and manage all customer orders
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {stats.total}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Pending</p>
            <p className="text-2xl font-bold text-gray-500 mt-2">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Processing</p>
            <p className="text-2xl font-bold text-blue-600 mt-2">
              {stats.processing}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Shipped</p>
            <p className="text-2xl font-bold text-purple-600 mt-2">
              {stats.shipped}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 text-sm font-medium">Delivered</p>
            <p className="text-2xl font-bold text-green-600 mt-2">
              {stats.delivered}
            </p>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by order ID, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] appearance-none pr-10"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in-transit">In Transit</option>
                <option value="out-for-delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as
                      | 'date-desc'
                      | 'date-asc'
                      | 'amount-desc'
                      | 'amount-asc'
                  )
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a] appearance-none pr-10"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="amount-desc">Highest Amount</option>
                <option value="amount-asc">Lowest Amount</option>
              </select>
              <ChevronDown
                size={18}
                className="absolute right-3 top-2.5 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
              >
                {/* Order Header */}
                <div
                  onClick={() =>
                    setExpandedOrderId(
                      expandedOrderId === order._id ? null : order._id
                    )
                  }
                  className="p-6 cursor-pointer hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-mono text-sm font-semibold text-gray-700">
                        {String(order._id).slice(0, 12)}...
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {order.customer.name} • {order.customer.email}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#d87d4a]">
                      ${order.totals.total.toFixed(2)}
                    </p>
                    <Eye
                      size={20}
                      className={`mt-2 text-gray-400 transition ml-auto ${
                        expandedOrderId === order._id ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrderId === order._id && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Order Items
                        </h4>
                        <div className="space-y-3">
                          {Array.isArray(order.items) &&
                          order.items.length > 0 ? (
                            order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex justify-between text-sm"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {item.name}
                                  </p>
                                  <p className="text-gray-500">
                                    Qty: {item.qty}
                                  </p>
                                </div>
                                <p className="font-semibold text-gray-900">
                                  ${(item.price * item.qty).toFixed(2)}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No items</p>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-300 space-y-2">
                          <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Subtotal</p>
                            <p className="text-gray-900 font-medium">
                              ${order.totals.subtotal.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Shipping</p>
                            <p className="text-gray-900 font-medium">
                              ${order.totals.shipping.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Taxes</p>
                            <p className="text-gray-900 font-medium">
                              ${order.totals.taxes.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex justify-between text-sm pt-2 border-t border-gray-300">
                            <p className="text-gray-900 font-semibold">Total</p>
                            <p className="text-[#d87d4a] font-bold text-lg">
                              ${order.totals.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Shipping & Tracking */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Shipping Address
                        </h4>
                        {order.shipping ? (
                          <div className="text-sm text-gray-600 space-y-1 mb-6">
                            <p className="font-medium text-gray-900">
                              {order.customer.name}
                            </p>
                            <p>{order.shipping.address}</p>
                            <p>
                              {order.shipping.city}, {order.shipping.zipcode}
                            </p>
                            <p>{order.shipping.country}</p>
                            {order.customer.phone && (
                              <p className="pt-2 text-gray-700">
                                <strong>Phone:</strong> {order.customer.phone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm mb-6">
                            No shipping address
                          </p>
                        )}

                        <h4 className="font-semibold text-gray-900 mb-4">
                          Tracking
                        </h4>
                        {order.tracking &&
                        typeof order.tracking === 'object' ? (
                          <div className="text-sm text-gray-600 space-y-2">
                            {order.tracking.trackingNumber && (
                              <p>
                                <strong className="text-gray-900">
                                  Tracking #:
                                </strong>{' '}
                                {order.tracking.trackingNumber}
                              </p>
                            )}
                            {order.tracking.carrier && (
                              <p>
                                <strong className="text-gray-900">
                                  Carrier:
                                </strong>{' '}
                                {order.tracking.carrier}
                              </p>
                            )}
                            {order.tracking.currentLocation && (
                              <p>
                                <strong className="text-gray-900">
                                  Current Location:
                                </strong>{' '}
                                {order.tracking.currentLocation}
                              </p>
                            )}
                            {order.tracking.estimatedDelivery && (
                              <p>
                                <strong className="text-gray-900">
                                  Est. Delivery:
                                </strong>{' '}
                                {order.tracking.estimatedDelivery}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No tracking info
                          </p>
                        )}

                        <div className="mt-6 pt-6 border-t border-gray-300 flex gap-3">
                          <Link
                            href={`/admin/orders/${order._id}/update`}
                            className="flex-1 inline-block text-center px-4 py-2 bg-[#d87d4a] text-white rounded-lg hover:bg-[#fbaf85] transition font-semibold text-sm"
                          >
                            Edit Tracking
                          </Link>
                          <Link
                            href={`/track-order/${order._id}`}
                            className="flex-1 inline-block text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
                          >
                            View Customer
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="bg-white p-12 rounded-lg shadow-sm text-center">
              <p className="text-gray-500 text-lg">No orders found</p>
              <p className="text-gray-400 text-sm mt-1">
                Try adjusting your filters or search terms
              </p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Showing {filteredOrders.length} of {allOrders.length} orders
        </div>
      </div>
    </div>
  );
}
