'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, Sparkles, MapPin, Clock, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import CustomPrintingBuilder from '@/components/CustomPrintingBuilder';
import { JsonLd } from '@/components/JsonLd';

function CustomPrintingContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || 'flex-printing';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb & Intro */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-pink-600">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Custom Printing Studio</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Custom Printing Studio
        </h1>
        <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
          Configure exact sizes, custom materials, eyelets, duplexing, and binding. Upload your design or request design help. Receive immediate live pricing with proof approval before printing.
        </p>
      </div>

      <CustomPrintingBuilder initialService={initialService} />
    </div>
  );
}

export default function CustomPrintingPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Custom Printing Services | Swarali Prints Cidco Nashik',
    description: 'Dynamic custom flex banners, visiting cards, document Xerox, and stickers configurator with live calculation.',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Swarali Prints',
      address: 'Shop No. 1, Opp. New Sadguru Hotel, Trimurti Chowk, Cidco, Nashik 422008',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <JsonLd data={schema} />
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <Suspense fallback={<div className="text-center py-20 text-slate-500">Loading custom printing studio...</div>}>
          <CustomPrintingContent />
        </Suspense>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
