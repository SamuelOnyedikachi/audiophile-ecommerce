'use client';
import { ReactNode } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AdminAuthGuardProps {
  children: ReactNode;
}

export default function AdminAuthGuard({ children }: AdminAuthGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If no user, redirect to login
    if (!user) {
      router.push('/login');
      return;
    }

    // If user is not admin, redirect to home
    if (!user.isAdmin) {
      router.push('/');
      return;
    }

    // If user is not superAdmin, redirect to home
    if (!user.isSuperAdmin) {
      router.push('/');
      return;
    }

    // REMOVED THE PROBLEMATIC REDIRECT TO DASHBOARD
    // User is authenticated and authorized, let them access the page
  }, [user, router]);

  // Show loading or access denied while checking
  if (!user?.isSuperAdmin || !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            You do not have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
