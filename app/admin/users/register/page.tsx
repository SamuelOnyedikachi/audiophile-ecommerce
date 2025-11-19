'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import Link from 'next/link';
import { ArrowLeft, Loader } from 'lucide-react';
import { toast } from 'react-toastify';
import { useAuth } from '@/app/components/AuthProvider';

export default function RegisterUsersPage() {
  const { user } = useAuth();

  // Only super-admins can create new admins/super-admins
  const isSuperAdmin = user?.isSuperAdmin;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user', // 'user', 'cashier', 'admin', 'superadmin'
  });

  const [loading, setLoading] = useState(false);
  const signupMutation = useMutation(api.auth.signup);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Only super-admins can create admin/superadmin accounts
    if (
      (formData.role === 'admin' || formData.role === 'superadmin') &&
      !isSuperAdmin
    ) {
      toast.error('Only Super Administrators can create admin accounts');
      return;
    }

    setLoading(true);

    try {
      await signupMutation({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      toast.success(`✅ User ${formData.name} registered successfully!`);
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
      });

      // Optionally redirect to users list or stay on page
      // router.push('/admin/users');
    } catch (error) {
      console.error('Error registering user:', error);
      const errMsg =
        error instanceof Error ? error.message : 'Failed to register user';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/admin/dashboard"
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Register Users
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Create new user, cashier, or admin accounts
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="bg-white p-8 rounded-lg shadow-sm">
          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Role Info:</strong>
              <br /> <strong>User:</strong> Customer account <br />
              <strong>Cashier:</strong> Staff account with limited access <br />
              <strong>Admin:</strong> Full administrative access (Super Admin
              only)
              <br />
              <strong>Super Admin:</strong> Full access including admin creation
              (Super Admin only)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="john@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                disabled={loading}
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                disabled={loading}
                required
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Role *
              </label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                disabled={loading}
              >
                <option value="user">User (Customer)</option>
                <option value="cashier">Cashier (Staff)</option>
                {isSuperAdmin && <option value="admin">Admin</option>}
                {isSuperAdmin && (
                  <option value="superadmin">Super Admin</option>
                )}
              </select>
              {!isSuperAdmin &&
                (formData.role === 'admin' ||
                  formData.role === 'superadmin') && (
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ Only Super Admins can create admin/super-admin accounts
                  </p>
                )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-4 pt-6 border-t">
              <Link
                href="/admin/dashboard"
                className="flex-1 border-2 border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-[#d87d4a] text-white py-3 rounded-lg font-semibold hover:bg-[#fbaf85] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <Loader size={18} className="animate-spin" />}
                {loading ? 'Registering...' : 'Register User'}
              </button>
            </div>
          </form>

          {/* Admin Note */}
          <div className="mt-8 p-4 bg-gray-100 rounded-lg text-xs text-gray-700">
            <p>
              <strong>Admin Note:</strong> To promote an existing user to Super
              Admin, use the Convex Console or call the migration action{' '}
              <code className="bg-gray-200 px-1 rounded">
                promoteToSuperAdmin
              </code>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
