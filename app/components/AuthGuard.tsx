'use client';

import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // If explicitly unauthenticated (null) redirect to login with redirect query
    if (user === null) {
      const redirect = encodeURIComponent(pathname || '/');
      router.push(`/login?redirect=${redirect}`);
    }
  }, [user, pathname, router]);

  // While redirecting or unauthenticated, don't render children
  if (user === null) return null;

  return <>{children}</>;
}
