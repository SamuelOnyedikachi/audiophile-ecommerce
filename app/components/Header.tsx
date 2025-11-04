'use client';

import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Cart from './Cart';
import Link from 'next/link';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="w-full bg-[#121212] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-24 md:h-28 border-b border-white/10">
          {/* Logo */}
          <div className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase cursor-pointer">
            Audiophile
          </div>

          {/* Navigation */}
          <nav className="flex gap-10 text-sm font-semibold tracking-[0.1em] uppercase">
            <Link href="/" className="hover:text-orange-500 transition-colors">
              Home
            </Link>
            <Link
              href="/headphones"
              className="hover:text-orange-500 transition-colors"
            >
              Headphones
            </Link>
            <Link
              href="/speakers"
              className="hover:text-orange-500 transition-colors"
            >
              Speakers
            </Link>
            <Link
              href="/earphones"
              className="hover:text-orange-500 transition-colors"
            >
              Earphones
            </Link>
          </nav>

          {/* Cart Icon */}
          <button
            onClick={() => setCartOpen(!cartOpen)}
            aria-label="Open Cart"
            className="p-2 rounded-md hover:text-orange-500 transition"
          >
            <ShoppingCart size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Cart Drawer */}
      {cartOpen && <Cart setCartOpen={setCartOpen} />}
    </header>
  );
}
