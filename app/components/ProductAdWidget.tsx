'use client';
import React, { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { X, Sparkles } from 'lucide-react';

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
      className={`fixed z-50 bottom-4 right-4 w-80 max-w-[90vw] pointer-events-auto transition-all duration-700 ease-in-out ${
        isFadingOut ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="bg-white/70 backdrop-blur-xl shadow-2xl shadow-black/10 rounded-2xl overflow-hidden relative border border-white/30">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 p-1 bg-black/5 hover:bg-black/10 rounded-full transition-colors"
          aria-label="Close"
        >
          <X size={18} className="text-gray-600" />
        </button>
        <div className="p-4 border-b border-black/5">
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-600" size={20} />
            <p className="text-base font-bold text-gray-800">New & Featured</p>
          </div>
        </div>
        <div className="p-2.5 space-y-2 max-h-[400px] overflow-y-auto">
          {visible.map((p: ProductLocal) => (
            <a
              key={p._id}
              href={`/product/${p.slug}`}
              className="flex items-center gap-4 hover:bg-black/5 p-2 rounded-xl transition-all duration-200 hover:scale-[1.02]"
            >
              <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-black/5">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <span className="text-xs text-gray-500">No image</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {p.name}
                </p>
                <p className="text-sm text-purple-700 font-medium">
                  ${p.price.toFixed(2)}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
