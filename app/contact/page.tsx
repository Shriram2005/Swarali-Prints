'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { INITIAL_SETTINGS } from '@/lib/data';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !message.trim()) return;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Breadcrumb & Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-pink-600">Home</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Contact Us</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              Get in Touch with Swarali Prints
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
              Visit our print workshop at Trimurti Chowk, Cidco, Nashik or message us directly on WhatsApp for instantaneous quotes and status checks.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Contact Details & Map (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">Store Information</h2>

                <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-pink-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Shop Address:</strong>
                      Shop No. 1, Opposite New Sadguru Hotel,<br />
                      Trimurti Chowk, Cidco, Shivshakti Nagar,<br />
                      Nashik, Maharashtra – 422008
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Call / WhatsApp:</strong>
                      <a href="tel:+919823123456" className="text-pink-600 font-bold hover:underline block">
                        +91 98231 23456
                      </a>
                      <a href="tel:+919422278910" className="text-slate-600 hover:underline block">
                        +91 94222 78910
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Email Inquiries:</strong>
                      <a href="mailto:swaraliprints@gmail.com" className="text-slate-700 hover:underline">
                        swaraliprints@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-lime-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-slate-900 font-bold">Counter Timings:</strong>
                      <p>Mon – Sat: 9:30 AM to 9:00 PM</p>
                      <p>Sun: 10:00 AM to 2:00 PM</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href={INITIAL_SETTINGS.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs shadow flex items-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                  </a>

                  <a
                    href={buildWhatsAppChatLink('Hello Swarali Prints, I want to inquire about printing services.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-5 rounded-xl border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-bold text-xs flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Quick WhatsApp Chat</span>
                  </a>
                </div>
              </div>

              {/* Map Embed */}
              <div className="h-64 rounded-3xl overflow-hidden border border-slate-200 shadow-xs">
                <iframe
                  title="Google Maps Location"
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

            {/* Quick Contact Form (6 cols) */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900">Send an Online Message</h2>

                {sent ? (
                  <div className="p-8 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="font-bold text-base">Message Sent Successfully!</h3>
                    <p className="text-xs">
                      Thank you, {name}. We will call or WhatsApp you on {phone} shortly.
                    </p>
                    <button
                      type="button"
                      onClick={() => setSent(false)}
                      className="mt-2 text-xs font-bold text-pink-600 underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Anand Shinde"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Phone / WhatsApp Number *</label>
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
                      <label className="block text-xs font-bold text-slate-700">Your Message / Requirement *</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Tell us what you would like to print, quantity, size, or any questions..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit Message</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
