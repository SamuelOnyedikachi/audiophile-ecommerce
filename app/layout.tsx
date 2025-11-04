// import '../styles/globals.css';
// import { Manrope } from 'next/font/google';
// import Header from './components/Header';
// import Footer from './components/Footer';
// import { CartProvider } from './components/CartProvider';
// import type { Metadata } from 'next';

// export const metadata: Metadata = {
//   title: 'Audiophile E-Commerce',
//   description: 'High-end audio equipment built with Next.js + Convex',
// };

// const manrope = Manrope({
//   subsets: ['latin'],
//   variable: '--font-manrope',
//   display: 'swap',
// });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" className={`${manrope.variable} scroll-smooth`}>
//       <body className="antialiased bg-light text-black flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary">
//         <CartProvider>
//           <Header />
//           <main className="flex-1 w-full max-w-[100%] mx-auto">
//             {children}
//           </main>
//           <Footer />
//         </CartProvider>
//       </body>
//     </html>
//   );
// }
import '../styles/globals.css';
import { Manrope } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import ClientProviders from './components/ClientProviders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audiophile E-Commerce',
  description: 'High-end audio equipment built with Next.js + Convex',
};

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} scroll-smooth`}>
      <body className="antialiased bg-light text-black flex flex-col min-h-screen selection:bg-primary/20 selection:text-primary">
        {/* ✅ All client-only logic moved into ClientProviders */}
        <ClientProviders>
          <Header />
          <main className="flex-1 w-full max-w-[100%] mx-auto">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
