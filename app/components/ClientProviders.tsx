'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { CartProvider } from './CartProvider';
import AuthProvider from './AuthProvider';
import { ToastProvider } from './ToastProvider';
import ProductAdWidget from './ProductAdWidget';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <AuthProvider>
        <CartProvider>
          <ToastProvider />
          {children}
          <ProductAdWidget />
        </CartProvider>
      </AuthProvider>
    </ConvexProvider>
  );
}
