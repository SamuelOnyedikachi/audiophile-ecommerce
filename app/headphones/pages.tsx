import Image from 'next/image';

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

  return (
    <main className="w-full">
      <section className="bg-black text-white text-center py-24 uppercase tracking-widest text-3xl font-bold">
        Headphones
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
