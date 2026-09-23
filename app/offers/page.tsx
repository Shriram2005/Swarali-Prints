'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Tag, Copy, Check, Sparkles, ArrowRight, Percent, Award } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { INITIAL_COUPONS } from '@/lib/data';

export default function OffersPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14"> 
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-pink-600">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Special Offers & Deals</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Exclusive Printing Offers in Nashik
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Save more on every print job with our student discounts, first-order promotions, and seasonal festival bundles.
            </p>
          </div>

          {/* Active Coupons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INITIAL_COUPONS.map((coupon) => (
              <div
                key={coupon.code}
                className="bg-white rounded-3xl border-2 border-dashed border-pink-200 p-6 sm:p-7 shadow-xs hover:border-pink-500 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
                      <Percent className="w-3.5 h-3.5" />
                      {coupon.discountType === 'percentage'
                        ? `${coupon.discountValue}% OFF`
                        : `₹${coupon.discountValue} FLAT OFF`}
                    </span>

                    <span className="text-[11px] text-slate-400">
                      Min Order: ₹{coupon.minOrderAmount || coupon.minOrderValue}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 pt-1">
                    {coupon.description}
                  </h2>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                    <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                      {coupon.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="text-pink-600 hover:text-pink-700 p-1"
                      title="Copy Coupon"
                    >
                      {copiedCode === coupon.code ? (
                        <Check className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <Link
                    href="/custom-printing"
                    className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors flex items-center gap-1.5"
                  >
                    <span>Use Coupon</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Student & Bulk Notice */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-3xl p-8 shadow-md grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-bold uppercase tracking-wider">
                Nashik Colleges & Corporate Discounts
              </span>
              <h3 className="text-2xl font-black">
                Special Student & Institutional Rates
              </h3>
              <p className="text-xs text-blue-200 leading-relaxed">
                College students from KBTCOE, Sandip Foundation, MET BKC, and Pethe High School get special bulk rates for thesis hard binding, seminar posters, and certificates.
              </p>
            </div>

            <div className="md:text-right">
              <Link
                href="/request-quote"
                className="inline-flex items-center gap-2 py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow transition-colors"
              >
                <span>Request Institutional Quote</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
