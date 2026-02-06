import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { StarField } from '@/components/ui/StarField';
import { Navigation } from '@/components/layout/Navigation';
import ErrorBoundary from '@/components/ErrorBoundary';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Thera',
  description: 'Navigate your horizons. A compass for exploration, not a checklist for completion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-black text-white min-h-screen`}
      >
        <StarField />
        <main className="relative z-10 min-h-screen pb-20">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
        <Navigation />
      </body>
    </html>
  );
}
