'use client';

import React from 'react';
import Link from 'next/link';
import {
  Printer,
  Sparkles,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import SwaraliLogo from '@/components/SwaraliLogo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb & Intro */}
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-pink-600">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">About Us</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              About Swarali Prints (स्वराली प्रिंट्स)
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Serving Cidco, Nashik with reliable, high-speed, and razor-sharp printing craftsmanship since day one.
            </p>
          </div>

          {/* Story Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xs space-y-6">
            <div className="flex items-center justify-center pb-6 border-b border-slate-100">
              <SwaraliLogo size="lg" showTagline={true} />
            </div>

            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <h2 className="text-2xl font-black text-slate-900">
                "Your Ideas, Our Prints" — Our Promise to Nashik
              </h2>
              <p>
                Founded at <strong>Trimurti Chowk, Cidco</strong>, Swarali Prints began with a straightforward mission: eliminate the uncertainty, pixelated colors, and hidden costs from local commercial printing.
              </p>
              <p>
                Too often, customers order banners or business cards only to find incorrect spelling, cropped logos, or dull hues upon pickup. At Swarali Prints, we introduced our <strong>Digital Proof-First Guarantee</strong>: whether you need a 10-foot outdoor hoarding or 100 visiting cards, our design team prepares and shares a high-resolution digital proof for your explicit approval before our presses run.
              </p>
              <p>
                From college students rushing for same-day spiral bound thesis submission to retail shop owners launching new showroom frontages, we treat every single print job with absolute precision.
              </p>
            </div>
          </div>

          {/* Production Machinery & Technology */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                Industrial Infrastructure
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                Our Printing Technology
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <Printer className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Eco-Solvent Large Format Press</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  10-foot wide industrial banner printer using Japanese micro-piezo heads and UV-resistant outdoor pigments for vibrant colors that withstand Nashik sun and rain.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Digital Laser Production Color Press</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  2400 x 2400 DPI heavy cardstock printer handling 300 to 350 GSM art cards with razor-sharp microtext rendering, perfect for visiting cards and brochures.
                </p>
              </div>

              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <div className="w-10 h-10 rounded-xl bg-lime-50 text-lime-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">Thermal Lamination & Finishing</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  High-heat velvet matte and mirror gloss lamination units, precision hydraulic paper guillotine cutters, and automatic eyeletting machines.
                </p>
              </div>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black">
              Ready to bring your print project to life?
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto">
              Drop by our Trimurti Chowk counter or use our instant online custom printing studio.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <Link
                href="/custom-printing"
                className="py-3 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow"
              >
                Custom Printing Studio
              </Link>
              <Link
                href="/contact"
                className="py-3 px-6 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Visit Store in Cidco
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
