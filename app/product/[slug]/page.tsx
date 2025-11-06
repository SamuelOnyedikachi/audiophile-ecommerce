// 'use client';

// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';
// import { useCart } from '@/app/components/CartProvider';
// import { products } from '@/app/data/products';

// export default function ProductDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { add } = useCart();
//   const [qty, setQty] = useState(1);

//   // Find product by slug
//   const product = products.find((p) => p.slug === params.slug);

//   if (!product) {
//     return (
//       <div className="max-w-7xl mx-auto px-6 py-20 text-center">
//         <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
//         <p className="text-gray-600 mb-8">
//           Sorry, we couldn't find the product you're looking for.
//         </p>
//         <Link href="/" className="btn">
//           Go Home
//         </Link>
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     add({
//       id: product.slug,
//       name: product.name,
//       price: product.price,
//       qty,
//       image: product.image,
//     });
//     alert('Added to cart!');
//   };

//   // Get related products (same category, excluding current)
//   const relatedProducts = products
//     .filter((p) => p.category === product.category && p.id !== product.id)
//     .slice(0, 3);

//   const categories = [
//     {
//       title: 'Headphones',
//       img: '/images/shared/desktop/image-category-thumbnail-headphones.png',
//       href: '/headphones',
//     },
//     {
//       title: 'Speakers',
//       img: '/images/shared/desktop/image-category-thumbnail-speakers.png',
//       href: '/speakers',
//     },
//     {
//       title: 'Earphones',
//       img: '/images/shared/desktop/image-category-thumbnail-earphones.png',
//       href: '/earphones',
//     },
//   ];

//   return (
//     <main className="w-full">
//       {/* Back Button */}
//       <div className="max-w-7xl mx-auto px-6 pt-16">
//         <button
//           onClick={() => router.back()}
//           className="text-gray-600 hover:text-[#d87d4a] transition"
//         >
//           ← Go Back
//         </button>
//       </div>

//       {/* Product Detail Section */}
//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
//           {/* Product Image */}
//           <div className="relative w-full lg:w-1/2 h-[400px] md:h-[560px] rounded-lg overflow-hidden bg-[#f1f1f1]">
//             <Image
//               src={product.image}
//               alt={product.name}
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           {/* Product Info */}
//           <div className="flex flex-col lg:w-1/2 max-w-lg">
//             <p className="uppercase text-[#d87d4a] tracking-[0.3em] text-sm mb-4">
//               New Product
//             </p>
//             <h1 className="text-3xl md:text-4xl font-bold uppercase mb-6 leading-tight">
//               {product.name}
//             </h1>
//             <p className="text-gray-600 mb-8 leading-relaxed">
//               {product.description}
//             </p>
//             <p className="text-2xl font-bold mb-8">${product.price}</p>

//             {/* Quantity & Add to Cart */}
//             <div className="flex items-center gap-4 mb-8">
//               <div className="flex items-center bg-[#f1f1f1] rounded">
//                 <button
//                   onClick={() => setQty(Math.max(1, qty - 1))}
//                   className="px-4 py-3 hover:text-[#d87d4a]"
//                 >
//                   −
//                 </button>
//                 <span className="px-6 py-3 font-bold">{qty}</span>
//                 <button
//                   onClick={() => setQty(qty + 1)}
//                   className="px-4 py-3 hover:text-[#d87d4a]"
//                 >
//                   +
//                 </button>
//               </div>
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-[#d87d4a] px-8 py-3 text-white font-semibold uppercase tracking-widest rounded hover:bg-[#fbaf85] transition"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features & In the Box */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <div className="flex flex-col lg:flex-row gap-16">
//           {/* Features */}
//           <div className="lg:w-2/3">
//             <h2 className="text-2xl font-bold uppercase mb-6">Features</h2>
//             <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//               {product.features}
//             </p>
//           </div>

//           {/* In the Box */}
//           <div className="lg:w-1/3">
//             <h2 className="text-2xl font-bold uppercase mb-6">In the Box</h2>
//             <ul className="space-y-2">
//               {product.includes.map((item, i) => (
//                 <li key={i} className="flex gap-4">
//                   <span className="text-[#d87d4a] font-bold">
//                     {item.quantity}x
//                   </span>
//                   <span className="text-gray-600">{item.item}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* Gallery */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           <div className="relative h-[200px] md:h-[280px] rounded-lg overflow-hidden">
//             <Image
//               src={product.gallery.first}
//               alt="Gallery 1"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="relative h-[200px] md:h-[280px] rounded-lg overflow-hidden">
//             <Image
//               src={product.gallery.second}
//               alt="Gallery 2"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="relative h-[200px] md:h-[280px] col-span-2 md:col-span-1 md:row-span-2 rounded-lg overflow-hidden">
//             <Image
//               src={product.gallery.third}
//               alt="Gallery 3"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>
//       </section>

//       {/* You May Also Like */}
//       {relatedProducts.length > 0 && (
//         <section className="max-w-7xl mx-auto px-6 py-16">
//           <h2 className="text-2xl font-bold uppercase text-center mb-12">
//             You May Also Like
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {relatedProducts.map((p) => (
//               <div key={p.id} className="text-center">
//                 <div className="relative h-[250px] rounded-lg overflow-hidden bg-[#f1f1f1] mb-6">
//                   <Image
//                     src={p.image}
//                     alt={p.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold uppercase mb-4">{p.name}</h3>
//                 <Link
//                   href={`/product/${p.slug}`}
//                   className="bg-[#d87d4a] px-6 py-3 text-white font-semibold uppercase tracking-widest rounded hover:bg-[#fbaf85] transition inline-block"
//                 >
//                   See Product
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Category Cards */}
//       <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 px-6 md:px-10 lg:px-16 py-20 bg-white">
//         {categories.map((item) => (
//           <div
//             key={item.title}
//             className="bg-[#f1f1f1] rounded-xl flex flex-col items-center justify-end h-48 md:h-56 pb-6 relative"
//           >
//             <div className="absolute -top-14">
//               <Image
//                 src={item.img}
//                 alt={item.title}
//                 width={160}
//                 height={160}
//                 className="object-contain"
//               />
//             </div>
//             <h3 className="text-base font-bold uppercase tracking-wider mb-3">
//               {item.title}
//             </h3>
//             <Link
//               href={item.href}
//               className="text-gray-600 flex items-center justify-center font-semibold uppercase tracking-widest hover:text-[#d87d4a]"
//             >
//               Shop <span className="ml-1 text-xl text-orange-600">→</span>
//             </Link>
//           </div>
//         ))}
//       </section>

//       {/* Audio Gear Section */}
//       <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
//         <div className="flex flex-col-reverse lg:flex-row items-center text-center lg:text-left gap-12 lg:gap-20">
//           <div className="lg:w-1/2">
//             <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">
//               Bringing you the <br />
//               <span className="text-[#d87d4a]">best</span> audio gear
//             </h2>
//             <p className="text-gray-600 leading-relaxed text-lg">
//               Located at the heart of New York City, Audiophile is the premier
//               store for high-end headphones, earphones, speakers, and audio
//               accessories. We have a large showroom and luxury demonstration
//               rooms available for you to browse and experience a wide range of
//               our products. Stop by our store to meet some of the fantastic
//               people who make Audiophile the best place to buy your portable
//               audio equipment.
//             </p>
//           </div>
//           <div className="lg:w-1/2 w-full">
//             <Image
//               src="/images/shared/desktop/image-best-gear.jpg"
//               alt="Audio Gear"
//               width={540}
//               height={588}
//               className="rounded-lg object-cover"
//             />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

// 'use client';

// import { useParams, useRouter } from 'next/navigation';
// import Image from 'next/image';
// import Link from 'next/link';
// import { useState } from 'react';
// import { useCart } from '@/app/components/CartProvider';
// import { products } from '@/app/data/products';
// import ProductReviews from '@/app/components/ProductReviews'; // ✅ Added

// export default function ProductDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { add } = useCart();
//   const [qty, setQty] = useState(1);

//   // Find product by slug
//   const product = products.find((p) => p.slug === params.slug);

//   if (!product) {
//     return (
//       <div className="max-w-7xl mx-auto px-6 py-20 text-center">
//         <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
//         <p className="text-gray-600 mb-8">
//           Sorry, we couldn't find the product you're looking for.
//         </p>
//         <Link href="/" className="btn">
//           Go Home
//         </Link>
//       </div>
//     );
//   }

//   const handleAddToCart = () => {
//     add({
//       id: product.slug,
//       name: product.name,
//       price: product.price,
//       qty,
//       image: product.image,
//     });
//     alert('Added to cart!');
//   };

//   // Get related products (same category, excluding current)
//   const relatedProducts = products
//     .filter((p) => p.category === product.category && p.id !== product.id)
//     .slice(0, 3);

//   const categories = [
//     {
//       title: 'Headphones',
//       img: '/images/shared/desktop/image-category-thumbnail-headphones.png',
//       href: '/headphones',
//     },
//     {
//       title: 'Speakers',
//       img: '/images/shared/desktop/image-category-thumbnail-speakers.png',
//       href: '/speakers',
//     },
//     {
//       title: 'Earphones',
//       img: '/images/shared/desktop/image-category-thumbnail-earphones.png',
//       href: '/earphones',
//     },
//   ];

//   return (
//     <main className="w-full">
//       {/* Back Button */}
//       <div className="max-w-7xl mx-auto px-6 pt-16">
//         <button
//           onClick={() => router.back()}
//           className="text-gray-600 hover:text-[#d87d4a] transition"
//         >
//           ← Go Back
//         </button>
//       </div>

//       {/* Product Detail Section */}
//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
//           {/* Product Image */}
//           <div className="relative w-full lg:w-1/2 h-[400px] md:h-[560px] rounded-lg overflow-hidden bg-[#f1f1f1]">
//             <Image
//               src={product.image}
//               alt={product.name}
//               fill
//               className="object-cover"
//               priority
//             />
//           </div>

//           {/* Product Info */}
//           <div className="flex flex-col lg:w-1/2 max-w-lg">
//             <p className="uppercase text-[#d87d4a] tracking-[0.3em] text-sm mb-4">
//               New Product
//             </p>
//             <h1 className="text-3xl md:text-4xl font-bold uppercase mb-6 leading-tight">
//               {product.name}
//             </h1>
//             <p className="text-gray-600 mb-8 leading-relaxed">
//               {product.description}
//             </p>
//             <p className="text-2xl font-bold mb-8">${product.price}</p>

//             {/* Quantity & Add to Cart */}
//             <div className="flex items-center gap-4 mb-8">
//               <div className="flex items-center bg-[#f1f1f1] rounded">
//                 <button
//                   onClick={() => setQty(Math.max(1, qty - 1))}
//                   className="px-4 py-3 hover:text-[#d87d4a]"
//                 >
//                   −
//                 </button>
//                 <span className="px-6 py-3 font-bold">{qty}</span>
//                 <button
//                   onClick={() => setQty(qty + 1)}
//                   className="px-4 py-3 hover:text-[#d87d4a]"
//                 >
//                   +
//                 </button>
//               </div>
//               <button
//                 onClick={handleAddToCart}
//                 className="bg-[#d87d4a] px-8 py-3 text-white font-semibold uppercase tracking-widest rounded hover:bg-[#fbaf85] transition"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Features & In the Box */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <div className="flex flex-col lg:flex-row gap-16">
//           {/* Features */}
//           <div className="lg:w-2/3">
//             <h2 className="text-2xl font-bold uppercase mb-6">Features</h2>
//             <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//               {product.features}
//             </p>
//           </div>

//           {/* In the Box */}
//           <div className="lg:w-1/3">
//             <h2 className="text-2xl font-bold uppercase mb-6">In the Box</h2>
//             <ul className="space-y-2">
//               {product.includes.map((item, i) => (
//                 <li key={i} className="flex gap-4">
//                   <span className="text-[#d87d4a] font-bold">
//                     {item.quantity}x
//                   </span>
//                   <span className="text-gray-600">{item.item}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       </section>

//       {/* ✅ Product Reviews Section */}
//       <section className="max-w-7xl mx-auto px-6 py-16 border-t border-gray-200">
//         <h2 className="text-2xl font-bold uppercase mb-8">Customer Reviews</h2>
//         <ProductReviews productId={product.slug} />
//       </section>

//       {/* Gallery */}
//       <section className="max-w-7xl mx-auto px-6 py-16">
//         <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//           <div className="relative h-[200px] md:h-[280px] rounded-lg overflow-hidden">
//             <Image
//               src={product.gallery.first}
//               alt="Gallery 1"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="relative h-[200px] md:h-[280px] rounded-lg overflow-hidden">
//             <Image
//               src={product.gallery.second}
//               alt="Gallery 2"
//               fill
//               className="object-cover"
//             />
//           </div>
//           <div className="relative h-[200px] md:h-[280px] col-span-2 md:col-span-1 md:row-span-2 rounded-lg overflow-hidden">
//             <Image
//               src={product.gallery.third}
//               alt="Gallery 3"
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>
//       </section>

//       {/* You May Also Like */}
//       {relatedProducts.length > 0 && (
//         <section className="max-w-7xl mx-auto px-6 py-16">
//           <h2 className="text-2xl font-bold uppercase text-center mb-12">
//             You May Also Like
//           </h2>
//           <div className="grid md:grid-cols-3 gap-8">
//             {relatedProducts.map((p) => (
//               <div key={p.id} className="text-center">
//                 <div className="relative h-[250px] rounded-lg overflow-hidden bg-[#f1f1f1] mb-6">
//                   <Image
//                     src={p.image}
//                     alt={p.name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <h3 className="text-xl font-bold uppercase mb-4">{p.name}</h3>
//                 <Link
//                   href={`/product/${p.slug}`}
//                   className="bg-[#d87d4a] px-6 py-3 text-white font-semibold uppercase tracking-widest rounded hover:bg-[#fbaf85] transition inline-block"
//                 >
//                   See Product
//                 </Link>
//               </div>
//             ))}
//           </div>
//         </section>
//       )}

//       {/* Category Cards */}
//       <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 px-6 md:px-10 lg:px-16 py-20 bg-white">
//         {categories.map((item) => (
//           <div
//             key={item.title}
//             className="bg-[#f1f1f1] rounded-xl flex flex-col items-center justify-end h-48 md:h-56 pb-6 relative"
//           >
//             <div className="absolute -top-14">
//               <Image
//                 src={item.img}
//                 alt={item.title}
//                 width={160}
//                 height={160}
//                 className="object-contain"
//               />
//             </div>
//             <h3 className="text-base font-bold uppercase tracking-wider mb-3">
//               {item.title}
//             </h3>
//             <Link
//               href={item.href}
//               className="text-gray-600 flex items-center justify-center font-semibold uppercase tracking-widest hover:text-[#d87d4a]"
//             >
//               Shop <span className="ml-1 text-xl text-orange-600">→</span>
//             </Link>
//           </div>
//         ))}
//       </section>

//       {/* Audio Gear Section */}
//       <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
//         <div className="flex flex-col-reverse lg:flex-row items-center text-center lg:text-left gap-12 lg:gap-20">
//           <div className="lg:w-1/2">
//             <h2 className="text-3xl md:text-4xl font-bold mb-8 uppercase">
//               Bringing you the <br />
//               <span className="text-[#d87d4a]">best</span> audio gear
//             </h2>
//             <p className="text-gray-600 leading-relaxed text-lg">
//               Located at the heart of New York City, Audiophile is the premier
//               store for high-end headphones, earphones, speakers, and audio
//               accessories. We have a large showroom and luxury demonstration
//               rooms available for you to browse and experience a wide range of
//               our products. Stop by our store to meet some of the fantastic
//               people who make Audiophile the best place to buy your portable
//               audio equipment.
//             </p>
//           </div>
//           <div className="lg:w-1/2 w-full">
//             <Image
//               src="/images/shared/desktop/image-best-gear.jpg"
//               alt="Audio Gear"
//               width={540}
//               height={588}
//               className="rounded-lg object-cover"
//             />
//           </div>
//         </div>
//       </section>
//     </main>
//   );
// }

'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/app/components/CartProvider';
import { products } from '@/app/data/products';
import ProductReviews from '@/app/components/ProductReviews';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Link href="/" className="btn">
          Go Home
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    add({
      id: product.slug,
      name: product.name,
      price: product.price,
      qty,
      image: product.image,
    });
    alert('Added to cart!');
  };

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

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
      <div className="max-w-7xl mx-auto px-6 pt-16">
        <button
          onClick={() => router.back()}
          className="text-gray-600 hover:text-[#d87d4a] transition"
        >
          ← Go Back
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="relative w-full lg:w-1/2 h-[400px] md:h-[560px] rounded-lg overflow-hidden bg-[#f1f1f1]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col lg:w-1/2 max-w-lg">
            <p className="uppercase text-[#d87d4a] tracking-[0.3em] text-sm mb-4">
              New Product
            </p>
            <h1 className="text-3xl md:text-4xl font-bold uppercase mb-6 leading-tight">
              {product.name}
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>
            <p className="text-2xl font-bold mb-8">${product.price}</p>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center bg-[#f1f1f1] rounded">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="px-4 py-3 hover:text-[#d87d4a]"
                >
                  −
                </button>
                <span className="px-6 py-3 font-bold">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="px-4 py-3 hover:text-[#d87d4a]"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-[#d87d4a] px-8 py-3 text-white font-semibold uppercase tracking-widest rounded hover:bg-[#fbaf85] transition"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          <div className="lg:w-2/3">
            <h2 className="text-2xl font-bold uppercase mb-6">Features</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
              {product.features}
            </p>
          </div>

          <div className="lg:w-1/3">
            <h2 className="text-2xl font-bold uppercase mb-6">In the Box</h2>
            <ul className="space-y-2">
              {product.includes.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="text-[#d87d4a] font-bold">
                    {item.quantity}x
                  </span>
                  <span className="text-gray-600">{item.item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="relative h-[200px] md:h-[280px] rounded-lg overflow-hidden">
            <Image
              src={product.gallery.first}
              alt="Gallery 1"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[200px] md:h-[280px] rounded-lg overflow-hidden">
            <Image
              src={product.gallery.second}
              alt="Gallery 2"
              fill
              className="object-cover"
            />
          </div>
          <div className="relative h-[200px] md:h-[280px] col-span-2 md:col-span-1 md:row-span-2 rounded-lg overflow-hidden">
            <Image
              src={product.gallery.third}
              alt="Gallery 3"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Product Reviews Section */}
      <div className="max-w-7xl mx-auto px-6">
        <ProductReviews productId={product.slug} />
      </div>

      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold uppercase text-center mb-12">
            You May Also Like
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {relatedProducts.map((p) => (
              <div key={p.id} className="text-center">
                <div className="relative h-[250px] rounded-lg overflow-hidden bg-[#f1f1f1] mb-6">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold uppercase mb-4">{p.name}</h3>
                <Link
                  href={`/product/${p.slug}`}
                  className="bg-[#d87d4a] px-6 py-3 text-white font-semibold uppercase tracking-widest rounded hover:bg-[#fbaf85] transition inline-block"
                >
                  See Product
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 px-6 md:px-10 lg:px-16 py-20 bg-white">
        {categories.map((item) => (
          <div
            key={item.title}
            className="bg-[#f1f1f1] rounded-xl flex flex-col items-center justify-end h-48 md:h-56 pb-6 relative"
          >
            <div className="absolute -top-14">
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
              className="text-gray-600 flex items-center justify-center font-semibold uppercase tracking-widest hover:text-[#d87d4a]"
            >
              Shop <span className="ml-1 text-xl text-orange-600">→</span>
            </Link>
          </div>
        ))}
      </section>

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
    </main>
  );
}