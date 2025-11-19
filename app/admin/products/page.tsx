'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import AdminLayout from '@/app/components/AdminLayout';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function AdminProducts() {
  const { user } = useAuth();
  const products = useQuery(api.products.getAllProducts) || [];
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    image: '',
    category: 'headphones',
    stock: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.slug || !formData.category) {
      toast.warning('⚠️ Please fill in all required fields');
      return;
    }

    if (!user?.id) {
      toast.error('You must be logged in to manage products');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateProduct({
          productId: editingId as Id<'products'>,
          ...formData,
          userId: user.id as Id<'users'>,
        });
        toast.success('✅ Product updated successfully!');
      } else {
        await createProduct({
          ...formData,
          userId: user.id as Id<'users'>,
        });
        toast.success('✅ Product created successfully!');
      }

      setFormData({
        name: '',
        slug: '',
        description: '',
        price: 0,
        image: '',
        category: 'headphones',
        stock: 0,
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    if (!user?.id) {
      toast.error('You must be logged in to manage products');
      return;
    }

    try {
      await deleteProduct({
        productId: id as Id<'products'>,
        userId: user.id as Id<'users'>,
      });
      toast.success('✅ Product deleted successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Failed to delete product');
    }
  };

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Products</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  name: '',
                  slug: '',
                  description: '',
                  price: 0,
                  image: '',
                  category: 'headphones',
                  stock: 0,
                });
              }}
              className="flex items-center gap-2 bg-[#d87d4a] text-white px-6 py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="e.g., XX99 Mark II"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Slug *
                    </label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="e.g., xx99-mark-ii"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                    >
                      <option value="headphones">Headphones</option>
                      <option value="earphones">Earphones</option>
                      <option value="speakers">Speakers</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                    rows={4}
                    placeholder="Product description..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#d87d4a] text-white py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold disabled:opacity-50"
                  >
                    {submitting
                      ? 'Saving...'
                      : editingId
                        ? 'Update Product'
                        : 'Create Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">Name</th>
                  <th className="text-left py-4 px-6 font-semibold">
                    Category
                  </th>
                  <th className="text-right py-4 px-6 font-semibold">Price</th>
                  <th className="text-right py-4 px-6 font-semibold">Stock</th>
                  <th className="text-center py-4 px-6 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map(
                  (product: {
                    _id: string;
                    name: string;
                    category: string;
                    price: number;
                    stock: number;
                    slug: string;
                    description: string;
                    image?: string;
                  }) => (
                    <tr key={product._id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-6">{product.name}</td>
                      <td className="py-4 px-6 capitalize">
                        {product.category}
                      </td>
                      <td className="py-4 px-6 text-right font-semibold">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.stock > 0
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(product._id);
                              setFormData({
                                name: product.name,
                                slug: product.slug,
                                description: product.description,
                                price: product.price,
                                image: product.image || '',
                                category: product.category,
                                stock: product.stock,
                              });
                              setShowForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {products.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No products yet. Click &quot;Add Product&quot; to create one.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
