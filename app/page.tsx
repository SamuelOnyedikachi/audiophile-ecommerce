import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full">
      {/* === HERO SECTION === */}
      <section className="bg-[#121212] text-white ">
        <div className="max-w-7xl mx-auto gap-9 flex flex-col md:flex-row items-center justify-between px-8 md:px-6 relative overflow-hidden">
          <div className="max-w-lg space-y-6 z-10">
            <p className="uppercase text-2xl text-gray-400 tracking-[0.3em]">
              New Product
            </p>
            <h1 className="text-4xl md:text-6xl font-bold uppercase leading-tight">
              XX99 Mark II <br /> Headphones
            </h1>
            <p className="text-gray-300 leading-relaxed">
              Experience natural, lifelike audio and exceptional build quality
              made for the passionate music enthusiast.
            </p>
            <Link
              href="/product/xx99-mark-two"
              className="btn p-4 mt-5 inline-block"
            >
              See Product
            </Link>
          </div>
          <div className="relative md:mt-0">
            <Image
              src="/images/home/desktop/image-hero.svg"
              alt="XX99 Headphones"
              width={600}
              height={600}
              className="rounded-lg"
              priority
            />
          </div>
        </div>
      </section>

      {/* === CATEGORY CARDS === */}
      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 px-8 md:px-16 py-20 pt-50 bg-[#ffffff]">
        {[
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
        ].map((item) => (
          <div
            key={item.title}
            className="bg-[#f1f1f1] rounded-xl flex flex-col items-center justify-center pt-28 pb-12 relative"
          >
            {/* Floating image */}
            <div className="absolute -top-20">
              <Image
                src={item.img}
                alt={item.title}
                width={160}
                height={160}
                className="object-contain"
              />
            </div>

            {/* Text content */}
            <h3 className="text-lg font-bold uppercase mt-6 mb-4">
              {item.title}
            </h3>
            <Link
              href={item.href}
              className="text-gray-600 flex items-center justify-center font-semibold uppercase tracking-widest hover:text-[#d87d4a]"
            >
              Shop <span className="ml-1 text-xl  text-orange-600 ">→</span>
            </Link>
          </div>
        ))}
      </section>

      {/* === FEATURED PRODUCTS === */}
      <section className="max-w-7xl mx-auto px-8 md:px-16 py-20 space-y-16">
        {/* ZX9 SPEAKER */}
        <div className="bg-[#d87d4a] rounded-2xl flex flex-col md:flex-row items-center text-white px-10 md:px-16 overflow-hidden relative h-[530px]">
          {/* Image wrapper */}
          <div className="relative w-full md:w-auto flex-shrink-0 h-full flex items-end justify-center">
            <Image
              src="/images/home/desktop/image-speaker-zx9.png"
              alt="ZX9 Speaker"
              width={400}
              height={400}
              className="object-contain translate-y-10 md:translate-y-14 scale-110"
            />
          </div>

          {/* Text content */}
          <div className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 text-center md:text-left">
            <h2 className="text-6xl font-bold uppercase mb-10">
              ZX9 <br /> Speaker
            </h2>
            <p className="mb-14 text-lg text-white/80 leading-relaxed">
              Upgrade to premium speakers that are <br /> phenomenally built to
              deliver truly remarkable <br /> sound.
            </p>
            <Link
              href="/product/zx9-speaker"
              className="btn p-3 bg-black hover:bg-[#4c4c4c]"
            >
              See Product
            </Link>
          </div>
        </div>

        {/* ZX7 SPEAKER */}
        <div className="relative rounded-2xl overflow-hidden">
          <Image
            src="/images/home/desktop/image-speaker-zx7.jpg"
            alt="ZX7 Speaker"
            width={1200}
            height={400}
            className="w-full object-cover"
          />
          <div className="absolute pl-8 top-1/2 -translate-y-1/2 left-8 md:left-16">
            <h3 className="text-4xl font-bold mb-10">ZX7 Speaker</h3>
            <Link
              href="/product/zx7-speaker"
              className="border hover:text-blue-50 p-3 btn-outline"
            >
              See Product
            </Link>
          </div>
        </div>

        {/* YX1 EARPHONES */}
        <div className="grid md:grid-cols-2 gap-8">
          <Image
            src="/images/home/desktop/image-earphones-yx1.jpg"
            alt="YX1 Earphones"
            width={600}
            height={400}
            className="rounded-2xl object-cover"
          />
          <div className="bg-[#f1f1f1] rounded-2xl flex flex-col justify-center px-25 py-16">
            <h3 className="text-4xl font-bold mb-10">YX1 Earphones</h3>
            <Link
              href="/product/yx1-earphones"
              className="border p-3 hover:text-blue-50 btn-outline w-fit"
            >
              See Product
            </Link>
          </div>
        </div>
      </section>

      {/* Audio Gear */}
      <section>
        <div className="max-w-7xl mx-auto rounded-2xl flex flex-col md:flex-row items-center text-center md:text-left px-8 md:px-16 py-20 gap-10">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold mb-10">
              Bringing you the <br />{' '}
              <span className="text-orange-500">best</span> audio gear
            </h2>
            <p className="text-gray-600 text-xl leading-relaxed">
              Located at the heart of New York City, Audiophile is the premier
              store for high end headphones, earphones, speakers, and audio
              accessories. We have a large showroom and luxury demonstration
              rooms available for you to browse and experience a wide range of
              our products. Stop by our store to meet some of the fantastic
              people who make Audiophile the best place to buy your portable
              audio equipment.
            </p>
          </div>
          <div className="md:w-1/2 ml-30">
            <Image
              src="/images/home/desktop/image-audio-gear.png"
              alt="Audio Gear"
              width={500}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
