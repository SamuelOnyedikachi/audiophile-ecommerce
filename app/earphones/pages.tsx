import Image from 'next/image';

export default function EarphonesPage() {
  const product = {
    name: 'YX1 Wireless Earphones',
    description:
      'Tailor your listening experience with bespoke dynamic drivers delivering truly exceptional sound. Enjoy incredible clarity and a secure fit for all-day comfort.',
    image: '/images/product-yx1-earphones/desktop/image-product.jpg',
    new: true,
    href: '/product/yx1',
  };

  return (
    <main className="w-full">
      <section className="bg-black text-white text-center py-24 uppercase tracking-widest text-3xl font-bold">
        Earphones
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <Image
            src={product.image}
            alt={product.name}
            width={540}
            height={560}
            className="rounded-lg object-cover"
          />
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-md">
            {product.new && (
              <p className="uppercase text-[#d87d4a] tracking-[0.3em] mb-4">
                New Product
              </p>
            )}
            <h2 className="text-3xl font-bold uppercase mb-6">
              {product.name}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>
            <a href={product.href} className="btn">
              See Product
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
