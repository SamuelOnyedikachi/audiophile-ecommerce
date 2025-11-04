import Image from 'next/image';
import Link from 'next/link';

export default function HeadphonesPage() {
  const products = [
    {
      name: 'XX99 Mark II Headphones',
      description:
        'The new XX99 Mark II headphones are the pinnacle of pristine audio. They redefine your premium headphone experience with high-fidelity sound and premium materials.',
      image:
        '/images/product-xx99-mark-two-headphones/desktop/image-product.jpg',
      new: true,
      href: '/product/xx99-mark-two',
    },
    {
      name: 'XX99 Mark I Headphones',
      description:
        'As the gold standard for headphones, the classic XX99 Mark I offers detailed and accurate audio reproduction for music lovers of all kinds.',
      image:
        '/images/product-xx99-mark-one-headphones/desktop/image-product.jpg',
      new: false,
      href: '/product/xx99-mark-one',
    },
    {
      name: 'XX59 Headphones',
      description:
        'Enjoy your audio almost anywhere and customize it to your specific tastes with the XX59 headphones. The stylish yet durable design makes it perfect for travel.',
      image: '/images/product-xx59-headphones/desktop/image-product.jpg',
      new: false,
      href: '/product/xx59',
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
      {/* === PAGE BANNER === */}
      <section className="bg-black text-white text-center py-16 md:py-24 uppercase tracking-[0.15em] md:tracking-[0.25em] text-2xl md:text-3xl font-bold">
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
            {/* Image */}
            <div className="relative w-full md:h-[560px] h-[352px] lg:w-1/2 rounded-lg overflow-hidden bg-[#f1f1f1]">
              <Image
                src={p.image}
                alt={p.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Text */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2">
              {p.new && (
                <p className="uppercase text-[#d87d4a] text-xl tracking-[0.4em] mb-5">
                  New Product
                </p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold uppercase mb-6 max-w-sm leading-snug">
                {p.name}
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {p.description}
              </p>
              <Link
                href={p.href}
                className="btn bg-[#d87d4a] p-3 text-white hover:bg-[#843307]"
              >
                See Product
              </Link>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">
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

c    </main>
  );
}
