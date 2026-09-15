'use client';

import React from 'react';
import Link from 'next/link';
import { Printer, Sparkles, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { INITIAL_SERVICES } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';

export default function ServicesPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Printing Services in Cidco, Nashik | Swarali Prints',
    description: 'Explore full catalog of printing services at Swarali Prints, Trimurti Chowk, Cidco, Nashik.',
    itemListElement: INITIAL_SERVICES.map((srv, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Service',
        name: srv.name,
        description: srv.shortDescription,
        url: `https://swaraliprints.com/services/${srv.slug}`,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <JsonLd data={schema} />
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb & Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-pink-600">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Services</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Printing Services in Cidco, Nashik
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
              We operate high-definition digital presses and heavy-duty outdoor eco-solvent large format machines right at our Trimurti Chowk shop. Select any service to customize options, review turnaround time, or start a direct print order.
            </p>
          </div>

          {/* Quick CTA Banner */}
          <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
            <div>
              <h2 className="text-xl sm:text-2xl font-black">Need a Custom Printing Job with Live Price Calculation?</h2>
              <p className="text-xs sm:text-sm text-pink-100 mt-1">
                Enter your exact dimensions, upload your PDF/file, and get immediate transparent rates.
              </p>
            </div>
            <Link
              href="/custom-printing"
              className="py-3 px-6 rounded-xl bg-white text-pink-600 font-extrabold text-sm shadow-md hover:bg-pink-50 transition-colors whitespace-nowrap flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Launch Custom Print Studio</span>
            </Link>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-pink-300 hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/85 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur">
                    ₹{srv.startingPrice} {srv.unit}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {srv.marathiName && (
                      <div className="text-xs text-pink-600 font-bold mb-1">
                        {srv.marathiName}
                      </div>
                    )}
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                      <Link href={`/services/${srv.slug}`}>{srv.name}</Link>
                    </h2>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                      {srv.shortDescription}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Turnaround:</span>
                      <span className="font-semibold text-slate-800">{srv.turnaroundTime}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Min. Order:</span>
                      <span className="font-semibold text-slate-800">{srv.minOrderQuantity} Unit</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/services/${srv.slug}`}
                      className="py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1"
                    >
                      <span>Explore Options</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>

                    <Link
                      href={`/custom-printing?service=${srv.slug}`}
                      className="py-2.5 px-4 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs transition-colors"
                    >
                      Start Order &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
