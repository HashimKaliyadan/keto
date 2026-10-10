import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'Keto — A little closer to home', template: '%s | Keto' },
  description: 'Explore student hostels, discover your space, and arrange a visit with Keto.',
  icons: {
    icon: '/emblem.webp',
    shortcut: '/emblem.webp',
    apple: '/emblem.webp',
  },
  alternates: { canonical: '/' },
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/font-0.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/font-5.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
