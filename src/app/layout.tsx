import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'HOSTEL — A little closer to home', template: '%s | HOSTEL' },
  description: 'Explore verified student hostels, discover your space, and arrange a visit with HOSTEL.',
  icons: {
    icon: '/hostel-icon.svg',
    shortcut: '/hostel-icon.svg',
    apple: '/hostel-icon.svg',
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
