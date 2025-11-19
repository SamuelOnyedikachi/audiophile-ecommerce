'use client';

import React, { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'react-toastify';

type User = {
  id?: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'superadmin';
  isAdmin?: boolean;
  isSuperAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  signup: (data: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER = 'ae_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(CURRENT_USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const router = useRouter();

  // Convex mutations
  const signupMutation = useMutation(api.auth.signup);
  const loginMutation = useMutation(api.auth.login);

  const persistUser = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem(CURRENT_USER, JSON.stringify(u));
    else localStorage.removeItem(CURRENT_USER);
  };

  const signup = async ({
    name,
    email,
    password,
    role = 'client',
  }: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }) => {
    try {
      const result = await signupMutation({
        name,
        email,
        password,
        role,
      });

      if (result.success) {
        const newUser: User = {
          name,
          email,
          role:
            role === 'admin'
              ? 'admin'
              : role === 'superadmin'
                ? 'superadmin'
                : 'client',
          isAdmin: role === 'admin' || role === 'superadmin',
          isSuperAdmin: role === 'superadmin',
        };
        persistUser(newUser);
        console.log(' Signup Success:', name);
        toast.success(` Account created! Welcome, ${name}!`);
        return { success: true };
      }
      const errMsg = 'Email already exists or signup failed';
      console.error(' Signup Error:', errMsg);
      toast.warning(` ${errMsg}. Please try again or log in.`);
      return { success: false, message: errMsg };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      console.error(' Signup Exception:', error);
      toast.warning(` Please check your information and try again.`);
      return { success: false, message };
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const result = await loginMutation({ email, password });

      if (result.success) {
        const u: User = {
          id: result.user?.id,
          name: result.user.name,
          email: result.user.email,
          role:
            result.user.role === 'superadmin'
              ? 'superadmin'
              : result.user.role === 'admin'
                ? 'admin'
                : 'client',
          isAdmin: !!result.user.isAdmin,
          isSuperAdmin: !!result.user.isSuperAdmin,
        };
        persistUser(u);
        console.log(' Login Success:', u.name);
        toast.success(` Welcome back, ${u.name}!`);
        return { success: true };
      }
      const errMsg = 'Invalid email or password';
      console.error(' Login Error:', errMsg);
      toast.warning(` ${errMsg}. Please check and try again.`);
      return { success: false, message: errMsg };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      console.error(' Login Exception:', error);
      toast.warning(` Please check your credentials and try again.`);
      return { success: false, message };
    }
  };

  const logout = () => {
    persistUser(null);
    console.log(' User logged out');
    toast.info(' You have been logged out. See you soon!');
    router.push('/');
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout }}>
      {/* Prevent non-super admins from viewing client pages */}
      {user && user.isAdmin && !user.isSuperAdmin ? (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Access restricted</h2>
            <p className="text-sm text-gray-600 mb-4">
              Your account is an administrator account and cannot access
              customer-facing pages. Only Super Administrators may view client
              pages. Use the Admin Dashboard or contact a Super Administrator.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin')}
                className="flex-1 bg-[#d87d4a] text-white py-2 rounded-lg font-semibold"
              >
                Go to Admin
              </button>
              <button
                onClick={() => logout()}
                className="flex-1 border border-gray-300 py-2 rounded-lg font-semibold"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export default AuthProvider;
