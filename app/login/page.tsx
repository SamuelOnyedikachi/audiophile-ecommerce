'use client';

import { useAuth } from '@/app/components/AuthProvider';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const { login, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Safe redirect effect
  useEffect(() => {
    if (!user) return; // no user yet

    if (user.isAdmin || user.isSuperAdmin) {
      router.replace('/admin/dashboard'); // replace instead of push
    } else {
      router.replace(redirect);
    }
  }, [user, router, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.message || 'Login failed');
      }
      // redirect is handled by useEffect
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Checking authentication...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">Login</h1>
        <p className="text-gray-600 text-center mb-8">
          Welcome back! Sign in to your account.
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
              placeholder="you@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d87d4a]"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#d87d4a] text-white font-semibold py-3 rounded-lg hover:bg-[#fbaf85] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don&apos;t have an account?{' '}
          <Link
            href="/signup"
            className="text-[#d87d4a] font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>

        <p className="text-center text-xs text-gray-500 mt-8">
          Demo credentials: test@example.com / password123
        </p>
      </div>
    </div>
  );
}
