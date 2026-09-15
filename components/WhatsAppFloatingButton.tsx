'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

export const WhatsAppFloatingButton: React.FC = () => {
  return (
    <aside aria-label="WhatsApp Support" className="fixed bottom-6 right-6 z-40 flex items-center group">
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 rounded-full bg-slate-900/90 backdrop-blur text-white text-xs font-semibold shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none translate-x-2 group-hover:translate-x-0 border border-slate-700">
        Chat with Swarali Prints
      </span>
      <a
        href={buildWhatsAppChatLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
        aria-label="Chat with Swarali Prints on WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-lime-400 rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-lime-400 rounded-full border-2 border-white" />
        <MessageCircle className="w-7 h-7" />
      </a>
    </aside>
  );
};

export default WhatsAppFloatingButton;
