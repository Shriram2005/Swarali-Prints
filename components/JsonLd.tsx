import React from 'react';

interface JsonLdProps {
  data: Record<string, any>;
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
};

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://swaraliprints.com/#store',
    name: 'Swarali Prints',
    alternateName: 'स्वराली प्रिंट्स',
    description:
      'Professional custom printing services in Cidco, Nashik. Flex banner printing, visiting cards, digital xerox, thesis binding, vinyl stickers, and wedding invitation cards.',
    url: 'https://swaraliprints.com',
    telephone: '+919823123456',
    priceRange: '₹ - ₹₹',
    image: 'https://swaraliprints.com/swarali-logo.svg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Shop No. 1, Opposite New Sadguru Hotel, Trimurti Chowk, Shivshakti Nagar',
      addressLocality: 'Cidco, Nashik',
      addressRegion: 'Maharashtra',
      postalCode: '422008',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '19.986776',
      longitude: '73.754877',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:30',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '14:00',
      },
    ],
    sameAs: [
      'https://maps.app.goo.gl/iRdzZ4XFGz7SHzf79',
      'https://www.indiamart.com/swarali-prints',
    ],
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Cidco, Nashik' },
      { '@type': 'AdministrativeArea', name: 'Trimurti Chowk' },
      { '@type': 'AdministrativeArea', name: 'Shivshakti Nagar' },
      { '@type': 'AdministrativeArea', name: 'Pawan Nagar' },
      { '@type': 'AdministrativeArea', name: 'Govind Nagar' },
      { '@type': 'AdministrativeArea', name: 'Lekha Nagar' },
      { '@type': 'AdministrativeArea', name: 'Nashik' },
    ],
  };
}
