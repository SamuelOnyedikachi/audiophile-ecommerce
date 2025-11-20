import Image from 'next/image';
import Link from 'next/link';

export default function SpeakersPage() {
  const products = [
    {
      name: 'ZX9 Speaker',
      description:
        'Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers truly wireless connectivity and exceptional sound quality.',
      image: '/images/product-zx9-speaker/desktop/image-product.jpg',
      new: true,
      href: '/product/zx9-speaker',
    },
    {
      name: 'ZX7 Speaker',
      description:
        'Stream high-quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audio components that represent the top of its class.',
      image: '/images/product-zx7-speaker/desktop/image-product.jpg',
      new: false,
      href: '/product/zx7-speaker',
    },
  ];

  const categories = [
    {
      title: 'Headphones',
      img: '/images/shared/desktop/image-category-thumbnail-headphones.png',
      href: '/headphones',
    },
    {
      title: 'Speakers',
      img: '/images/shared/desktop/image-category-thumbnail-speakers.png',
      href: '/speakers',
    },
    {
      title: 'Earphones',
      img: '/images/shared/desktop/image-category-thumbnail-earphones.png',
      href: '/earphones',
    },
  ];

  return (
    <main className="w-full">
      <section className="bg-black text-white text-center py-24 uppercase tracking-widest text-2xl font-bold">
        Speakers
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20 space-y-32">
        {products.map((p, i) => (
          <div
            key={p.name}
            className={`flex flex-col md:flex-row items-center gap-10 ${
              i % 2 === 1 ? 'md:flex-row-reverse' : ''
            }`}
          >
            <Image
              src={p.image}
              alt={p.name}
              width={540}
              height={560}
              className="rounded-lg object-cover"
            />
            <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
              {p.new && (
                <p className="uppercase text-md text-[#d87d4a] tracking-[0.3em] mb-4">
                  New Product
                </p>
              )}
              <h2 className="text-3xl font-bold uppercase mb-6">{p.name}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {p.description}
              </p>
              <a href={p.href} className="p-3 rounded-lg btn">
                See Product
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* === CATEGORY CARDS === */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 px-6 md:px-10 lg:px-16 py-20 bg-white">
        {categories.map((item) => (
          <div
            key={item.title}
            className="bg-[#f1f1f1] rounded-xl flex flex-col items-center justify-end h-48 md:h-56 pb-6 relative"
          >
            {/* Floating image */}
            <div className="absolute -top-14">
              <Image
                src={item.img}
                alt={item.title}
                width={160}
                height={160}
                className="object-contain"
              />
            </div>

            {/* Text content */}
            <h3 className="text-base font-bold uppercase tracking-wider mb-3">
              {item.title}
            </h3>
            <Link
              href={item.href}
              className="text-gray-600 flex items-center justify-center font-semibold uppercase tracking-widest hover:text-[#d87d4a]"
            >
              Shop <span className="ml-1 text-xl text-orange-600">→</span>
            </Link>
          </div>
        ))}
      </section>

      {/* === AUDIO GEAR === */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center text-center lg:text-left gap-12 lg:gap-20">
          <div className="lg:w-1/2">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 uppercase">
              Bringing you the <br />
              <span className="text-[#d87d4a]">best</span> audio gear
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Located at the heart of New York City, Audiophile is the premier
              store for high-end headphones, earphones, speakers, and audio
              accessories. We have a large showroom and luxury demonstration
              rooms available for you to browse and experience a wide range of
              our products. Stop by our store to meet some of the fantastic
              people who make Audiophile the best place to buy your portable
              audio equipment.
            </p>
          </div>
          <div className="lg:w-1/2 w-full">
            <Image
              src="/images/shared/desktop/image-best-gear.jpg"
              alt="Audio Gear"
              width={540}
              height={588}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
