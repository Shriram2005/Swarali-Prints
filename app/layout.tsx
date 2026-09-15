import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Swarali Prints — Custom Printing Services in Cidco, Nashik',
  description:
    'Custom Printing Services & E-Commerce in Cidco, Nashik. Flex banners, visiting cards, digital prints, document printing, proof approval, and live order tracking.',
  openGraph: {
    title: 'Swarali Prints — Custom Printing Services in Cidco, Nashik',
    description:
      'Custom Printing Services & E-Commerce in Cidco, Nashik. Flex banners, visiting cards, digital prints, document printing, proof approval, and live order tracking.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Swarali Prints — Custom Printing Services in Cidco, Nashik',
    description:
      'Custom Printing Services & E-Commerce in Cidco, Nashik. Flex banners, visiting cards, digital prints, document printing, proof approval, and live order tracking.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
