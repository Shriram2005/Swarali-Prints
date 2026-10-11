'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Printer,
  Sparkles,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ShieldCheck,
  Award,
  Star,
  CheckCircle2,
  ArrowRight,
  UploadCloud,
  FileText,
  CreditCard,
  Layers,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Store,
} from 'lucide-react';
import SwaraliLogo from '@/components/SwaraliLogo';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import CustomPrintingBuilder from '@/components/CustomPrintingBuilder';
import { JsonLd, getLocalBusinessSchema } from '@/components/JsonLd';
import { INITIAL_SERVICES, INITIAL_PRODUCTS, INITIAL_REVIEWS, INITIAL_SETTINGS, FAQS_DATA, INITIAL_PORTFOLIO } from '@/lib/data';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';
import { addToCart } from '@/lib/storage';

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedQuickService, setSelectedQuickService] = useState('flex-printing');
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const handleQuickAddToCart = (product: typeof INITIAL_PRODUCTS[0]) => {
    addToCart({
      id: `prod-${product.id}-${Date.now()}`,
      type: 'standard_product',
      productId: product.id,
      title: product.name,
      image: product.images[0],
      quantity: 1,
      unitPrice: product.salePrice || product.basePrice,
      totalPrice: product.salePrice || product.basePrice,
    });
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <JsonLd data={getLocalBusinessSchema()} />
      <Navbar />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-white pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-slate-200">
          {/* Subtle Artistic Print Ink Splatters in background */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-lime-400/10 blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Headline & CTAs (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Hyperlocal Trust Tag */}
                <a
                  href={INITIAL_SETTINGS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-50 hover:bg-pink-100 border border-pink-200 text-pink-700 text-xs font-bold tracking-wide shadow-xs transition-colors"
                  title="View Swarali Prints location on Google Maps"
                >
                  <MapPin className="w-3.5 h-3.5 text-pink-600" />
                  <span>Printing Shop at Trimurti Chowk, Cidco, Nashik</span>
                </a>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                  Your Ideas.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600">
                    Our Prints.
                  </span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                  Professional printing solutions for every idea — from everyday documents and academic thesis to custom outdoor flex banners, visiting cards, waterproof stickers, and photo mounts.
                </p>

                {/* Primary Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <Link
                    href="/custom-printing"
                    className="py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center gap-2 group"
                  >
                    <Printer className="w-5 h-5" />
                    <span>Start Custom Order</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/services"
                    className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm sm:text-base shadow-xs transition-colors flex items-center gap-2"
                  >
                    <span>Browse All Services</span>
                  </Link>

                  <a
                    href={buildWhatsAppChatLink('Hi Swarali Prints, I want to get a quote for my printing job.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3.5 px-5 rounded-xl border-2 border-emerald-600 hover:bg-emerald-50 text-emerald-700 font-bold text-sm transition-colors flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Quote</span>
                  </a>
                </div>

                {/* Proof & Local Highlights */}
                <div className="pt-6 grid grid-cols-3 gap-3 border-t border-slate-100 max-w-xl text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span className="font-semibold">Digital Proof Approval</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span className="font-semibold">Same-Day Pickup</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0" />
                    <span className="font-semibold">No Minimum Quantity</span>
                  </div>
                </div>
              </div>

              {/* Right Hero Graphic Card (5 cols) */}
              <div className="lg:col-span-5">
                <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-xl border border-slate-200 space-y-6">
                  {/* Decorative badge */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
                        Print Press Live Status: Operational
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full">
                      Cidco, Nashik
                    </span>
                  </div>

                  {/* Logo spotlight */}
                  <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200">
                    <SwaraliLogo size="lg" showTagline={true} />
                  </div>

                  {/* Quick features mini grid */}
                  <div className="space-y-2.5 text-xs text-slate-700">
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-900">Flex & Banner Printing:</span>
                      <span className="font-bold text-pink-600">From ₹12/sq.ft</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-900">Matte Visiting Cards (100 pcs):</span>
                      <span className="font-bold text-pink-600">From ₹250</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                      <span className="font-semibold text-slate-900">Laser Document / Thesis:</span>
                      <span className="font-bold text-pink-600">From ₹1.5/page</span>
                    </div>
                  </div>

                  <Link
                    href="/custom-printing"
                    className="block w-full text-center py-3 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-extrabold text-xs tracking-wider uppercase transition-colors shadow"
                  >
                    Open Instant Print Calculator &rarr;
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: BROWSE PRINTING SERVICES CATALOG */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">
                <Printer className="w-4 h-4" /> Comprehensive Printing Services
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Printing Services in Cidco, Nashik
              </h2>
              <p className="text-slate-500 text-sm mt-1 max-w-xl">
                Every service has dedicated sizing, materials, and live pricing. Click any service to view full specifications or start your custom order.
              </p>
            </div>

            <Link
              href="/services"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-900 hover:text-pink-600 transition-colors"
            >
              <span>View All 12+ Services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_SERVICES.slice(0, 8).map((srv) => (
              <div
                key={srv.id}
                className="group bg-white rounded-3xl border border-slate-200 overflow-hidden hover:border-pink-300 hover:shadow-lg transition-all flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={srv.image}
                    alt={srv.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                    ₹{srv.startingPrice} {srv.unit}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {srv.marathiName && (
                      <div className="text-xs text-pink-600 font-bold mb-0.5">
                        {srv.marathiName}
                      </div>
                    )}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {srv.shortDescription}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">{srv.turnaroundTime}</span>
                    <Link
                      href={`/services/${srv.slug}`}
                      className="font-bold text-blue-900 hover:text-pink-600 flex items-center gap-0.5"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: DEDICATED CUSTOM PRINTING STUDIO BUILDER */}
        <section className="py-12 bg-slate-100/70 border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
                Instant Price Calculator
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Order Your Custom Prints Online
              </h2>
              <p className="text-slate-600 text-sm">
                Select your service, choose dimensions, select finishing, upload your file, and get exact pricing with same-day Cidco store pickup.
              </p>
            </div>

            <CustomPrintingBuilder initialService={selectedQuickService} />
          </div>
        </section>

        {/* SECTION: FEATURED E-COMMERCE PRODUCTS */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                Ready to Order
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Popular Print Products
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Pre-configured printing packages with standard sizes and fast delivery.
              </p>
            </div>

            <Link
              href="/products"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-900 hover:text-pink-600 transition-colors"
            >
              <span>View All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {INITIAL_PRODUCTS.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col group"
              >
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {prod.salePrice && (
                    <div className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                      Save ₹{prod.basePrice - prod.salePrice}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                      <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {prod.shortDescription}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs text-slate-400">Starting at</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-black text-slate-900">
                          ₹{prod.salePrice || prod.basePrice}
                        </span>
                        {prod.salePrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ₹{prod.basePrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleQuickAddToCart(prod)}
                        className={`p-2.5 rounded-xl transition-all ${
                          addedProductId === prod.id
                            ? 'bg-emerald-600 text-white'
                            : 'bg-pink-50 hover:bg-pink-600 text-pink-600 hover:text-white'
                        }`}
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/products/${prod.slug}`}
                        className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                      >
                        Configure &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: HOW IT WORKS */}
        <section className="py-16 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Simple & Transparent Process
              </span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
                How Ordering Works at Swarali Prints
              </h2>
              <p className="text-slate-400 text-sm">
                No guessing games. Know exact pricing and approve your proof before we hit print.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Choose & Customize',
                  desc: 'Pick your banner, visiting cards, stickers, or document specs with custom width, height, and paper stock.',
                },
                {
                  step: '02',
                  title: 'Upload File or Request Design',
                  desc: 'Attach your PDF/JPG or let our in-house designers create a custom layout for you.',
                },
                {
                  step: '03',
                  title: 'Review & Approve Proof',
                  desc: 'We generate a digital proof. You approve it online or on WhatsApp before final press printing.',
                },
                {
                  step: '04',
                  title: 'Pickup or Fast Delivery',
                  desc: 'Collect at Trimurti Chowk Cidco shop or receive local delivery across Nashik.',
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="bg-slate-800/80 rounded-3xl p-6 border border-slate-700/80 space-y-3 relative overflow-hidden"
                >
                  <div className="text-3xl font-black text-pink-500/30">{item.step}</div>
                  <h3 className="text-lg font-bold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: PORTFOLIO & RECENT WORK */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                Craftsmanship
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
                Recent Printing Work in Nashik
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Real photographs of banners, wedding cards, thesis books, and product packaging completed at our shop.
              </p>
            </div>

            <Link
              href="/portfolio"
              className="inline-flex items-center gap-1 text-sm font-extrabold text-blue-900 hover:text-pink-600 transition-colors"
            >
              <span>Explore Full Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INITIAL_PORTFOLIO.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="group rounded-3xl overflow-hidden border border-slate-200 bg-white hover:shadow-lg transition-all"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur">
                    {item.category}
                  </div>
                </div>
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-slate-900 group-hover:text-pink-600 transition-colors text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION: CUSTOMER REVIEWS */}
        <section className="py-16 bg-pink-50/40 border-y border-pink-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
                Trusted by Local Nashik Businesses & Residents
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                What Our Customers Say
              </h2>
              <p className="text-slate-600 text-sm">
                4.9 / 5 Star Rating based on real orders from Cidco, Trimurti Chowk, and nearby areas.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {INITIAL_REVIEWS.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex text-amber-400">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-slate-600 italic leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 text-xs">
                    <div className="font-bold text-slate-900">{rev.customerName}</div>
                    <div className="text-slate-400 text-[11px]">{rev.area}</div>
                    <div className="text-[10px] text-pink-600 font-semibold mt-0.5">
                      Service: {rev.serviceUsed}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION: STORE LOCATION & GOOGLE MAPS */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              {/* Store Information (6 cols) */}
              <div className="lg:col-span-6 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-600 uppercase tracking-wider mb-2">
                    <MapPin className="w-4 h-4 text-pink-600" />
                    <span>Physical Store Location</span>
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    Visit Swarali Prints at Trimurti Chowk, Cidco
                  </h2>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xl">
                    Drop by our workshop for instant printing, sample paper inspection, thesis binding, or face-to-face banner design consultations with our specialists.
                  </p>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-pink-200 hover:bg-pink-50/20 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Store className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-sm">
                        Address
                      </strong>
                      <span className="text-slate-600 text-xs sm:text-sm mt-0.5 block leading-relaxed">
                        Shop No. 1, Opposite New Sadguru Hotel, Trimurti Chowk, Cidco, Shivshakti Nagar, Nashik, Maharashtra 422008
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-200 hover:bg-blue-50/20 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-sm">
                        Store Hours
                      </strong>
                      <span className="text-slate-600 text-xs sm:text-sm mt-0.5 block">
                        Mon – Sat: 9:30 AM – 9:00 PM | Sun: 10:00 AM – 2:00 PM
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-200 hover:bg-emerald-50/20 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <strong className="text-slate-900 block font-bold text-sm">
                        Phone Lines
                      </strong>
                      <span className="text-slate-600 text-xs sm:text-sm mt-0.5 block font-medium">
                        +91 98231 23456 / +91 94222 78910
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <a
                    href={INITIAL_SETTINGS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 sm:py-3.5 sm:px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 2.29a1 1 0 0 1 1.42 0l8.88 8.88a1 1 0 0 1 0 1.42l-8.88 8.88a1 1 0 0 1-1.42 0l-8.88-8.88a1 1 0 0 1 0-1.42l8.88-8.88z" />
                      <path d="M9 14.5v-3a2 2 0 0 1 2-2h4" />
                      <path d="M12.5 7l3 2.5-3 2.5" />
                    </svg>
                    <span>Get Directions on Google Maps</span>
                  </a>

                  <Link
                    href="/printing-shop-cidco-nashik"
                    className="py-3 px-4 sm:py-3.5 sm:px-5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Cidco Store Guide</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </Link>
                </div>
              </div>

              {/* Google Map Showing Swarali Prints Shop Location (6 cols) */}
              <div className="lg:col-span-6">
                <div className="relative rounded-2xl overflow-hidden shadow-sm h-80 sm:h-96 lg:h-[420px] w-full border border-slate-200 bg-slate-100">
                  <iframe
                    title="Swarali Prints Google Maps Location"
                    src={INITIAL_SETTINGS.googleMapsEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: FREQUENTLY ASKED QUESTIONS */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <span className="text-xs font-bold text-pink-600 uppercase tracking-wider">
              Answers & Help
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-slate-500 text-sm">
              Common questions about file formats, proof reviews, and store pickup in Cidco, Nashik.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS_DATA.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-pink-600 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <span className="text-slate-400 text-lg flex-shrink-0">
                      {isOpen ? '−' : '+'}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
