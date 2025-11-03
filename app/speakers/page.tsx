import Image from 'next/image';

export default function SpeakersPage() {
  const products = [
    {
      name: 'ZX9 Speaker',
      description:
        'Upgrade your sound system with the all new ZX9 active speaker. It’s a bookshelf speaker system that offers truly wireless connectivity and exceptional sound quality.',
      image: '/images/product-zx9-speaker/desktop/image-product.jpg',
      new: true,
      href: '/product/zx9',
    },
    {
      name: 'ZX7 Speaker',
      description:
        'Stream high-quality sound wirelessly with minimal loss. The ZX7 bookshelf speaker uses high-end audio components that represent the top of its class.',
      image: '/images/product-zx7-speaker/desktop/image-product.jpg',
      new: false,
      href: '/product/zx7',
    },
  ];

  return (
    <main className="w-full">
      <section className="bg-black text-white text-center py-24 uppercase tracking-widest text-3xl font-bold">
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
                <p className="uppercase text-[#d87d4a] tracking-[0.3em] mb-4">
                  New Product
                </p>
              )}
              <h2 className="text-3xl font-bold uppercase mb-6">{p.name}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {p.description}
              </p>
              <a href={p.href} className="btn">
                See Product
              </a>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
