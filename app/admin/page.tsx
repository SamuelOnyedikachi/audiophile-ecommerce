'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/components/AuthProvider';

export default function AdminRoot() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (user === null) {
      router.replace('/login');
      return;
    }

    // If user exists but is not admin, redirect to home
    if (user && !user.isAdmin) {
      router.replace('/');
      return;
    }

    // If admin, send to dashboard
    if (user && user.isAdmin) {
      router.replace('/admin/dashboard');
      return;
    }
  }, [user, router]);

  // While auth status resolves, show nothing (client-side redirect)
  return null;
}
