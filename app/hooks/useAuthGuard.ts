'use client';

import { useAuth } from '@/app/components/AuthProvider';
import { useRouter } from 'next/navigation';

/**
 * Hook to check if user is authenticated.
 * If not authenticated, redirects to /signup.
 * Returns true if authenticated, false if redirecting.
 */
export function useAuthGuard() {
  const { user } = useAuth();
  const router = useRouter();

  const requireAuth = (callback?: () => void, redirectTo?: string) => {
    if (user === null) {
      // Not authenticated, redirect to signup or login
      router.push(redirectTo || '/signup');
      return false;
    }
    // Authenticated, execute callback if provided
    if (callback) {
      callback();
    }
    // If redirectTo provided and authenticated, navigate there
    if (redirectTo) {
      router.push(redirectTo);
    }
    return true;
  };

  return { isAuthenticated: user !== null, requireAuth };
}
