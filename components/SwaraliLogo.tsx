'use client';

import React from 'react';
import Link from 'next/link';

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
    sm: { width: 140, height: 48, scale: 0.7 },
    md: { width: 190, height: 64, scale: 0.95 },
    lg: { width: 260, height: 88, scale: 1.3 },
    xl: { width: 340, height: 114, scale: 1.7 },
  }[size];

  const content = (
    <div
      className={`inline-flex flex-col items-center justify-center select-none font-sans ${className}`}
      style={{ minWidth: dimensions.width }}
    >
      <svg
        viewBox="0 0 340 120"
        width={dimensions.width}
        height={dimensions.height}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
        aria-label="Swarali Prints Logo"
      >
        <defs>
          <linearGradient id="swaraliMagenta" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f43f5e" />
            <stop offset="50%" stopColor="#e11d74" />
            <stop offset="100%" stopColor="#be185d" />
          </linearGradient>
          <linearGradient id="swaraliBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
          <linearGradient id="swaraliGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#65a30d" />
          </linearGradient>
          <linearGradient id="swaraliPurple" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="100%" stopColor="#7e22ce" />
          </linearGradient>
          <filter id="shadowFilter" x="-10%" y="-10%" width="130%" height="130%">
            <feDropShadow dx="2" dy="3" stdDeviation="2" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Dynamic Artistic Brush Splatters / Circles in background */}
        {/* Blue Brush Splash Left */}
        <path
          d="M 15 42 Q 60 32, 105 44 Q 80 58, 25 56 Z"
          fill="url(#swaraliBlue)"
          opacity="0.85"
        />
        <ellipse cx="40" cy="48" rx="26" ry="12" fill="#2563eb" opacity="0.9" />

        {/* Purple Splash Center */}
        <circle cx="170" cy="46" r="38" fill="url(#swaraliPurple)" opacity="0.9" />
        <path
          d="M 125 45 Q 170 12, 225 35 Q 210 75, 140 70 Z"
          fill="#9333ea"
          opacity="0.5"
        />

        {/* Lime Green Brush Strokes Bottom-Left and Right */}
        <path
          d="M 22 68 Q 65 62, 110 70 Q 75 80, 20 76 Z"
          fill="url(#swaraliGreen)"
          opacity="0.9"
        />
        <path
          d="M 220 62 Q 275 58, 318 68 Q 280 80, 225 74 Z"
          fill="url(#swaraliGreen)"
          opacity="0.85"
        />

        {/* Yellow-Lime Splatters */}
        <circle cx="28" cy="38" r="4" fill="#a3e635" />
        <circle cx="310" cy="50" r="5" fill="#a3e635" />
        <circle cx="165" cy="18" r="4" fill="#f43f5e" />

        {/* Swarali Devanagari Title Calligraphy: स्वराली */}
        <g filter="url(#shadowFilter)">
          {/* White outline backdrop for ultra high contrast */}
          <text
            x="165"
            y="56"
            textAnchor="middle"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="8"
            strokeLinejoin="round"
            fontSize="46"
            fontWeight="900"
            fontFamily="'Hind', 'Noto Sans Devanagari', 'Yatra One', sans-serif"
          >
            स्वराली
          </text>
          {/* Main Calligraphy Text */}
          <text
            x="165"
            y="56"
            textAnchor="middle"
            fill="url(#swaraliMagenta)"
            stroke="#be185d"
            strokeWidth="1"
            fontSize="46"
            fontWeight="900"
            letterSpacing="1"
            fontFamily="'Hind', 'Noto Sans Devanagari', 'Yatra One', sans-serif"
          >
            स्वराली
          </text>
        </g>

        {/* Prints Devanagari Title: प्रिंट्स */}
        <g filter="url(#shadowFilter)">
          <text
            x="200"
            y="84"
            textAnchor="middle"
            fill="#ffffff"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinejoin="round"
            fontSize="24"
            fontWeight="800"
            fontFamily="'Hind', 'Noto Sans Devanagari', sans-serif"
          >
            प्रिंट्स
          </text>
          <text
            x="200"
            y="84"
            textAnchor="middle"
            fill="#0f172a"
            fontSize="24"
            fontWeight="900"
            letterSpacing="2"
            fontFamily="'Hind', 'Noto Sans Devanagari', sans-serif"
          >
            प्रिंट्स
          </text>
        </g>

        {/* Bottom Banner with Tagline if enabled */}
        {showTagline && (
          <g>
            <rect
              x="5"
              y="96"
              width="330"
              height="20"
              rx="4"
              fill="url(#swaraliMagenta)"
            />
            <text
              x="170"
              y="110"
              textAnchor="middle"
              fill="#ffffff"
              fontSize="10.5"
              fontWeight="800"
              letterSpacing="0.8"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              Swarali Prints – Your Ideas, Our Prints
            </text>
          </g>
        )}
      </svg>
    </div>
  );

  if (withLink) {
    return (
      <Link href="/" className="flex items-center group transition-transform hover:scale-[1.02]">
        {content}
      </Link>
    );
  }

  return content;
};

export default SwaraliLogo;
