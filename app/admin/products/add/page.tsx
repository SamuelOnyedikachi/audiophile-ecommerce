'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import AdminSidebar from '@/app/components/AdminSidebar';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddUpdateProductPage() {
  const { user } = useAuth();
  const products = useQuery(api.products.getAllProducts) || [];
  const createProduct = useMutation(api.products.createProduct);
  const updateProduct = useMutation(api.products.updateProduct);

  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
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

  const handleSelectProduct = (productId: string) => {
    const product = products.find(
      (p: {
        _id: string;
        name: string;
        slug: string;
        description: string;
        price: number;
        image?: string;
        category: string;
        stock: number;
      }) => p._id === productId
    );
    if (product) {
      setSelectedProductId(productId);
      setFormData({
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        image: product.image || '',
        category: product.category,
        stock: product.stock,
      });
    }
  };

  const handleClearSelection = () => {
    setSelectedProductId(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: 0,
      image: '',
      category: 'headphones',
      stock: 0,
    });
  };

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
      if (selectedProductId) {
        await updateProduct({
          productId: selectedProductId as Id<'products'>,
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

      handleClearSelection();
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Failed to save product');
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
                href="/admin/products"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Add / Update Product</h1>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedProductId
                    ? 'Update an existing product'
                    : 'Create a new product'}
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Form */}
              <div className="lg:col-span-2">
                <div className="bg-white p-8 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-bold mb-6">
                    {selectedProductId
                      ? 'Edit Product Details'
                      : 'New Product Details'}
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
                          : selectedProductId
                            ? 'Update Product'
                            : 'Create Product'}
                      </button>
                      {selectedProductId && (
                        <button
                          type="button"
                          onClick={handleClearSelection}
                          className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                        >
                          Create New
                        </button>
                      )}
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column - Product List */}
              <div>
                <div className="bg-white p-6 rounded-lg shadow-lg sticky top-8">
                  <h2 className="text-lg font-bold mb-4">Select to Update</h2>
                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {products.length === 0 ? (
                      <p className="text-gray-500 text-sm text-center py-8">
                        No products found. Create one to get started.
                      </p>
                    ) : (
                      products.map(
                        (product: {
                          _id: string;
                          name: string;
                          slug: string;
                          description: string;
                          price: number;
                          image?: string;
                          category: string;
                          stock: number;
                        }) => (
                          <button
                            key={product._id}
                            onClick={() => handleSelectProduct(product._id)}
                            className={`w-full text-left p-3 rounded-lg transition ${
                              selectedProductId === product._id
                                ? 'bg-[#d87d4a] text-white'
                                : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                            }`}
                          >
                            <p className="font-semibold text-sm">
                              {product.name}
                            </p>
                            <p
                              className={`text-xs ${selectedProductId === product._id ? 'text-orange-100' : 'text-gray-600'}`}
                            >
                              {product.category}
                            </p>
                          </button>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
