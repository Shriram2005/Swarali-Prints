'use client';

import React from 'react';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-40 pointer-events-none">
      <a
        href={buildWhatsAppChatLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_4px_20px_rgba(37,211,102,0.45)] hover:shadow-[0_6px_25px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-300 pointer-events-auto"
        aria-label="Chat with Swarali Prints on WhatsApp"
        title="Chat on WhatsApp"
      >
        <span className="hidden md:inline-block absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-900/95 backdrop-blur text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0 border border-slate-700">
          Chat with Swarali Prints on WhatsApp
        </span>
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-lime-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-lime-400 rounded-full border-2 border-white" />
        <svg
          viewBox="0 0 24 24"
          className="w-7 h-7 fill-white"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.5 3.67 12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.4C16.31 14.28 15.09 13.68 14.86 13.6C14.64 13.52 14.47 13.47 14.31 13.72C14.14 13.97 13.67 14.52 13.52 14.69C13.38 14.85 13.23 14.88 12.98 14.75C12.73 14.63 11.93 14.36 10.98 13.52C10.24 12.87 9.75 12.06 9.6 11.81C9.46 11.56 9.59 11.43 9.71 11.31C9.82 11.2 9.96 11.02 10.09 10.87C10.21 10.72 10.25 10.62 10.33 10.45C10.42 10.29 10.37 10.14 10.31 10.02C10.25 9.89 9.75 8.67 9.54 8.18C9.34 7.69 9.14 7.76 8.98 7.75L8.5 7.74C8.33 7.74 8.06 7.8 7.83 8.05C7.61 8.3 6.98 8.88 6.98 10.07C6.98 11.25 7.84 12.39 7.96 12.56C8.08 12.72 9.66 15.15 12.08 16.19C12.66 16.44 13.1 16.59 13.46 16.7C14.04 16.89 14.57 16.86 14.99 16.8C15.46 16.73 16.43 16.21 16.63 15.64C16.84 15.07 16.84 14.58 16.78 14.48C16.72 14.38 16.56 14.31 16.56 14.4Z"
          />
        </svg>
      </a>
    </aside>
  );
};

export default WhatsAppFloatingButton;
