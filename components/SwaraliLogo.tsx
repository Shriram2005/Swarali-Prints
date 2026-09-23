'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SwaraliLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  withLink?: boolean;
  className?: string;
  isWhiteOnDark?: boolean;
}

export const SwaraliLogo: React.FC<SwaraliLogoProps> = ({
  size = 'md',
  showTagline = true,
  withLink = false,
  className = '',
  isWhiteOnDark = false,
}) => {
  const dimensions = {
    sm: { width: 100, height: 56, taglineClass: 'text-[9px]' },
    md: { width: 135, height: 76, taglineClass: 'text-[10.5px]' },
    lg: { width: 190, height: 107, taglineClass: 'text-xs' },
    xl: { width: 250, height: 141, taglineClass: 'text-sm' },
  }[size];

  const content = (
    <div
      className={`inline-flex flex-col items-center justify-center select-none font-sans ${className}`}
    >
      <div className={`relative flex items-center justify-center overflow-hidden rounded-lg ${isWhiteOnDark ? 'bg-white p-1' : ''}`}>
        <Image
          src="/images/swarali-logo.jpg"
          alt="स्वराली प्रिंट्स - Swarali Prints"
          width={dimensions.width}
          height={dimensions.height}
          priority
          className="object-contain mix-blend-multiply drop-shadow-xs"
        />
      </div>

      {showTagline && (
        <div className="mt-1 flex items-center justify-center">
          <span
            className={`font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 whitespace-nowrap ${dimensions.taglineClass}`}
          >
            Your Ideas, Our Prints
          </span>
        </div>
      )}
    </div>
  );

  if (withLink) {
    return (
      <Link
        href="/"
        className="flex items-center group transition-transform hover:scale-[1.03] active:scale-[0.98]"
        aria-label="Swarali Prints Home"
      >
        {content}
      </Link>
    );
  }

  return content;
};

export default SwaraliLogo;
