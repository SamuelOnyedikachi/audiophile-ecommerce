'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function HeadphonesPage() {
  const products = [
    {
      name: 'XX99 Mark II Headphones',
      description:
        'The new XX99 Mark II headphones are the pinnacle of pristine audio. They redefine your premium headphone experience with high-fidelity sound and premium materials.',
      image: {
        mobile:
          '/images/product-xx99-mark-two-headphones/mobile/image-product.jpg',
        tablet:
          '/images/product-xx99-mark-two-headphones/tablet/image-product.jpg',
        desktop:
          '/images/product-xx99-mark-two-headphones/desktop/image-product.jpg',
      },
      new: true,
      href: '/product/xx99-mark-two-headphones',
    },
    {
      name: 'XX99 Mark I Headphones',
      description:
        'As the gold standard for headphones, the classic XX99 Mark I offers detailed and accurate audio reproduction for music lovers of all kinds.',
      image: {
        mobile:
          '/images/product-xx99-mark-one-headphones/mobile/image-product.jpg',
        tablet:
          '/images/product-xx99-mark-one-headphones/tablet/image-product.jpg',
        desktop:
          '/images/product-xx99-mark-one-headphones/desktop/image-product.jpg',
      },
      new: false,
      href: '/product/xx99-mark-one-headphones',
    },
    {
      name: 'XX59 Headphones',
      description:
        'Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable design makes it perfect for travel.',
      image: {
        mobile: '/images/product-xx59-headphones/mobile/image-product.jpg',
        tablet: '/images/product-xx59-headphones/tablet/image-product.jpg',
        desktop: '/images/product-xx59-headphones/desktop/image-product.jpg',
      },
      new: false,
      href: '/product/xx59-headphones',
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
      {/* === PAGE HEADER === */}
      <section className="bg-black text-white text-center py-20 md:py-28 lg:py-32 uppercase tracking-[0.2em] text-2xl md:text-3xl font-bold">
        Headphones
      </section>

      {/* === PRODUCT LISTINGS === */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 space-y-24 md:space-y-32">
        {products.map((p, i) => (
          <div
            key={p.name}
            className={`flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-16 ${
              i % 2 === 1 ? 'lg:flex-row-reverse' : ''
            }`}
          >
            {/* Product Image */}
            <div className="relative w-full lg:w-1/2 rounded-lg overflow-hidden bg-[#f1f1f1]">
              <picture>
                <source media="(min-width:1024px)" srcSet={p.image.desktop} />
                <source media="(min-width:640px)" srcSet={p.image.tablet} />
                <img
                  src={p.image.mobile}
                  alt={p.name}
                  className="w-full h-auto object-cover"
                />
              </picture>
            </div>

            {/* Product Info */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2 max-w-lg">
              {p.new && (
                <p className="uppercase text-[#d87d4a] text-sm md:text-base tracking-[0.3em] mb-4">
                  New Product
                </p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6 leading-tight">
                {p.name}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed text-sm md:text-base">
                {p.description}
              </p>
              <Link
                href={p.href}
                className="bg-[#d87d4a] px-6 py-3 text-sm md:text-base text-white font-semibold uppercase tracking-widest rounded-lg hover:bg-[#fbaf85] transition"
              >
                See Product
              </Link>
            </div>
          </div>
        ))}
      </section>

      {/* === CATEGORY CARDS === */}
      <section className="max-w-7xl mx-auto grid gap-12 px-6 md:px-10 lg:px-16 py-20 bg-white sm:grid-cols-2 md:grid-cols-3">
        {categories.map((item) => (
          <div
            key={item.title}
            className="bg-[#f1f1f1] rounded-xl flex flex-col items-center justify-end h-48 sm:h-56 md:h-64 pb-6 relative"
          >
            <div className="absolute -top-14 sm:-top-16">
              <Image
                src={item.img}
                alt={item.title}
                width={160}
                height={160}
                className="object-contain"
              />
            </div>
            <h3 className="text-base font-bold uppercase tracking-wider mb-3">
              {item.title}
            </h3>
            <Link
              href={item.href}
              className="text-gray-600 flex items-center justify-center font-semibold uppercase tracking-widest hover:text-[#d87d4a] transition"
            >
              Shop <span className="ml-1 text-lg text-orange-600">→</span>
            </Link>
          </div>
        ))}
      </section>

      {/* === AUDIO GEAR SECTION === */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="flex flex-col-reverse lg:flex-row items-center text-center lg:text-left gap-12 lg:gap-20">
          <div className="lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase leading-snug">
              Bringing you the <br />
              <span className="text-[#d87d4a]">best</span> audio gear
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base lg:text-lg">
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
              className="rounded-lg object-cover w-full"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
