import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full overflow-x-hidden">
      {/* === HERO SECTION === */}
      <section className="bg-[#121212] text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 md:px-10 py-20 md:py-28">
          {/* === HERO IMAGE === */}
          <div className="relative w-full md:w-1/2 flex justify-center md:justify-end">
            <Image
              src="/images/home/desktop/image-hero.svg"
              alt="XX99 Headphones"
              width={600}
              height={600}
              priority
              className="object-contain w-[90%] sm:w-[80%] md:w-[600px] z-0"
            />

            {/* === OVERLAY TEXT (visible on mobile & tablet) === */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center md:hidden px-6 bg-gradient-to-t from-[#121212]/70 to-transparent">
              <p className="uppercase text-sm sm:text-base text-gray-400 tracking-[0.3em] mb-2">
                New Product
              </p>
              <h1 className="text-4xl sm:text-5xl font-bold uppercase leading-tight mb-4">
                XX99 Mark II <br /> Headphones
              </h1>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base max-w-md mx-auto mb-6">
                Experience natural, lifelike audio and exceptional build quality
                made for the passionate music enthusiast.
              </p>
              <Link
                href="/product/xx99-mark-two-headphones"
                className="inline-block mt-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                See Product
              </Link>
            </div>
          </div>

          {/* === SIDE TEXT (for desktop view only) === */}
          <div className="hidden md:block md:w-1/2 z-10">
            <div className="space-y-6">
              <p className="uppercase text-2xl text-gray-400 tracking-[0.3em]">
                New Product
              </p>
              <h1 className="text-6xl font-bold uppercase leading-tight">
                XX99 Mark II <br /> Headphones
              </h1>
              <p className="text-gray-300 leading-relaxed">
                Experience natural, lifelike audio and exceptional build quality
                made for the passionate music enthusiast.
              </p>
              <Link
                href="/product/xx99-mark-two-headphones"
                className="inline-block bg-orange-600 hover:bg-orange-500 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                See Product
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === CATEGORY CARDS === */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 px-6 md:px-10 py-20 bg-white">
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
            <div className="absolute -top-20">
              <Image
                src={item.img}
                alt={item.title}
                width={140}
                height={140}
                className="object-contain"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold uppercase mt-6 mb-3">
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

      {/* === FEATURED PRODUCTS === */}
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 space-y-16">
        {/* ZX9 SPEAKER */}
        <div className="bg-[#d87d4a] rounded-2xl flex flex-col md:flex-row items-center text-white px-8 md:px-16 overflow-hidden relative text-center md:text-left">
          <div className="flex justify-center md:justify-start w-full md:w-auto mb-10 md:mb-0">
            <Image
              src="/images/home/desktop/image-speaker-zx9.png"
              alt="ZX9 Speaker"
              width={300}
              height={300}
              className="object-contain"
            />
          </div>

          <div className="md:ml-10 space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold uppercase">
              ZX9 Speaker
            </h2>
            <p className="text-white/80 leading-relaxed">
              Upgrade to premium speakers that are phenomenally built to deliver
              truly remarkable sound.
            </p>
            <Link
              href="/product/zx9-speaker"
              className="inline-block bg-black hover:bg-[#4c4c4c] px-6 py-3 rounded-lg font-semibold"
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
          <div className="absolute inset-0 flex flex-col justify-center pl-8 md:pl-16">
            <h3 className="text-3xl md:text-4xl font-bold mb-8 text-black">
              ZX7 Speaker
            </h3>
            <Link
              href="/product/zx7-speaker"
              className="border border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-lg font-semibold transition w-fit"
            >
              See Product
            </Link>
          </div>
        </div>

        {/* YX1 EARPHONES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Image
            src="/images/home/desktop/image-earphones-yx1.jpg"
            alt="YX1 Earphones"
            width={600}
            height={400}
            className="rounded-2xl object-cover w-full"
          />
          <div className="bg-[#f1f1f1] rounded-2xl flex flex-col justify-center items-center md:items-start px-10 py-16 text-center md:text-left">
            <h3 className="text-3xl font-bold mb-8">YX1 Earphones</h3>
            <Link
              href="/product/yx1-earphones"
              className="border border-black text-black hover:bg-black hover:text-white px-6 py-3 rounded-lg font-semibold transition"
            >
              See Product
            </Link>
          </div>
        </div>
      </section>

      {/* === AUDIO GEAR SECTION === */}
      <section>
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center text-center md:text-left px-6 md:px-10 py-20 gap-10">
          <div className="md:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              Bringing you the <br />
              <span className="text-orange-500">best</span> audio gear
            </h2>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Located at the heart of New York City, Audiophile is the premier
              store for high end headphones, earphones, speakers, and audio
              accessories. We have a large showroom and luxury demonstration
              rooms available for you to browse and experience a wide range of
              our products. Stop by our store to meet some of the fantastic
              people who make Audiophile the best place to buy your portable
              audio equipment.
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <Image
              src="/images/home/desktop/image-audio-gear.png"
              alt="Audio Gear"
              width={500}
              height={400}
              className="rounded-lg object-cover w-[80%] sm:w-[60%] md:w-[500px]"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
