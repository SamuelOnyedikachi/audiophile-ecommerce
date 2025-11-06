import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#191919] text-white mt-auto relative">
      {/* Orange accent bar at top */}
      <div className="h-1 w-24 bg-[#d87d4a] mx-auto md:mx-0 md:ml-[calc((100%-1280px)/2+48px)]"></div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-12 md:py-16">
        {/* Top Section: Logo & Navigation */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 md:gap-0 mb-8">
          {/* Logo */}
          <Link href="/" className="text-center md:text-left">
            <h3 className="text-2xl md:text-3xl font-bold tracking-wider uppercase">
              Audiophile
            </h3>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            <Link
              href="/"
              className="text-sm font-bold uppercase tracking-widest hover:text-[#d87d4a] transition"
            >
              Home
            </Link>
            <Link
              href="/headphones"
              className="text-sm font-bold uppercase tracking-widest hover:text-[#d87d4a] transition"
            >
              Headphones
            </Link>
            <Link
              href="/speakers"
              className="text-sm font-bold uppercase tracking-widest hover:text-[#d87d4a] transition"
            >
              Speakers
            </Link>
            <Link
              href="/earphones"
              className="text-sm font-bold uppercase tracking-widest hover:text-[#d87d4a] transition"
            >
              Earphones
            </Link>
          </nav>
        </div>

        {/* Middle Section: Description & Social Icons */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-8 mb-8">
          {/* Description */}
          <div className="max-w-xl text-center md:text-left">
            <p className="text-[15px] text-gray-400 leading-relaxed opacity-75">
              Audiophile is an all in one stop to fulfill your audio needs.
              We're a small team of music lovers and sound specialists who are
              devoted to helping you get the most out of personal audio. Come
              and visit our demo facility - we're open 7 days a week.
            </p>
          </div>

          {/* Social Media Icons */}
          <div className="flex items-center justify-center md:justify-end gap-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d87d4a] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d87d4a] transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d87d4a] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d87d4a] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6" />
            </a>
          </div>
        </div>

        {/* Bottom Section: Copyright */}
        <div className="text-center md:text-left">
          <p className="text-sm text-gray-400 opacity-60">
            Copyright © {new Date().getFullYear()}. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}