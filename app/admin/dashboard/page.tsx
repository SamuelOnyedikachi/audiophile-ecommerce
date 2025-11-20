'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import {
  Calendar,
  TrendingUp,
  Package,
  DollarSign,
  X,
  Box,
  PlusCircle,
  UserPlus,
  Users,
  Truck,
  ClipboardList,
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
  items?: unknown[];
  totals: { subtotal: number; shipping: number; taxes: number; total: number };
  status: string;
  tracking?: unknown;
  deliveryConfirmed?: boolean;
  createdAt: string;
};

const getDefaultDates = () => {
  const end = new Date();
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

const calculateMetricsForOrders = (orders: OrderLocal[]) => {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum: number, order: OrderLocal) => sum + order.totals.total,
    0
  );
  const totalCost = totalRevenue * 0.4;
  const totalProfit = totalRevenue - totalCost;
  const deliveredCount = orders.filter(
    (order: OrderLocal) => order.status === 'delivered'
  ).length;
  const pendingCount = orders.filter(
    (order: OrderLocal) => order.status === 'pending'
  ).length;

  return {
    totalOrders,
    totalRevenue,
    totalCost,
    totalProfit,
    deliveredCount,
    pendingCount,
    deliveryRate:
      totalOrders > 0 ? ((deliveredCount / totalOrders) * 100).toFixed(1) : 0,
    profitMargin:
      totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : '0',
    avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
};

