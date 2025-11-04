'use client';

import { useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';
import Cart from './Cart';
import Link from 'next/link';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-[#121212] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20 md:h-24 border-b border-white/10">
          {/* Logo */}
          <div className="text-2xl md:text-3xl font-bold tracking-[0.2em] uppercase cursor-pointer">
            <Link href="/">Audiophile</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 lg:gap-10 text-sm font-semibold tracking-[0.1em] uppercase">
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

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 rounded-md hover:text-orange-500 transition"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

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
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-white/10">
          <nav className="flex flex-col items-center gap-6 py-6 text-sm font-semibold uppercase tracking-[0.1em]">
            <Link
              href="/"
              className="hover:text-orange-500 transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/headphones"
              className="hover:text-orange-500 transition"
              onClick={() => setMenuOpen(false)}
            >
              Headphones
            </Link>
            <Link
              href="/speakers"
              className="hover:text-orange-500 transition"
              onClick={() => setMenuOpen(false)}
            >
              Speakers
            </Link>
            <Link
              href="/earphones"
              className="hover:text-orange-500 transition"
              onClick={() => setMenuOpen(false)}
            >
              Earphones
            </Link>
          </nav>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && <Cart setCartOpen={setCartOpen} />}
    </header>
  );
}
