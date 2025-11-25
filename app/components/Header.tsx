'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart,
  Menu,
  X,
  LogOut,
  User,
  Clock,
  Briefcase,
} from 'lucide-react';
import Cart from './Cart';
import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useCart } from './CartProvider';

export default function Header() {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loginTime, setLoginTime] = useState<string>('');
  const { user, logout } = useAuth();
  const { items } = useCart();
  const profileRef = useRef<HTMLDivElement>(null);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Store login time when user logs in
  useEffect(() => {
    if (user) {
      const storedLoginTime = localStorage.getItem('loginTime');
      if (!storedLoginTime) {
        const now = new Date().toLocaleString();
        localStorage.setItem('loginTime', now);
        setLoginTime(now);
      } else {
        setLoginTime(storedLoginTime);
      }
    }
  }, [user]);

  // Auto-logout after 2 minutes of inactivity
  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }

      // Set new timer for 2 minutes (120000ms)
      inactivityTimerRef.current = setTimeout(() => {
        logout();
        localStorage.removeItem('loginTime');
        alert('You have been logged out due to inactivity.');
      }, 120000); // 2 minutes
    };

    // Events to track user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click',
    ];

    // Add event listeners
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [user, logout]);

  // Close profile card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    if (profileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileOpen]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('loginTime');
    setProfileOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

            {/* Auth Buttons / Profile */}
            {user ? (
              <div
                className="hidden md:flex items-center gap-3 relative"
                ref={profileRef}
              >
                {/* Profile Picture/Avatar */}
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[#d87d4a] transition"
                  aria-label="Open Profile"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#d87d4a] to-[#ef702b] rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {getUserInitials(user.name)}
                  </div>
                </button>

                {/* Profile Card Dropdown */}
                {profileOpen && (
                  <div className="absolute top-14 right-0 w- bg-white text-black rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#702e05] to-[#fbaf85] p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-xl font-bold text-[#d87d4a]">
                          {getUserInitials(user.name)}
                        </div>
                        <div className="text-white">
                          <h3 className="font-bold text-lg">{user.name}</h3>
                          <p className="text-sm opacity-90">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 space-y-3">
                      {/* Username */}
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <User size={18} className="text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Username
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {user.name}
                          </p>
                        </div>
                      </div>

                      {/* Designation/Role */}
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <Briefcase size={18} className="text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Role
                          </p>
                          <p className="text-sm font-semibold text-gray-800 capitalize">
                            {user.isAdmin
                              ? 'Administrator'
                              : user.role || 'Customer'}
                          </p>
                        </div>
                      </div>

                      {/* Login Time */}
                      <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                        <Clock size={18} className="text-gray-600" />
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            Login Time
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {loginTime}
                          </p>
                        </div>
                      </div>

                      {/* Admin Link */}
                      {user.isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                          onClick={() => setProfileOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      )}

                      {/* Logout Button */}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10 w-full px-6">
                {/* Mobile Profile Card */}
                <div className="w-full bg-[#2a2a2a] rounded-lg p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#d87d4a] to-[#fbaf85] rounded-full flex items-center justify-center text-sm font-bold text-white">
                      {getUserInitials(user.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Briefcase size={14} />
                      <span>
                        {user.isAdmin
                          ? 'Administrator'
                          : user.role || 'Customer'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock size={14} />
                      <span className="text-xs">{loginTime}</span>
                    </div>
                  </div>

                  {user.isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      className="block w-full text-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded hover:bg-red-700 transition w-full justify-center"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 pt-4 border-t border-white/10 w-full px-6">
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