'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import AdminSidebar from '@/app/components/AdminSidebar';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import {
  Plus,
  Minus,
  Headphones,
  Music,
  Speaker,
  TrendingUp,
  AlertTriangle,
  PackageX,
  Box, // Changed from Package to Box
} from 'lucide-react';
import Link from 'next/link';

export default function AdminStock() {
  const { user } = useAuth();
  const allProducts = useQuery(api.products.getAllProducts) || [];
  const addStock = useMutation(api.products.addStock);
  const reduceStock = useMutation(api.products.reduceStock);

  // Filter for audiophile products only
  const products = allProducts.filter(
    (product: { category: string }) =>
      product.category === 'headphones' ||
      product.category === 'earphones' ||
      product.category === 'speakers'
  );

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  // Calculate stock statistics
  const stockStats = {
    total: products.length,
    inStock: products.filter((p: { stock: number }) => p.stock > 10).length,
    lowStock: products.filter(
      (p: { stock: number }) => p.stock > 0 && p.stock <= 10
    ).length,
    outOfStock: products.filter((p: { stock: number }) => p.stock === 0).length,
    totalUnits: products.reduce(
      (sum: number, p: { stock: number }) => sum + p.stock,
      0
    ),
  };

  // Filter products by category
  const filteredProducts =
    filterCategory === 'all'
      ? products
      : products.filter(
          (p: { category: string }) => p.category === filterCategory
        );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'headphones':
        return <Headphones size={16} className="inline mr-1" />;
      case 'earphones':
        return <Music size={16} className="inline mr-1" />;
      case 'speakers':
        return <Speaker size={16} className="inline mr-1" />;
      default:
        return null;
    }
  };

  const handleAddStock = async () => {
    if (!selectedProduct || quantity <= 0) {
      toast.warning('⚠️ Please select a product and enter a valid quantity');
      return;
    }

    if (!user?.id) {
      toast.error('You must be logged in to manage stock');
      return;
    }

    setSubmitting(true);
    try {
      await addStock({
        productId: selectedProduct as Id<'products'>,
        quantity,
        addedBy: user.name || 'admin',
        userId: user.id as Id<'users'>,
      });
      toast.success(`✅ Added ${quantity} units to stock!`);
      setSelectedProduct('');
      setQuantity(0);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Failed to add stock');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReduceStock = async (productId: string) => {
    const product = products.find((p: { _id: string }) => p._id === productId);
    const reduceQty = prompt(
      `Enter quantity to reduce (Current stock: ${product?.stock || 0}):`
    );
    if (!reduceQty || isNaN(parseFloat(reduceQty))) return;

    const qty = parseFloat(reduceQty);
    if (qty > (product?.stock || 0)) {
      toast.error('Cannot reduce more than current stock!');
      return;
    }

    setSubmitting(true);
    try {
      await reduceStock({
        productId: productId as Id<'products'>,
        quantity: qty,
      });
      toast.success(`✅ Reduced stock by ${reduceQty} units!`);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'Failed to reduce stock';
      console.error('❌ Error:', error);
      toast.error(`❌ ${errorMsg}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthGuard>
      <div className="flex flex-col md:flex-row md:h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Stock Management
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Manage audiophile product inventory
                </p>
              </div>
              <Link
                href="/admin/stock/add"
                className="flex items-center gap-2 bg-[#d87d4a] text-white px-6 py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold"
              >
                <Plus size={20} />
                Add Stock
              </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {stockStats.total}
                    </p>
                  </div>
                  <Box size={24} className="text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      In Stock
                    </p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {stockStats.inStock}
                    </p>
                  </div>
                  <TrendingUp size={24} className="text-green-500" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Low Stock
                    </p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {stockStats.lowStock}
                    </p>
                  </div>
                  <AlertTriangle size={24} className="text-yellow-500" />
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase">
                      Out of Stock
                    </p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {stockStats.outOfStock}
                    </p>
                  </div>
                  <PackageX size={24} className="text-red-500" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#d87d4a] to-[#fbaf85] p-4 rounded-lg shadow-sm">
                <div>
                  <p className="text-xs font-medium text-white uppercase">
                    Total Units
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stockStats.totalUnits}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Add Stock Card */}
            <div className="grid lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Plus size={24} className="text-[#d87d4a]" />
                  Quick Add Stock
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Select Audiophile Product *
                    </label>
                    <select
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                    >
                      <option value="">Choose a product...</option>

                      {/* Headphones */}
                      {products.filter(
                        (p: { category: string }) => p.category === 'headphones'
                      ).length > 0 && (
                        <optgroup label="🎧 Headphones">
                          {products
                            .filter(
                              (p: { category: string }) =>
                                p.category === 'headphones'
                            )
                            .map(
                              (product: {
                                _id: string;
                                name: string;
                                stock: number;
                              }) => (
                                <option key={product._id} value={product._id}>
                                  {product.name} (Stock: {product.stock})
                                </option>
                              )
                            )}
                        </optgroup>
                      )}

                      {/* Earphones */}
                      {products.filter(
                        (p: { category: string }) => p.category === 'earphones'
                      ).length > 0 && (
                        <optgroup label="🎵 Earphones">
                          {products
                            .filter(
                              (p: { category: string }) =>
                                p.category === 'earphones'
                            )
                            .map(
                              (product: {
                                _id: string;
                                name: string;
                                stock: number;
                              }) => (
                                <option key={product._id} value={product._id}>
                                  {product.name} (Stock: {product.stock})
                                </option>
                              )
                            )}
                        </optgroup>
                      )}

                      {/* Speakers */}
                      {products.filter(
                        (p: { category: string }) => p.category === 'speakers'
                      ).length > 0 && (
                        <optgroup label="🔊 Speakers">
                          {products
                            .filter(
                              (p: { category: string }) =>
                                p.category === 'speakers'
                            )
                            .map(
                              (product: {
                                _id: string;
                                name: string;
                                stock: number;
                              }) => (
                                <option key={product._id} value={product._id}>
                                  {product.name} (Stock: {product.stock})
                                </option>
                              )
                            )}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Quantity to Add *
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseFloat(e.target.value) || 0)
                      }
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="Enter quantity"
                      min="1"
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddStock}
                  disabled={submitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  <Plus size={20} />
                  {submitting ? 'Adding...' : 'Add Stock'}
                </button>
              </div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-600">
                <h3 className="text-lg font-bold text-blue-900 mb-4">
                  📊 Stock Tips
                </h3>
                <ul className="text-sm text-blue-800 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Monitor stock levels regularly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Reorder when stock drops below 10 units</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Update stock after every sale</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Track stock history for analysis</span>
                  </li>
                </ul>

                <div className="mt-6 pt-6 border-t border-blue-200">
                  <p className="text-xs font-semibold text-blue-900 mb-2">
                    CATEGORY BREAKDOWN
                  </p>
                  <div className="space-y-2 text-xs text-blue-800">
                    <div className="flex justify-between">
                      <span>🎧 Headphones:</span>
                      <span className="font-semibold">
                        {
                          products.filter(
                            (p: { category: string }) =>
                              p.category === 'headphones'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>🎵 Earphones:</span>
                      <span className="font-semibold">
                        {
                          products.filter(
                            (p: { category: string }) =>
                              p.category === 'earphones'
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>🔊 Speakers:</span>
                      <span className="font-semibold">
                        {
                          products.filter(
                            (p: { category: string }) =>
                              p.category === 'speakers'
                          ).length
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-sm font-semibold text-gray-700">
                  Filter by Category:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                      filterCategory === 'all'
                        ? 'bg-[#d87d4a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Products
                  </button>
                  <button
                    onClick={() => setFilterCategory('headphones')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                      filterCategory === 'headphones'
                        ? 'bg-[#d87d4a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Headphones size={16} />
                    Headphones
                  </button>
                  <button
                    onClick={() => setFilterCategory('earphones')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                      filterCategory === 'earphones'
                        ? 'bg-[#d87d4a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Music size={16} />
                    Earphones
                  </button>
                  <button
                    onClick={() => setFilterCategory('speakers')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-2 ${
                      filterCategory === 'speakers'
                        ? 'bg-[#d87d4a] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Speaker size={16} />
                    Speakers
                  </button>
                </div>
              </div>
            </div>

            {/* Stock Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold">
                      Product
                    </th>
                    <th className="text-left py-4 px-6 font-semibold">
                      Category
                    </th>
                    <th className="text-right py-4 px-6 font-semibold">
                      Current Stock
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Status
                    </th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(
                    (product: {
                      _id: string;
                      name: string;
                      stock: number;
                      category: string;
                    }) => {
                      const isLow = product.stock > 0 && product.stock <= 10;
                      const isEmpty = product.stock === 0;

                      return (
                        <tr
                          key={product._id}
                          className="border-b hover:bg-gray-50 transition"
                        >
                          <td className="py-4 px-6 font-medium">
                            {product.name}
                          </td>
                          <td className="py-4 px-6">
                            <span className="inline-flex items-center text-xs font-medium text-gray-700 capitalize">
                              {getCategoryIcon(product.category)}
                              {product.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right font-bold text-gray-900">
                            {product.stock} units
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                isEmpty
                                  ? 'bg-red-100 text-red-800'
                                  : isLow
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {isEmpty ? (
                                <>
                                  <PackageX size={14} />
                                  Out of Stock
                                </>
                              ) : isLow ? (
                                <>
                                  <AlertTriangle size={14} />
                                  Low Stock
                                </>
                              ) : (
                                <>
                                  <TrendingUp size={14} />
                                  In Stock
                                </>
                              )}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleReduceStock(product._id)}
                              disabled={product.stock === 0}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                            >
                              <Minus size={14} />
                              Reduce
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <PackageX size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">
                    No products found in this category
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Try selecting a different category or add new products
                  </p>
                </div>
              )}
            </div>

            {/* Footer Info */}
            {filteredProducts.length > 0 && (
              <div className="mt-6 text-center text-sm text-gray-500">
                Showing {filteredProducts.length} of {products.length}{' '}
                audiophile products
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
