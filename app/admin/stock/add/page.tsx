'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import AdminSidebar from '@/app/components/AdminSidebar';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import { ArrowLeft, Plus, Headphones, Speaker, Music } from 'lucide-react';
import Link from 'next/link';

export default function AddStockPage() {
  const { user } = useAuth();
  const allProducts = useQuery(api.products.getAllProducts) || [];
  const addStock = useMutation(api.products.addStock);

  // Filter for audiophile products only
  const audiophileProducts = allProducts.filter(
    (product: { category: string }) =>
      product.category === 'headphones' ||
      product.category === 'earphones' ||
      product.category === 'speakers'
  );

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Get selected product details
  const selectedProductDetails = audiophileProducts.find(
    (p: { _id: string }) => p._id === selectedProduct
  );

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'headphones':
        return <Headphones size={16} className="inline" />;
      case 'earphones':
        return <Music size={16} className="inline" />;
      case 'speakers':
        return <Speaker size={16} className="inline" />;
      default:
        return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

  return (
    <AdminAuthGuard>
      <div className="flex flex-col md:flex-row md:h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Link
                href="/admin/stock"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Add Stock</h1>
                <p className="text-gray-600 text-sm mt-1">
                  Increase inventory for audiophile products
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Form - Left */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">Stock Details</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Select Audiophile Product *
                      </label>
                      <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      >
                        <option value="">
                          Choose an audiophile product...
                        </option>

                        {/* Headphones */}
                        {audiophileProducts.filter(
                          (p: { category: string }) =>
                            p.category === 'headphones'
                        ).length > 0 && (
                          <optgroup label="🎧 Headphones">
                            {audiophileProducts
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
                        {audiophileProducts.filter(
                          (p: { category: string }) =>
                            p.category === 'earphones'
                        ).length > 0 && (
                          <optgroup label="🎵 Earphones">
                            {audiophileProducts
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
                        {audiophileProducts.filter(
                          (p: { category: string }) => p.category === 'speakers'
                        ).length > 0 && (
                          <optgroup label="🔊 Speakers">
                            {audiophileProducts
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

                      {selectedProductDetails && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                {getCategoryIcon(
                                  (selectedProductDetails as any).category
                                )}
                                {(selectedProductDetails as any).name}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 capitalize">
                                {(selectedProductDetails as any).category}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-600">
                                Current Stock
                              </p>
                              <p className="text-lg font-bold text-gray-900">
                                {(selectedProductDetails as any).stock}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
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
                      {selectedProductDetails && quantity > 0 && (
                        <p className="text-sm text-green-600 mt-2">
                          New stock will be:{' '}
                          <strong>
                            {(selectedProductDetails as any).stock + quantity}
                          </strong>
                        </p>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 flex items-center justify-center gap-2 bg-[#d87d4a] text-white py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold disabled:opacity-50"
                      >
                        <Plus size={20} />
                        {submitting ? 'Adding...' : 'Add Stock'}
                      </button>
                      <Link
                        href="/admin/stock"
                        className="flex-1 text-center bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold leading-[48px]"
                      >
                        Cancel
                      </Link>
                    </div>
                  </form>
                </div>
              </div>

              {/* Info Card - Right */}
              <div>
                <div className="bg-gradient-to-br from-[#d87d4a] to-[#fbaf85] p-6 rounded-lg shadow-lg text-white sticky top-8">
                  <h3 className="text-xl font-bold mb-4">
                    🎧 Audiophile Stock
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="bg-white/20 p-3 rounded">
                      <p className="font-semibold">Total Products</p>
                      <p className="text-2xl font-bold">
                        {audiophileProducts.length}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">Categories:</p>
                      <ul className="space-y-1 text-xs">
                        <li>
                          🎧 Headphones:{' '}
                          {
                            audiophileProducts.filter(
                              (p: { category: string }) =>
                                p.category === 'headphones'
                            ).length
                          }
                        </li>
                        <li>
                          🎵 Earphones:{' '}
                          {
                            audiophileProducts.filter(
                              (p: { category: string }) =>
                                p.category === 'earphones'
                            ).length
                          }
                        </li>
                        <li>
                          🔊 Speakers:{' '}
                          {
                            audiophileProducts.filter(
                              (p: { category: string }) =>
                                p.category === 'speakers'
                            ).length
                          }
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-600 mt-6">
                  <h3 className="text-lg font-bold text-blue-900 mb-3">
                    📊 Stock Tips
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-2">
                    <li>✓ Monitor stock levels regularly</li>
                    <li>✓ Reorder when stock drops below minimum</li>
                    <li>✓ Keep accurate records of all additions</li>
                    <li>✓ Update immediately after receiving shipments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
