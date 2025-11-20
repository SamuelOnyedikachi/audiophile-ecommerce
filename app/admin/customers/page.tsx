'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import AdminSidebar from '@/app/components/AdminSidebar';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import { Trash2, Edit2, Plus } from 'lucide-react';

export default function AdminCustomers() {
  const { user } = useAuth();
  const customers = useQuery(api.customers.getAllCustomers) || [];
  const createCustomer = useMutation(api.customers.createCustomer);
  const updateCustomer = useMutation(api.customers.updateCustomer);
  const deleteCustomer = useMutation(api.customers.deleteCustomer);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'user',
    address: '',
    city: '',
    country: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.warning('⚠️ Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    try {
      if (editingId) {
        await updateCustomer({
          customerId: editingId as any,
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          role: formData.role,
        });
        toast.success('✅ Customer updated successfully!');
      } else {
        await createCustomer({
          ...formData,
          createdBy: user?.name || 'admin',
        });
        toast.success('✅ Customer registered successfully!');
      }

      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'user',
        address: '',
        city: '',
        country: '',
      });
      setEditingId(null);
      setShowForm(false);
    } catch (error: any) {
      console.error('❌ Error:', error);
      toast.error(`❌ ${error.message || 'Failed to save customer'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      await deleteCustomer({ customerId: id as any });
      toast.success('✅ Customer deleted successfully!');
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('❌ Failed to delete customer');
    }
  };

  return (
    <AdminAuthGuard>
      <div className="flex flex-col md:flex-row md:h-screen">
        <AdminSidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Customers</h1>
              <button
                onClick={() => {
                  setShowForm(!showForm);
                  setEditingId(null);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    role: 'user',
                    address: '',
                    city: '',
                    country: '',
                  });
                }}
                className="flex items-center gap-2 bg-[#d87d4a] text-white px-6 py-3 rounded-lg hover:bg-[#fbaf85] transition font-semibold"
              >
                <Plus size={20} />
                Register Customer
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-bold mb-6">
                  {editingId ? 'Edit Customer' : 'Register New Customer'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                        placeholder="John Doe"
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
                        placeholder="john@example.com"
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
                        Role *
                      </label>
                      <select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                      >
                        <option value="user">User (Customer)</option>
                        <option value="cashier">Cashier</option>
                      </select>
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
                        placeholder="123 Main St"
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
                        placeholder="New York"
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
                        placeholder="USA"
                      />
                    </div>
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
                          ? 'Update Customer'
                          : 'Register Customer'}
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

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold">Name</th>
                    <th className="text-left py-4 px-6 font-semibold">Email</th>
                    <th className="text-left py-4 px-6 font-semibold">Phone</th>
                    <th className="text-center py-4 px-6 font-semibold">
                      Role
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
                  {customers.map((customer: any) => (
                    <tr
                      key={customer._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-4 px-6 font-medium">{customer.name}</td>
                      <td className="py-4 px-6">{customer.email}</td>
                      <td className="py-4 px-6">{customer.phone}</td>
                      <td className="py-4 px-6 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            customer.role === 'cashier'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {customer.role === 'cashier' ? 'Cashier' : 'Customer'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                          Active
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              setEditingId(customer._id);
                              setFormData({
                                name: customer.name,
                                email: customer.email,
                                phone: customer.phone,
                                role: customer.role,
                                address: customer.address || '',
                                city: customer.city || '',
                                country: customer.country || '',
                              });
                              setShowForm(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(customer._id)}
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

              {customers.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No customers registered yet. Click "Register Customer" to add
                  one.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminAuthGuard>
  );
}
