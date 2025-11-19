import Image from 'next/image';
import Link from 'next/link';

export default function ProductCard({
  title,
  description,
  image,
  href,
  variant = 'light',
}: {
  title: string;
  description: string;
  image: string;
  href: string;
  variant?: 'light' | 'dark';
}) {
  const dark = variant === 'dark';
  return (
    <article
      className={`rounded-lg p-6 flex flex-col items-center text-center ${dark ? 'bg-black text-white' : 'bg-white text-black'} shadow-sm`}
    >
      <div className="w-full max-w-[300px] h-[200px]">
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className="object-contain mx-auto"
        />
      </div>
      <h3 className="text-xl font-bold mt-6 uppercase">{title}</h3>
      <p className="text-sm text-gray-500 mt-3 max-w-[28rem]">{description}</p>
      <Link
        href={href}
        className={`mt-6 px-6 py-3  tracking-wider text-sm rounded-lg font-semibold ${dark ? 'bg-orange-500 text-white' : 'border border-black hover:bg-black hover:text-white'}`}
      >
        See Product
      </Link>
    </article>
  );
}
