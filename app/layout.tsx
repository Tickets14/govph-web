import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: {
    default: 'Gov Requirements Tracker — Alamin ang requirements. Walang hassle.',
    template: '%s | Gov Requirements Tracker',
  },
  description:
    'A step-by-step guide to Philippine government services. Find requirements, track your progress, and complete any government transaction with confidence.',
  keywords: ['Philippine government', 'government services', 'requirements', 'NBI', 'passport', 'DFA', 'LTO'],
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    title: 'Gov Requirements Tracker',
    description: 'Alamin ang requirements. Walang hassle.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fil" className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col antialiased bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
