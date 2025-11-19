'use client';

import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

type ProductLocal = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  createdAt: string;
};

export default function ProductAdWidget() {
  const products = (useQuery(api.products.getAllProducts) ||
    []) as ProductLocal[];

  // Sort newest first
  const sorted = [...products].sort(
    (a: ProductLocal, b: ProductLocal) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Show up to 5 items (newest + existing mix)
  const visible = sorted.slice(0, 5);

  if (!visible.length) return null;

  return (
    <div
      aria-hidden
      className={
        'fixed z-50 lg:bottom-6 lg:right-6 lg:w-80 md:bottom-0 md:left-0 md:right-0 md:w-full sm:bottom-0 sm:left-0 sm:right-0 sm:w-full ' +
        'pointer-events-auto'
      }
    >
      <div className="hidden lg:block">
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="p-3 border-b">
            <p className="text-sm font-semibold text-gray-700">
              New & Featured
            </p>
          </div>
          <div className="p-3 space-y-3">
            {visible.map((p: ProductLocal) => (
              <a
                key={p._id}
                href={`/product/${p.slug}`}
                className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-md transition"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No image</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">${p.price.toFixed(2)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/iPad bottom bar */}
      <div className="block lg:hidden">
        <div className="bg-white border-t shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 overflow-x-auto">
            {visible.map((p: ProductLocal) => (
              <a
                key={p._id}
                href={`/product/${p.slug}`}
                className="shrink-0 w-44 bg-gray-50 rounded-lg p-2 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {p.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500">No image</span>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{p.name}</p>
                  <p className="text-xs text-gray-500">${p.price.toFixed(2)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
