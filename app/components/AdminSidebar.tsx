'use client';

import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import {
  Box,
  PlusCircle,
  ClipboardList,
  Truck,
  UserPlus,
  Users,
  Package,
  ChevronDown,
  ChevronUp,
  LayoutDashboard
} from 'lucide-react';

// type OrderLocal = {
//   _id: string;
//   customer: { name: string; email: string; phone?: string };
//   shipping?: {
//     address: string;
//     city: string;
//     zipcode: string;
//     country: string;
//   };
//   items?: unknown[];
//   totals: { subtotal: number; shipping: number; taxes: number; total: number };
//   status: string;
//   tracking?: unknown;
//   deliveryConfirmed?: boolean;
//   createdAt: string;
// };

// const calculateMetricsForOrders = (orders: OrderLocal[]) => {
//   const totalOrders = orders.length;
//   const totalRevenue = orders.reduce(
//     (sum: number, order: OrderLocal) => sum + order.totals.total,
//     0
//   );
//   const totalCost = totalRevenue * 0.4;
//   const totalProfit = totalRevenue - totalCost;
//   const deliveredCount = orders.filter(
//     (order: OrderLocal) => order.status === 'delivered'
//   ).length;
//   const pendingCount = orders.filter(
//     (order: OrderLocal) => order.status === 'pending'
//   ).length;

//   return {
//     totalOrders,
//     totalRevenue,
//     totalCost,
//     totalProfit,
//     deliveredCount,
//     pendingCount,
//     deliveryRate:
//       totalOrders > 0 ? ((deliveredCount / totalOrders) * 100).toFixed(1) : 0,
//     profitMargin:
//       totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : '0',
//     avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
//   };
// };

// const getDateRangeForInterval = (interval: string) => {
//   const end = new Date();
//   const start = new Date();

//   switch (interval) {
//     case 'today':
//       start.setHours(0, 0, 0, 0);
//       break;
//     case 'week':
//       start.setDate(end.getDate() - 7);
//       break;
//     case 'month':
//       start.setDate(end.getDate() - 30);
//       break;
//     case 'year':
//       start.setFullYear(end.getFullYear() - 1);
//       break;
//     default:
//       start.setDate(end.getDate() - 30);
//   }

//   return {
//     start: start.toISOString().split('T')[0],
//     end: end.toISOString().split('T')[0],
//   };
// };

export default function AdminSidebar() {
  // const [sidebarInterval, setSidebarInterval] = useState('month');
  const [openVendor, setOpenVendor] = useState(false);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openStock, setOpenStock] = useState(false);

  // Fetch all orders
  // const allOrders = useQuery(api.orders.getAllOrders) || [];

  // Get sidebar data for selected interval
  // // const sidebarDates = getDateRangeForInterval(sidebarInterval)
;
  // const sidebarOrders = (allOrders as OrderLocal[]).filter(
  //   (order: OrderLocal) => {
  //     const orderDate = new Date(order.createdAt);
  //     const start = new Date(sidebarDates.start);
  //     const end = new Date(sidebarDates.end);
  //     end.setHours(23, 59, 59, 999);
  //     return orderDate >= start && orderDate <= end;
  //   }
  // );
  // const sidebarMetrics = calculateMetricsForOrders(sidebarOrders);
  return (
    <div className="hidden md:block md:w-80 bg-white shadow-lg overflow-y-auto border-r border-gray-200 max-h-screen">
      <div className="p-4 md:p-6 sticky top-0 bg-white border-b border-gray-200">
        <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
          Records Summary
        </h2>

        {/* Interval Tabs */}
        {/* <div className="flex flex-wrap gap-2">
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
        </div> */}
      </div>

      {/* Admin Navigation Links */}
      <nav className="mt-4 space-y-2">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <LayoutDashboard size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
             Dashboard
          </span>
         </Link>

        <Link
          href="/admin/products"
          className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100"
        >
          <Box size={18} className="text-gray-600" />
          <span className="text-sm font-medium text-gray-700">Products</span>
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

        {/* Stock dropdown */}
        <div>
          <button
            onClick={() => setOpenStock((s) => !s)}
            className="w-full flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-100"
            aria-expanded={openStock}
          >
            <span className="flex items-center gap-3">
              <ClipboardList size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Stock</span>
            </span>
            <span className="text-gray-500">
              {openStock ? (
                <ChevronUp size={14} className="text-gray-500" />
              ) : (
                <ChevronDown size={14} className="text-gray-500" />
              )}
            </span>
          </button>
          {openStock && (
            <div className="pl-10 mt-2 space-y-1">
              <Link
                href="/admin/stock"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Stock Balance
              </Link>
              <Link
                href="/admin/stock/add"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Add Stock
              </Link>
            </div>
          )}
        </div>

        {/* Vendor dropdown */}
        <div>
          <button
            onClick={() => setOpenVendor((s) => !s)}
            className="w-full flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-100"
            aria-expanded={openVendor}
          >
            <span className="flex items-center gap-3">
              <Truck size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Vendor</span>
            </span>
            <span className="text-gray-500">
              {openVendor ? (
                <ChevronUp size={14} className="text-gray-500" />
              ) : (
                <ChevronDown size={14} className="text-gray-500" />
              )}
            </span>
          </button>
          {openVendor && (
            <div className="pl-10 mt-2 space-y-1">
              <Link
                href="/admin/vendors"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Vendors (list & register)
              </Link>
              <Link
                href="/admin/vendors"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Register Vendor
              </Link>
            </div>
          )}
        </div>

        {/* Customer dropdown */}
        <div>
          <button
            onClick={() => setOpenCustomer((s) => !s)}
            className="w-full flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-100"
            aria-expanded={openCustomer}
          >
            <span className="flex items-center gap-3">
              <Users size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Customer
              </span>
            </span>
            <span className="text-gray-500">
              {openCustomer ? (
                <ChevronUp size={14} className="text-gray-500" />
              ) : (
                <ChevronDown size={14} className="text-gray-500" />
              )}
            </span>
          </button>
          {openCustomer && (
            <div className="pl-10 mt-2 space-y-1">
              <Link
                href="/admin/customers"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Customers (list & register)
              </Link>
              <Link
                href="/admin/customers"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Register Customer
              </Link>
            </div>
          )}
        </div>

        {/* User dropdown */}
        <div>
          <button
            onClick={() => setOpenUser((s) => !s)}
            className="w-full flex items-center justify-between gap-3 p-2 rounded-md hover:bg-gray-100"
            aria-expanded={openUser}
          >
            <span className="flex items-center gap-3">
              <UserPlus size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">User</span>
            </span>
            <span className="text-gray-500">
              {openUser ? (
                <ChevronUp size={14} className="text-gray-500" />
              ) : (
                <ChevronDown size={14} className="text-gray-500" />
              )}
            </span>
          </button>
          {openUser && (
            <div className="pl-10 mt-2 space-y-1">
              <Link
                href="/admin/users/register"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Register User
              </Link>
              <Link
                href="/admin/users"
                className="block p-2 rounded hover:bg-gray-50 text-sm text-gray-700"
              >
                Manage Users
              </Link>
            </div>
          )}
        </div>

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
    </div>
  );
}
