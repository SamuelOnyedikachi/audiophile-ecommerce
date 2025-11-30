// app/layout.tsx
import '../styles/globals.css';
import { Manrope } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';
import ClientProviders from './components/ClientProviders';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audiophile Naija',
  description:
    'The ultimate destination for high-fidelity audio. Discover our exclusive collection of premium headphones, speakers, and earphones. Sound Perfected.',
  // icons: {
  //   icon: '/audio.png',
  //   shortcut: '/audio.png',
  //   apple: '/audio.png',
  // },
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
        {/* All client-only logic (CartProvider, ConvexProvider, etc.) moved here */}
        <ClientProviders>
          <Header />
          <main className="flex-1 w-full max-w-[100%] mx-auto">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
