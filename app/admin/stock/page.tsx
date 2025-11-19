'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import AdminLayout from '@/app/components/AdminLayout';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import { Plus, Minus } from 'lucide-react';

export default function AdminStock() {
  const { user } = useAuth();
  const products = useQuery(api.products.getAllProducts) || [];
  const addStock = useMutation(api.products.addStock);
  const reduceStock = useMutation(api.products.reduceStock);

  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [quantity, setQuantity] = useState(0);
  const [submitting, setSubmitting] = useState(false);

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
        addedBy: 'admin',
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
    const reduceQty = prompt('Enter quantity to reduce:');
    if (!reduceQty || isNaN(parseFloat(reduceQty))) return;

    setSubmitting(true);
    try {
      await reduceStock({
        productId: productId as Id<'products'>,
        quantity: parseFloat(reduceQty),
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
      <AdminLayout>
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">Stock Management</h1>

          {/* Add Stock Card */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Add Stock</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Select Product *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                  >
                    <option value="">Choose a product...</option>
                    {products.map(
                      (product: {
                        _id: string;
                        name: string;
                        stock: number;
                      }) => (
                        <option key={product._id} value={product._id}>
                          {product.name} (Current: {product.stock})
                        </option>
                      )
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
                    placeholder="0"
                    min="1"
                  />
                </div>

                <button
                  onClick={handleAddStock}
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50"
                >
                  <Plus size={20} />
                  Add Stock
                </button>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 p-8 rounded-lg border-l-4 border-blue-600">
              <h3 className="text-xl font-bold text-blue-900 mb-4">
                📊 Stock Tips
              </h3>
              <ul className="text-sm text-blue-800 space-y-2">
                <li>✓ Monitor stock levels regularly</li>
                <li>✓ Reorder when stock drops below reorder level</li>
                <li>✓ Update stock when items are sold</li>
                <li>✓ Track stock history for analysis</li>
              </ul>
            </div>
          </div>

          {/* Stock Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">Product</th>
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
                {products.map(
                  (product: { _id: string; name: string; stock: number }) => {
                    const isLow = product.stock < 10;
                    const isEmpty = product.stock === 0;

                    return (
                      <tr
                        key={product._id}
                        className="border-b hover:bg-gray-50"
                      >
                        <td className="py-4 px-6 font-medium">
                          {product.name}
                        </td>
                        <td className="py-4 px-6 text-right font-semibold">
                          {product.stock} units
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              isEmpty
                                ? 'bg-red-100 text-red-800'
                                : isLow
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {isEmpty
                              ? 'Out of Stock'
                              : isLow
                                ? 'Low Stock'
                                : 'In Stock'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleReduceStock(product._id)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                          >
                            <Minus size={16} />
                            Reduce
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products available. Add products first.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
