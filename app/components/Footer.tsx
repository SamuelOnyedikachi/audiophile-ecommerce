import {
  Facebook,
  Instagram,
  LinkedinIcon,
} from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[rgb(18,18,18)] text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h3 className="text-2xl font-bold tracking-wider lowercase">
              Audiophile
            </h3>
            <p className="text-md text-gray-400 max-w-[70%] mt-3">
              Audiophile is an all in one stop to fulfill your audio needs.
              We're a small team of music lovers and sound specialists who are
              devoted to helping you get the most out of personal audio. Come
              and visit our demo facility - we’re open 7 days a week.
            </p>
          </div>

          <div className="flex uppercase flex-col gap-10">
            <div className="flex">
              <ul className="text-sm flex gap-10 text-white font-semibold space-y-2">
                <li>
                  <Link href="/" className="hover:text-orange-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/headphones" className="hover:text-orange-400">
                    Headphones
                  </Link>
                </li>
                <li>
                  <Link href="/speakers" className="hover:text-orange-400">
                    Speakers
                  </Link>
                </li>
                <li>
                  <Link href="/earphones" className="hover:text-orange-400">
                    Earphones
                  </Link>
                </li>
              </ul>
            </div>

            <div className="flex flex-col md:items-end">
              <ul className="text-sm flex gap-5 text-gray-500 space-y-2">
                <li>
                  <Link href="/contact" className="hover:text-orange-400">
                    <Facebook />
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-orange-400">
                    <LinkedinIcon />
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-orange-400">
                    <Instagram />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-left text-sm text-gray-400">
          © {new Date().getFullYear()} Audiophile. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
