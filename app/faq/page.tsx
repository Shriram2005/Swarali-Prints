'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, HelpCircle, ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { FAQS_DATA } from '@/lib/data';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = FAQS_DATA.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Help Center & Guidelines</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Everything you need to know about preparing your files, reviewing digital proofs, store pickup at Trimurti Chowk, and turnaround timings.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative max-w-lg mx-auto">
            <input
              type="text"
              placeholder="Search questions (e.g. proof, flex size, pickup)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          </div>

          {/* FAQs List */}
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 text-slate-500 text-xs">
                No matching questions found. Ask us directly on WhatsApp!
              </div>
            ) : (
              filtered.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-2xs"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:text-pink-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <span className="text-slate-400 flex-shrink-0">
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Still Have Questions Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 text-emerald-950">
            <h2 className="text-xl font-bold">Have a specific question not covered here?</h2>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Our print specialist team at Trimurti Chowk, Cidco is active on WhatsApp to guide you regarding paper selection, colors, and urgent dispatch.
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppChatLink('Hello Swarali Prints, I have a question about my print job.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ask on WhatsApp Directly</span>
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