const getDateRangeForInterval = (interval: string) => {
  const end = new Date();
  const start = new Date();

  switch (interval) {
    case 'today':
      start.setHours(0, 0, 0, 0);
      break;
    case 'week':
      start.setDate(end.getDate() - 7);
      break;
    case 'month':
      start.setDate(end.getDate() - 30);
      break;
    case 'year':
      start.setFullYear(end.getFullYear() - 1);
      break;
    default:
      start.setDate(end.getDate() - 30);
  }

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

export default function AdminDashboard() {
  const { start: defaultStart, end: defaultEnd } = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [showFilter, setShowFilter] = useState(false);
  const [sidebarInterval, setSidebarInterval] = useState('month');

  // Fetch all orders
  const allOrders = useQuery(api.orders.getAllOrders) || [];

  // Filter orders by date range for main dashboard
  const filteredOrders = (allOrders as OrderLocal[]).filter(
    (order: OrderLocal) => {
      const orderDate = new Date(order.createdAt);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      return orderDate >= start && orderDate <= end;
    }
  );

  // Get sidebar data for selected interval
  const sidebarDates = getDateRangeForInterval(sidebarInterval);
  const sidebarOrders = (allOrders as OrderLocal[]).filter(
    (order: OrderLocal) => {
      const orderDate = new Date(order.createdAt);
      const start = new Date(sidebarDates.start);
      const end = new Date(sidebarDates.end);
      end.setHours(23, 59, 59, 999);
      return orderDate >= start && orderDate <= end;
    }
  );
  const sidebarMetrics = calculateMetricsForOrders(sidebarOrders);

  // Calculate main dashboard metrics
  const dashboardMetrics = calculateMetricsForOrders(filteredOrders);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col md:flex-row md:h-screen">
        {/* Left Sidebar - Hidden on mobile, visible on tablet+ */}
        <div className="hidden md:block md:w-80 bg-white shadow-lg overflow-y-auto border-r border-gray-200 max-h-screen">
          <div className="p-4 md:p-6 sticky top-0 bg-white border-b border-gray-200">
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
              Records Summary
            </h2>

            {/* Interval Tabs */}
            <div className="flex flex-wrap gap-2">
              {['today', 'week', 'month', 'year'].map((interval) => (
                <button
                  key={interval}
                  onClick={() => setSidebarInterval(interval)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full transition ${
                    sidebarInterval === interval
                      ? 'bg-[#d87d4a] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {interval.charAt(0).toUpperCase() + interval.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Admin Navigation Links */}
          <nav className="mt-4 space-y-2">
            <Link
              href="/admin/products"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Box size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Products
              </span>
            </Link>

            <Link
              href="/admin/products/add"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <PlusCircle size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Add / Update Item
              </span>
            </Link>

            <Link
              href="/admin/stock"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <ClipboardList size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Stock Balance
              </span>
            </Link>

            <Link
              href="/admin/stock/add"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <PlusCircle size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Add Stock
              </span>
            </Link>

            <Link
              href="/admin/vendors"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Truck size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Vendors</span>
            </Link>

            <Link
              href="/admin/vendors/register"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <UserPlus size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Register Vendor
              </span>
            </Link>

            <Link
              href="/admin/customers"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Users size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Customers
              </span>
            </Link>

            <Link
              href="/admin/customers/register"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <UserPlus size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Register Customer
              </span>
            </Link>

            <Link
              href="/admin/users/register"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <UserPlus size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Register Users
              </span>
            </Link>

            <Link
              href="/admin/users"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Users size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Manage Users
              </span>
            </Link>

            <Link
              href="/admin/orders"
              className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
            >
              <Package size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Orders Management
              </span>
            </Link>
          </nav>

          <div className="p-6 space-y-6">
            {/* Orders Record */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-xs font-medium">
                  Total Orders
                </p>
                <Package size={18} className="text-[#d87d4a]" />
              </div>
              <p className="text-lg font-bold text-gray-900">
                {sidebarMetrics.totalOrders}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {sidebarDates.start} to {sidebarDates.end}
              </p>
            </div>

            {/* Revenue */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-xs font-medium">
                  Total Revenue
                </p>
                <DollarSign size={18} className="text-green-600" />
              </div>
              <p className="text-lg font-bold text-green-600">
                ${sidebarMetrics.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Gross income</p>
            </div>

            {/* Cost */}
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-xs font-medium">Total Cost</p>
                <DollarSign size={18} className="text-red-600" />
              </div>
              <p className="text-lg font-bold text-red-600">
                ${sidebarMetrics.totalCost.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">40% of revenue</p>
            </div>

            {/* Profit */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-xs font-medium">Net Profit</p>
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <p className="text-lg font-bold text-blue-600">
                ${sidebarMetrics.totalProfit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {sidebarMetrics.profitMargin}% margin
              </p>
            </div>

            {/* Deliveries */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-xs font-medium mb-3">
                Delivery Status
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Delivered</span>
                  <span className="text-sm font-bold text-green-600">
                    {sidebarMetrics.deliveredCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Pending</span>
                  <span className="text-sm font-bold text-yellow-600">
                    {sidebarMetrics.pendingCount}
                  </span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-semibold">
                    Delivery Rate
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {sidebarMetrics.deliveryRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-gray-600 text-xs font-medium mb-2">
                Average Order Value
              </p>
              <p className="text-lg font-bold text-indigo-600">
                ${sidebarMetrics.avgOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Per transaction</p>
            </div>

            {/* Revenue */}
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-medium">
                  Total Revenue
                </p>
                <DollarSign size={18} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">
                ${sidebarMetrics.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Gross income</p>
            </div>

            {/* Cost */}
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-medium">Total Cost</p>
                <DollarSign size={18} className="text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-600">
                ${sidebarMetrics.totalCost.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">40% of revenue</p>
            </div>

            {/* Profit */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-gray-600 text-sm font-medium">Net Profit</p>
                <TrendingUp size={18} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">
                ${sidebarMetrics.totalProfit.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {sidebarMetrics.profitMargin}% margin
              </p>
            </div>

            {/* Deliveries */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium mb-3">
                Delivery Status
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Delivered</span>
                  <span className="font-bold text-green-600">
                    {sidebarMetrics.deliveredCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-700">Pending</span>
                  <span className="font-bold text-yellow-600">
                    {sidebarMetrics.pendingCount}
                  </span>
                </div>
                <div className="border-t pt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-700 font-semibold">
                    Delivery Rate
                  </span>
                  <span className="font-bold text-blue-600">
                    {sidebarMetrics.deliveryRate}%
                  </span>
                </div>
              </div>
            </div>

            {/* Average Order Value */}
            <div className="bg-indigo-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm font-medium mb-2">
                Average Order Value
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                ${sidebarMetrics.avgOrderValue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Per transaction</p>
            </div>

            {/* Loss Calculation */}
            {sidebarMetrics.totalCost > sidebarMetrics.totalRevenue && (
              <div className="bg-red-100 p-4 rounded-lg border-l-4 border-red-600">
                <p className="text-red-800 text-sm font-semibold">
                  Loss: $
                  {(
                    sidebarMetrics.totalCost - sidebarMetrics.totalRevenue
                  ).toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">
            <div className="max-w-7xl">
              {/* Header with Filter Icon */}
              <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1 md:mb-2">
                    Admin Dashboard
                  </h1>
                  <p className="text-xs md:text-sm text-gray-600">
                    Sales, Orders & Financial Overview
                  </p>
                </div>
                <button
                  onClick={() => setShowFilter(!showFilter)}
                  className="flex items-center justify-center gap-2 bg-[#d87d4a] text-white px-4 md:px-6 py-2 md:py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold text-sm md:text-base shadow-md w-full md:w-auto"
                  title="Filter orders by date range"
                >
                  <Calendar size={18} />
                  <span>Filter</span>
                </button>
              </div>

              {/* Filter Modal Drawer */}
              {showFilter && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40"
                  onClick={() => setShowFilter(false)}
                />
              )}
              <div
                className={`fixed right-0 top-0 h-screen w-full sm:w-96 bg-white shadow-lg transform transition-transform duration-300 z-50 ${
                  showFilter ? 'translate-x-0' : 'translate-x-full'
                }`}
              >
                <div className="p-6 h-full flex flex-col">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-bold">Filter Orders</h2>
                    <button
                      onClick={() => setShowFilter(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg transition"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Filter Form */}
                  <div className="space-y-6 flex-1">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      />
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <button
                    onClick={() => setShowFilter(false)}
                    className="w-full bg-[#d87d4a] text-white py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold flex items-center justify-center gap-2"
                  >
                    <Calendar size={20} />
                    Apply Filter
                  </button>
                </div>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Total Orders */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">
                        Total Orders
                      </p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 mt-2">
                        {dashboardMetrics.totalOrders}
                      </p>
                    </div>
                    <Package size={20} className="text-[#d87d4a]" />
                  </div>
                </div>

                {/* Total Revenue */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">
                        Total Revenue
                      </p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 mt-2">
                        ${dashboardMetrics.totalRevenue.toFixed(2)}
                      </p>
                    </div>
                    <DollarSign size={20} className="text-green-500" />
                  </div>
                </div>

                {/* Total Profit */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">
                        Total Profit
                      </p>
                      <p className="text-lg md:text-xl font-bold text-green-600 mt-2">
                        ${dashboardMetrics.totalProfit.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {dashboardMetrics.profitMargin}% margin
                      </p>
                    </div>
                    <TrendingUp size={20} className="text-green-600" />
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-xs font-medium">
                        Avg Order Value
                      </p>
                      <p className="text-lg md:text-xl font-bold text-gray-900 mt-2">
                        ${dashboardMetrics.avgOrderValue.toFixed(2)}
                      </p>
                    </div>
                    <TrendingUp size={20} className="text-blue-500" />
                  </div>
                </div>
              </div>

              {/* Status Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                {/* Delivery Status */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <h2 className="text-sm md:text-base font-bold mb-4">
                    Delivery Status
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Delivered
                      </span>
                      <span className="text-sm md:text-lg font-bold text-green-600">
                        {dashboardMetrics.deliveredCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Pending
                      </span>
                      <span className="text-sm md:text-lg font-bold text-yellow-600">
                        {dashboardMetrics.pendingCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs md:text-sm text-gray-600 font-semibold">
                        Delivery Rate
                      </span>
                      <span className="text-sm md:text-lg font-bold text-blue-600">
                        {dashboardMetrics.deliveryRate}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm">
                  <h2 className="text-sm md:text-base font-bold mb-4">
                    Financial Summary
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Revenue
                      </span>
                      <span className="text-sm md:text-lg font-bold text-green-600">
                        ${dashboardMetrics.totalRevenue.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs md:text-sm text-gray-600">
                        Cost (40%)
                      </span>
                      <span className="text-sm md:text-lg font-bold text-red-600">
                        ${dashboardMetrics.totalCost.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t">
                      <span className="text-xs md:text-sm text-gray-600 font-semibold">
                        Net Profit
                      </span>
                      <span className="text-sm md:text-lg font-bold text-green-600">
                        ${dashboardMetrics.totalProfit.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm overflow-x-auto">
                <h2 className="text-sm md:text-base font-bold mb-4">
                  Orders ({filteredOrders.length})
                </h2>
                <table className="w-full text-xs md:text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold">
                        Order ID
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Customer
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Email
                      </th>
                      <th className="text-right py-3 px-4 font-semibold">
                        Amount
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Status
                      </th>
                      <th className="text-left py-3 px-4 font-semibold">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.length > 0 ? (
                      filteredOrders
                        .sort(
                          (a, b) =>
                            new Date(b.createdAt).getTime() -
                            new Date(a.createdAt).getTime()
                        )
                        .map((order) => (
                          <tr
                            key={order._id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 font-mono text-xs text-gray-600">
                              {String(order._id).slice(0, 8)}...
                            </td>
                            <td className="py-3 px-4">{order.customer.name}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {order.customer.email}
                            </td>
                            <td className="py-3 px-4 text-right font-semibold text-[#d87d4a]">
                              ${order.totals.total.toFixed(2)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  order.status === 'delivered'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 text-xs">
                              {new Date(order.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                }
                              )}
                            </td>
                          </tr>
                        ))
                    ) : (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 text-center text-gray-500"
                        >
                          No orders found for the selected date range.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
