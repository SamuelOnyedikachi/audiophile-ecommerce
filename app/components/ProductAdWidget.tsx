'use client';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { X } from 'lucide-react';

type ProductLocal = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  image?: string | null;
  createdAt: string;
};

export default function ProductAdWidget() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const products = (useQuery(api.products.getAllProducts) ||
    []) as ProductLocal[];

  const sorted = [...products].sort(
    (a: ProductLocal, b: ProductLocal) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const visible = sorted.slice(0, 5);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 9000);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 10000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const handleClose = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!visible.length || !isVisible) return null;

  return (
    <div
      aria-hidden
      className={
        'fixed z-50 lg:bottom-6 lg:right-6 lg:w-80 md:bottom-0 md:left-5 md:right-0 md:w-full sm:bottom-0 sm:left-0 sm:right-0 sm:w-full pointer-events-auto transition-opacity duration-1000 ' +
        (isFadingOut ? 'opacity-0' : 'opacity-100')
      }
    >
      <div className="hidden lg:block">
        <div className="bg-orange-300 shadow-lg rounded-xl overflow-hidden relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 p-1 bg-gray-200 hover:bg-gray-200 rounded-full transition"
            aria-label="Close"
          >
            <X size={16} className="text-gray-600" />
          </button>
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
      <div className="block lg:hidden">
        <div className="bg-white border-t shadow-lg relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 p-1 bg-gray-100 hover:bg-gray-200 rounded-full transition"
            aria-label="Close"
          >
            <X size={16} className="text-gray-600" />
          </button>
          <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-3 overflow-x-auto">
            {visible.map((p: ProductLocal) => (
              <a
                key={p._id}
                href={`/product/${p.slug}`}
                className="shrink-0 w-44 bg-gray-50 rounded-lg p-2 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
                  {p.image ? (
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