export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white mt-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <div>
            <h3 className="text-lg font-bold tracking-wider uppercase">
              Audiophile
            </h3>
            <p className="text-sm text-gray-400 max-w-md mt-3">
              High-quality audio gear for true music lovers. Built with care and
              crafted for sound.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <h4 className="text-sm font-semibold mb-3">Shop</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <a href="/headphones" className="hover:text-orange-400">
                    Headphones
                  </a>
                </li>
                <li>
                  <a href="/speakers" className="hover:text-orange-400">
                    Speakers
                  </a>
                </li>
                <li>
                  <a href="/earphones" className="hover:text-orange-400">
                    Earphones
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3">Support</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>
                  <a href="/contact" className="hover:text-orange-400">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/faq" className="hover:text-orange-400">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/6 mt-8 pt-6 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Audiophile. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
