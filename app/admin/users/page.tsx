'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import AdminLayout from '@/app/components/AdminLayout';
import AdminAuthGuard from '@/app/components/AdminAuthGuard';
import { useAuth } from '@/app/components/AuthProvider';
import { toast } from 'react-toastify';
import {
  Edit2,
  Trash2,
  X,
  Save,
  Loader,
  Shield,
  ShieldAlert,
} from 'lucide-react';

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const users = useQuery(api.users.getAllUsers) || [];
  const updateUser = useMutation(api.users.updateUserInfo);
  const deleteUser = useMutation(api.users.deleteUser);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    role: '',
    isAdmin: false,
    isSuperAdmin: false,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleEdit = (user: User) => {
    setEditingId(user._id);
    setEditForm({
      name: user.name,
      email: user.email,
      role: user.role,
      isAdmin: user.isAdmin ?? false,
      isSuperAdmin: user.isSuperAdmin ?? false,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({
      name: '',
      email: '',
      role: '',
      isAdmin: false,
      isSuperAdmin: false,
    });
  };

  const handleSave = async () => {
    if (!editingId || !currentUser?.id) return;

    if (!editForm.name.trim() || !editForm.email.trim()) {
      toast.warning('⚠️ Name and email are required');
      return;
    }

    setSubmitting(true);
    try {
      await updateUser({
        userId: editingId as Id<'users'>,
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
        isAdmin: editForm.isAdmin,
        isSuperAdmin: editForm.isSuperAdmin,
        callerUserId: currentUser.id as Id<'users'>,
      });

      toast.success('✅ User updated successfully!');
      setEditingId(null);
    } catch (error) {
      console.error('Error updating user:', error);
      const msg =
        error instanceof Error ? error.message : 'Failed to update user';
      toast.error(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (userId: string) => {
    if (!currentUser?.id) {
      toast.error('You must be logged in');
      return;
    }

    if (!confirm('Are you sure you want to delete this user?')) return;

    setSubmitting(true);
    try {
      await deleteUser({
        userId: userId as Id<'users'>,
        callerUserId: currentUser.id as Id<'users'>,
      });

      toast.success('✅ User deleted successfully!');
    } catch (error) {
      console.error('Error deleting user:', error);
      const msg =
        error instanceof Error ? error.message : 'Failed to delete user';
      toast.error(`❌ ${msg}`);
    } finally {
      setSubmitting(false);
    }
  };

  const roleOptions = [
    { value: 'client', label: 'Client' },
    { value: 'cashier', label: 'Cashier' },
    { value: 'admin', label: 'Admin' },
    { value: 'superadmin', label: 'Super Admin' },
  ];

  return (
    <AdminAuthGuard>
      <AdminLayout>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Users Management
            </h1>
            <p className="text-gray-600 mt-2">
              View and manage all users. Only super-admins can edit user roles
              and permissions.
            </p>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold">Name</th>
                  <th className="text-left py-4 px-6 font-semibold">Email</th>
                  <th className="text-left py-4 px-6 font-semibold">Role</th>
                  <th className="text-center py-4 px-6 font-semibold">
                    Permissions
                  </th>
                  <th className="text-center py-4 px-6 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: User) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    {editingId === user._id ? (
                      <>
                        {/* Edit Mode */}
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm({ ...editForm, name: e.target.value })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                email: e.target.value,
                              })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                          />
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={editForm.role}
                            onChange={(e) =>
                              setEditForm({ ...editForm, role: e.target.value })
                            }
                            className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
                          >
                            {roleOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-4 px-6">
                          <div className="space-y-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editForm.isAdmin}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    isAdmin: e.target.checked,
                                  })
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-xs">Admin</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editForm.isSuperAdmin}
                                onChange={(e) =>
                                  setEditForm({
                                    ...editForm,
                                    isSuperAdmin: e.target.checked,
                                  })
                                }
                                className="w-4 h-4"
                              />
                              <span className="text-xs">Super Admin</span>
                            </label>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={handleSave}
                              disabled={submitting}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                              title="Save"
                            >
                              {submitting ? (
                                <Loader size={18} className="animate-spin" />
                              ) : (
                                <Save size={18} />
                              )}
                            </button>
                            <button
                              onClick={handleCancel}
                              disabled={submitting}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                              title="Cancel"
                            >
                              <X size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* View Mode */}
                        <td className="py-4 px-6 font-medium">{user.name}</td>
                        <td className="py-4 px-6 text-gray-600">
                          {user.email}
                        </td>
                        <td className="py-4 px-6 capitalize">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            {user.isSuperAdmin && (
                              <div
                                className="flex items-center gap-1 px-2 py-1 bg-purple-100 rounded"
                                title="Super Administrator"
                              >
                                <ShieldAlert
                                  size={14}
                                  className="text-purple-700"
                                />
                                <span className="text-xs text-purple-700 font-semibold">
                                  Super
                                </span>
                              </div>
                            )}
                            {user.isAdmin && !user.isSuperAdmin && (
                              <div
                                className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded"
                                title="Administrator"
                              >
                                <Shield size={14} className="text-blue-700" />
                                <span className="text-xs text-blue-700 font-semibold">
                                  Admin
                                </span>
                              </div>
                            )}
                            {!user.isAdmin && !user.isSuperAdmin && (
                              <span className="text-xs text-gray-500">
                                None
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit user"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(user._id)}
                              disabled={
                                submitting || user._id === currentUser?.id
                              }
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                user._id === currentUser?.id
                                  ? 'Cannot delete your own account'
                                  : 'Delete user'
                              }
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No users found.
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
            <h3 className="font-semibold text-blue-900 mb-3">
              Permission Levels
            </h3>
            <div className="text-sm text-blue-800 space-y-2">
              <p>
                <strong>Super Admin:</strong> Full access to all features
                including user management, can create/edit admins
              </p>
              <p>
                <strong>Admin:</strong> Can manage products, orders, and stock
                but cannot manage other admins
              </p>
              <p>
                <strong>Cashier:</strong> Limited access for point-of-sale
                operations
              </p>
              <p>
                <strong>Client:</strong> Regular customer account with order
                tracking
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    </AdminAuthGuard>
  );
}