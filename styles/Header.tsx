import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-black text-white">
      <div className="container mx-auto flex items-center justify-between p-6">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold">
            audiophile
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          <Link
            href="/"
            className="hover:text-primary transition-colors duration-300"
          >
            Home
          </Link>
          <Link
            href="/headphones"
            className="hover:text-primary transition-colors duration-300"
          >
            Headphones
          </Link>
          <Link
            href="/speakers"
            className="hover:text-primary transition-colors duration-300"
          >
            Speakers
          </Link>
          <Link
            href="/earphones"
            className="hover:text-primary transition-colors duration-300"
          >
            Earphones
          </Link>
        </nav>

        <div className="flex items-center">
          {/* You can add a cart icon here */}
        </div>
      </div>
    </header>
  );
};

export default Header;
