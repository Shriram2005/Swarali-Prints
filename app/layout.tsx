import type {Metadata} from 'next';
import { Sora, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css'; // Global styles

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Swarali Prints — Custom Printing Services in Cidco, Nashik',
  description:
    'Custom Printing Services & E-Commerce in Cidco, Nashik. Flex banners, visiting cards, digital prints, document printing, proof approval, and live order tracking.',
  icons: {
    icon: '/logo.jpg',
    shortcut: '/logo.jpg',
    apple: '/logo.jpg',
  },
  openGraph: {
    title: 'Swarali Prints — Custom Printing Services in Cidco, Nashik',
    description:
      'Custom Printing Services & E-Commerce in Cidco, Nashik. Flex banners, visiting cards, digital prints, document printing, proof approval, and live order tracking.',
    type: 'website',
    images: [
      {
        url: '/logo.jpg',
        width: 360,
        height: 203,
        alt: 'Swarali Prints Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swarali Prints — Custom Printing Services in Cidco, Nashik',
    description:
      'Custom Printing Services & E-Commerce in Cidco, Nashik. Flex banners, visiting cards, digital prints, document printing, proof approval, and live order tracking.',
    images: ['/logo.jpg'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${sora.variable} ${plusJakarta.variable}`}>
      <body className={plusJakarta.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

