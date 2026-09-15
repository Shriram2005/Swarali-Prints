'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Send,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  Building,
  Phone,
  Calendar,
  Layers,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import FileUploader from '@/components/FileUploader';
import { UploadedFile, QuoteRequest } from '@/lib/types';
import { saveQuoteRequest } from '@/lib/storage';
import { buildWhatsAppQuoteInquiry } from '@/lib/whatsapp';

export default function RequestQuotePage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceType, setServiceType] = useState('Flex / Hoarding Banner');
  const [quantity, setQuantity] = useState('500');
  const [deadline, setDeadline] = useState('Within 48 hours');
  const [description, setDescription] = useState('');
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitted, setSubmitted] = useState<QuoteRequest | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please fill in your name and phone number.');
      return;
    }

    const newQuote: QuoteRequest = {
      id: `QR-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName: name,
      name,
      company: company || undefined,
      phone,
      email: email || undefined,
      serviceNeeded: serviceType,
      serviceType,
      approxQuantity: quantity,
      quantity,
      estimatedBudget: undefined,
      deadline,
      description,
      files,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    saveQuoteRequest(newQuote);
    setSubmitted(newQuote);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Header */}
          <div className="space-y-3 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-3.5 h-3.5" />
              <span>B2B & Bulk Order Inquiries</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Request a Custom Commercial Quote
            </h1>
            <p className="text-slate-600 text-sm">
              Ordering large volumes of flex banners, corporate brochures, event passes, or election materials? Tell us your requirements and receive our best volume discount rates within 2 hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Quote Request Received: {submitted.id}
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-3">
                  Thank You, {submitted.name}!
                </h2>
                <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
                  Our Trimurti Chowk estimator team has received your quote request and is calculating the best commercial wholesale pricing for your {submitted.serviceType}.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                <a
                  href={buildWhatsAppQuoteInquiry({
                    name: submitted.name || submitted.customerName,
                    phone: submitted.phone,
                    service: submitted.serviceType || submitted.serviceNeeded,
                    quantity: submitted.quantity || submitted.approxQuantity,
                    notes: submitted.description,
                  })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Quote Directly to WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => setSubmitted(null)}
                  className="py-3 px-5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
                >
                  Submit Another Quote
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kulkarni"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Company / Shop / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Kulkarni Jewelers / Sai Coaching Classes"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Mobile / WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9823123456"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. ramesh@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Service Category</label>
                  <select
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  >
                    <option>Flex / Hoarding Banner</option>
                    <option>Visiting Cards (1,000+)</option>
                    <option>Pamphlets & Flyers (5,000+)</option>
                    <option>Product Stickers & Roll Labels</option>
                    <option>Books / Manuals / Thesis Binding</option>
                    <option>Election Campaign Package</option>
                    <option>Event Standees & Backdrops</option>
                    <option>Other Custom Requirement</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Approx. Quantity</label>
                  <input
                    type="text"
                    placeholder="e.g. 5,000 pcs or 1,200 sq.ft"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Expected Delivery</label>
                  <select
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  >
                    <option>Same Day (Urgent)</option>
                    <option>Within 24 Hours</option>
                    <option>Within 2 to 3 Days</option>
                    <option>Flexible / Planning Ahead</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">Detailed Specifications / Sizing</label>
                <textarea
                  rows={3}
                  placeholder="e.g. We need 10 frontlit flex banners of size 10x6 ft with eyelets on all corners, plus 2000 glossy pamphlets in A5 size."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              {/* Optional Reference File */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Attach Sample Design or RFQ Document (Optional)</label>
                <FileUploader onFilesChanged={setFiles} maxFiles={3} />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Bulk Quote Request</span>
              </button>
            </form>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
