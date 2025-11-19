'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import AdminLayout from '@/app/components/AdminLayout';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function AdminVendors() {
  const { user } = useAuth();
  const vendors = useQuery(api.vendors.getAllVendors) || [];
  const createVendor = useMutation(api.vendors.createVendor);
  const updateVendor = useMutation(api.vendors.updateVendor);
  const deleteVendor = useMutation(api.vendors.deleteVendor);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    businessName: '',
    registrationNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.businessName) {
      toast.warning('⚠️ Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateVendor({
          vendorId: editingId as any,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          businessName: formData.businessName,
        });
        toast.success('✅ Vendor updated successfully!');
      } else {
        await createVendor({
          ...formData,
          createdBy: user?.name || 'admin',
        });
        toast.success('✅ Vendor registered successfully!');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        businessName: '',
        registrationNumber: '',
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error: any) {
      console.error('❌ Error:', error);
      toast.error(`❌ ${error.message || 'Failed to save vendor'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor?')) return;

    try {
      await deleteVendor({ vendorId: id as any });
      toast.success('✅ Vendor deleted successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Failed to delete vendor');
    }
  };

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Vendors</h1>
            <button
              onClick={() => {
                setShowForm(!showForm);
                setEditingId(null);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  address: '',
                  city: '',
                  country: '',
                  businessName: '',
                  registrationNumber: '',
                });
              }}
              className="flex items-center gap-2 bg-[#d87d4a] text-white px-6 py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold"
            >
              <Plus size={20} />
              Register Vendor
            </button>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-6">
                {editingId ? 'Edit Vendor' : 'Register New Vendor'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="John Vendor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="vendor@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="+1234567890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="My Business Ltd"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="123 Business Ave"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="Lagos"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="Nigeria"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      placeholder="RC123456"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-[#d87d4a] text-white py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingId ? 'Update Vendor' : 'Register Vendor'}
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

          {/* Vendors Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">Name</th>
                  <th className="text-left py-4 px-6 font-semibold">Business</th>
                  <th className="text-left py-4 px-6 font-semibold">Email</th>
                  <th className="text-left py-4 px-6 font-semibold">Phone</th>
                  <th className="text-center py-4 px-6 font-semibold">Status</th>
                  <th className="text-center py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor: any) => (
                  <tr key={vendor._id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-6 font-medium">{vendor.name}</td>
                    <td className="py-4 px-6">{vendor.businessName}</td>
                    <td className="py-4 px-6">{vendor.email}</td>
                    <td className="py-4 px-6">{vendor.phone}</td>
                    <td className="py-4 px-6 text-center">
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        Active
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => {
                            setEditingId(vendor._id);
                            setFormData({
                              name: vendor.name,
                              email: vendor.email,
                              phone: vendor.phone,
                              address: vendor.address,
                              city: vendor.city,
                              country: vendor.country,
                              businessName: vendor.businessName,
                              registrationNumber: vendor.registrationNumber || '',
                            });
                            setShowForm(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(vendor._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {vendors.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No vendors registered yet. Click "Register Vendor" to add one.
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}
