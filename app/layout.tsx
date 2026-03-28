import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ThemeProvider } from '@/hooks/useTheme';
import { PWARegister } from '@/components/PWARegister';

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
    default: 'Gov Requirements Tracker — Know the requirements. No hassle.',
    template: '%s | Gov Requirements Tracker',
  },
  description:
    'A step-by-step guide to Philippine government services. Find requirements, track your progress, and complete any government transaction with confidence.',
  keywords: ['Philippine government', 'government services', 'requirements', 'NBI', 'passport', 'DFA', 'LTO'],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GovPH',
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    title: 'Gov Requirements Tracker',
    description: 'Know the requirements. No hassle.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#111b30" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t==null&&matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-background text-foreground transition-colors duration-300">
        <ThemeProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-gold focus:text-navy focus:px-4 focus:py-2 focus:rounded-xl focus:font-semibold focus:text-sm"
          >
            Skip to main content
          </a>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <PWARegister />
        </ThemeProvider>
      </body>
    </html>
  );
}
