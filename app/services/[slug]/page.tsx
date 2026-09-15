'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Printer,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { INITIAL_SERVICES } from '@/lib/data';
import { JsonLd } from '@/components/JsonLd';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = use(params);
  const service = INITIAL_SERVICES.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const relatedServices = INITIAL_SERVICES.filter((s) => s.id !== service.id).slice(0, 3);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.fullDescription,
    provider: {
      '@type': 'LocalBusiness',
      name: 'Swarali Prints',
      telephone: '+919823123456',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Shop No. 1, Opposite New Sadguru Hotel, Trimurti Chowk',
        addressLocality: 'Cidco, Nashik',
        postalCode: '422008',
      },
    },
    areaServed: 'Nashik',
    offers: {
      '@type': 'Offer',
      price: service.startingPrice,
      priceCurrency: 'INR',
    },
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <JsonLd data={schema} />
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-pink-600">Home</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-pink-600">Services</Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold">{service.name}</span>
          </div>

          {/* Service Hero Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Image & Visuals (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-md bg-white">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow">
                  Starting at ₹{service.startingPrice} {service.unit}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5 text-blue-950">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Swarali Prints Quality Guarantee</span>
                </div>
                <p>
                  Every order includes complimentary digital proofing. We only print after your explicit confirmation.
                </p>
              </div>
            </div>

            {/* Right Details & Direct CTAs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                {service.marathiName && (
                  <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold mb-2">
                    {service.marathiName} • Cidco, Nashik
                  </span>
                )}
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {service.name} in Cidco, Nashik
                </h1>
                <p className="text-slate-600 text-base leading-relaxed mt-3">
                  {service.fullDescription}
                </p>
              </div>

              {/* Key Specs Box */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Service Specifications & Technical Details:
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {service.specifications.map((spec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-slate-400 font-medium">{spec.label}</div>
                      <div className="font-bold text-slate-800 mt-0.5">{spec.value}</div>
                    </div>
                  ))}
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 font-medium">Turnaround Time</div>
                    <div className="font-bold text-slate-800 mt-0.5">{service.turnaroundTime}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-slate-400 font-medium">Pickup Location</div>
                    <div className="font-bold text-slate-800 mt-0.5">Trimurti Chowk, Cidco</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <Link
                  href={`/custom-printing?service=${service.slug}`}
                  className="py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Configure & Calculate Price Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href={buildWhatsAppChatLink(`Hello Swarali Prints, I am interested in ${service.name} at your Cidco shop.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 rounded-xl border border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-700 font-bold text-sm transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Inquire via WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Related Services in Nashik */}
          <div className="pt-10 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Other Printing Services You Might Need
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <div
                  key={rel.id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-pink-300 hover:shadow-md transition-all flex flex-col justify-between space-y-3"
                >
                  <div>
                    <h3 className="font-bold text-slate-900 hover:text-pink-600 text-sm">
                      <Link href={`/services/${rel.slug}`}>{rel.name}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-pink-600">₹{rel.startingPrice} {rel.unit}</span>
                    <Link
                      href={`/services/${rel.slug}`}
                      className="text-blue-900 font-bold hover:underline"
                    >
                      View &rarr;
                    </Link>
                  </div>
                </div>
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
