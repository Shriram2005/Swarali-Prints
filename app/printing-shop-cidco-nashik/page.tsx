'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Clock,
  Phone,
  Printer,
  ShieldCheck,
  CheckCircle2,
  Navigation,
  ExternalLink,
  Sparkles,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { JsonLd, getLocalBusinessSchema } from '@/components/JsonLd';
import { INITIAL_SETTINGS, INITIAL_SERVICES, FAQS_DATA } from '@/lib/data';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

export default function CidcoPrintingShopPage() {
  const cidcoKeywords = [
    'Printing shop in Cidco Nashik',
    'Flex printing Trimurti Chowk',
    'Visiting card printing Cidco',
    'Xerox shop near Trimurti Chowk',
    'Custom banner printing Nashik',
    'Digital printing service Cidco',
    'Thesis & project binding Nashik',
    'Urgent print shop in Cidco',
    'Vinyl sticker printing Cidco',
    'Pamphlet & flyer printing Nashik',
  ];

  const nearbyAreas = [
    'Trimurti Chowk (Opp. New Sadguru Hotel)',
    'Shivshakti Nagar',
    'Uttam Nagar',
    'Pawan Nagar',
    'Cidco Bus Stand (Pethe High School area)',
    'Govind Nagar & City Center Mall link road',
    'Kamod Nagar & Lekha Nagar',
    'Ambad MIDC & Satpur MIDC (Commercial orders)',
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <JsonLd data={getLocalBusinessSchema()} />
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">Printing Shop in Cidco, Nashik</span>
          </div>

          {/* Local Hero Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm relative overflow-hidden">
            <div className="max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold tracking-wide">
                <MapPin className="w-3.5 h-3.5 text-pink-600" />
                <span>Trimurti Chowk, Cidco, Nashik</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                Your Trusted Printing Shop in Cidco, Nashik
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                Welcome to <strong>Swarali Prints (स्वराली प्रिंट्स)</strong>. Located opposite New Sadguru Hotel at Trimurti Chowk, we are Cidco's premier destination for high-resolution flex banners, professional business cards, academic thesis and Xerox, waterproof stickers, wedding cards, and vibrant marketing displays.
              </p>

              {/* Direct CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  href="/custom-printing"
                  className="py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Start Custom Order Online</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={INITIAL_SETTINGS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-sm transition-colors flex items-center gap-2 shadow"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Get Directions on Google Maps</span>
                </a>

                <a
                  href={buildWhatsAppChatLink('Hello Swarali Prints, I want to visit your Cidco shop for printing.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-xl border border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </div>
            </div>
          </div>

          {/* Hyperlocal NAP & Landmarks Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Store NAP Information (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Store Contact & Operational Details
                </h2>

                <div className="space-y-3.5 text-xs text-slate-700">
                  <a
                    href={INITIAL_SETTINGS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 group hover:text-slate-900 transition-colors"
                    title="Open Swarali Prints on Google Maps"
                  >
                    <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                    <div>
                      <strong className="text-slate-900 text-sm block font-bold group-hover:text-pink-600 transition-colors">
                        Physical Address (Click for Directions):
                      </strong>
                      Shop No. 1, Opposite New Sadguru Hotel,<br />
                      Trimurti Chowk, Cidco, Shivshakti Nagar,<br />
                      Nashik, Maharashtra – 422008
                    </div>
                  </a>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Telephone / WhatsApp:</strong>
                      <div className="space-y-0.5">
                        <a href="tel:+919823123456" className="text-pink-600 font-bold hover:underline block">
                          +91 98231 23456 (Primary Counter)
                        </a>
                        <a href="tel:+919422278910" className="text-slate-700 hover:underline block">
                          +91 94222 78910 (Design & Production)
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block font-bold">Store Opening Hours:</strong>
                      <p>Monday to Saturday: 9:30 AM – 9:00 PM</p>
                      <p>Sunday: 10:00 AM – 2:00 PM</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Areas */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900">
                  Serving Neighborhoods across Cidco & Nashik:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {nearbyAreas.map((area, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Embedded Google Map (7 cols) */}
            <div className="lg:col-span-7 h-96 sm:h-[420px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
              <iframe
                title="Swarali Prints Cidco Google Maps"
                src={INITIAL_SETTINGS.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Popular Services for Cidco Customers */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Most Popular Printing in Cidco
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Whether for your local retail store, college thesis, or festival event, we have ready machines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {INITIAL_SERVICES.slice(0, 4).map((srv) => (
                <div key={srv.id} className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs hover:border-pink-300 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <img src={srv.image} alt={srv.name} className="w-full h-36 object-cover rounded-2xl" />
                    <h3 className="font-bold text-slate-900 text-sm">
                      <Link href={`/services/${srv.slug}`}>{srv.name}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {srv.shortDescription}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-pink-600">₹{srv.startingPrice} {srv.unit}</span>
                    <Link href={`/custom-printing?service=${srv.slug}`} className="text-blue-900 font-bold hover:underline">
                      Order &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Keyword Cloud */}
          <div className="bg-slate-100/80 rounded-3xl p-6 sm:p-8 space-y-4 text-xs">
            <h3 className="font-bold text-slate-700 uppercase tracking-wider text-xs">
              Frequently Searched Printing Topics in Nashik:
            </h3>
            <div className="flex flex-wrap gap-2">
              {cidcoKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 shadow-2xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
