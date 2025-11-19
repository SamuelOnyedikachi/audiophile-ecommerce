'use client';

import { useState } from 'react';
import { ShoppingCart, Menu, X, LogOut } from 'lucide-react';
import Cart from './Cart';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useCart } from './CartProvider';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { items } = useCart();

  return (
    <header className="w-full bg-[#121212] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-20 md:h-24 border-b border-white/10">
          {/* Logo */}
          <div className="text-xl md:text-xl font-bold tracking-widest uppercase cursor-pointer">
            <Link href="/">Audiophile</Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 lg:gap-10 text-sm tracking-wide font-semibold uppercase">
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
            <Link
              href="/track-order"
              className="hover:text-orange-500 transition-colors"
            >
              Track Order
            </Link>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center gap-8">
            {/* Cart Icon */}
            <button
              onClick={() => setCartOpen(!cartOpen)}
              aria-label="Open Cart"
              className="relative p-2 rounded-md hover:text-orange-500 transition"
            >
              <ShoppingCart size={24} strokeWidth={1.5} />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#d87d4a] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                <span className="text-sm text-gray-300">{user.name}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-black-200 rounded hover:bg-red-700 transition"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#d87d4a] rounded hover:bg-[#fbaf85] transition"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#121212] border border-white rounded hover:bg-white hover:text-black transition"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              className="md:hidden p-2 rounded-md hover:text-orange-500 transition"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#1a1a1a] border-t border-white/10">
          <nav className="flex flex-col items-center gap-6 py-6 text-sm font-semibold uppercase tracking-widest">
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
            <Link
              href="/track-order"
              className="hover:text-orange-500 transition"
              onClick={() => setMenuOpen(false)}
            >
              Track Order
            </Link>
            {/* Mobile Auth Buttons */}
            {user ? (
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10 w-full">
                <span className="text-sm text-gray-300">{user.name}</span>
                <button
                  onClick={() => {
                    logout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition w-full justify-center"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10 w-full">
                <Link
                  href="/login"
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-[#d87d4a] rounded hover:bg-[#fbaf85] transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-[#121212] border border-white rounded hover:bg-white hover:text-black transition"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}

      {/* Cart Drawer */}
      {cartOpen && <Cart setCartOpen={setCartOpen} />}
    </header>
  );
}
