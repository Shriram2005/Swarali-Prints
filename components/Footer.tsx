import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Award,
  CheckCircle2,
} from 'lucide-react';
import SwaraliLogo from './SwaraliLogo';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Store Profile (2 Cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/95 p-3 rounded-xl inline-block shadow-md">
              <SwaraliLogo size="md" showTagline={true} />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your trusted local printing partner in Cidco, Nashik. From everyday Xerox and student thesis binding to massive 20ft outdoor flex banners, high-resolution visiting cards, and custom die-cut vinyl stickers.
            </p>

            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-lime-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> High-Speed Eco-Solvent
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-pink-400">
                <Award className="w-3.5 h-3.5" /> Proof Approval Before Print
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-blue-400">
                <MapPin className="w-3.5 h-3.5" /> Trimurti Chowk Store
              </span>
            </div>

            <div className="pt-2">
              <a
                href={buildWhatsAppChatLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold shadow transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Inquiry</span>
              </a>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-pink-500" />
              Printing Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/flex-printing" className="hover:text-pink-400 transition-colors">
                  Flex & Banner Printing
                </Link>
              </li>
              <li>
                <Link href="/services/visiting-card-printing" className="hover:text-pink-400 transition-colors">
                  Visiting & Business Cards
                </Link>
              </li>
              <li>
                <Link href="/services/document-printing" className="hover:text-pink-400 transition-colors">
                  Document & Thesis Printing
                </Link>
              </li>
              <li>
                <Link href="/services/sticker-label-printing" className="hover:text-pink-400 transition-colors">
                  Waterproof Vinyl Stickers
                </Link>
              </li>
              <li>
                <Link href="/services/poster-printing" className="hover:text-pink-400 transition-colors">
                  Posters & Sunboard Mounts
                </Link>
              </li>
              <li>
                <Link href="/services/flyer-brochure-printing" className="hover:text-pink-400 transition-colors">
                  Pamphlets & Brochures
                </Link>
              </li>
              <li>
                <Link href="/services/invitation-printing" className="hover:text-pink-400 transition-colors">
                  Wedding Cards & Stationery
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer & Order Links */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              Quick Actions
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/custom-printing" className="text-pink-400 hover:underline font-semibold flex items-center gap-1">
                  <span>Custom Print Calculator</span> &rarr;
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Shop Ready Products
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-white transition-colors">
                  Track Your Order Status
                </Link>
              </li>
              <li>
                <Link href="/request-quote" className="hover:text-white transition-colors">
                  Request Bulk Quotation
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-white transition-colors">
                  Portfolio & Recent Work
                </Link>
              </li>
              <li>
                <Link href="/offers" className="hover:text-white transition-colors">
                  Coupons & Local Offers
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-slate-400 flex items-center gap-1 text-xs pt-2">
                  <ShieldCheck className="w-3 h-3" /> Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & NAP */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-400" />
              Store Location
            </h3>

            <div className="text-xs text-slate-300 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block text-sm">Swarali Prints</strong>
                  Shop No. 1, Opp. New Sadguru Hotel,<br />
                  Trimurti Chowk, Cidco, Shivshakti Nagar,<br />
                  Nashik, Maharashtra 422008
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a href="tel:+919823123456" className="hover:text-white">
                  +91 98231 23456 / +91 94222 78910
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <a href="mailto:contact@swaraliprints.com" className="hover:text-white">
                  contact@swaraliprints.com
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Clock className="w-4 h-4 text-lime-400 flex-shrink-0 mt-0.5" />
                <div>
                  <div>Mon – Sat: 9:30 AM – 9:00 PM</div>
                  <div className="text-slate-400">Sun: 10:00 AM – 2:00 PM</div>
                </div>
              </div>

              <div className="pt-3">
                <a
                  href="https://maps.app.goo.gl/iRdzZ4XFGz7SHzf79"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-900/60 hover:bg-blue-800 border border-blue-700 text-blue-200 text-xs font-semibold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Get Directions on Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Hyperlocal Nashik Service Area Anchors */}
        <div className="py-6 border-b border-slate-800 text-xs text-slate-400">
          <div className="font-semibold text-slate-300 mb-2">
            Hyperlocal Printing Service Coverage in Nashik:
          </div>
          <p className="leading-relaxed">
            Serving nearby localities with fast store pickup and local delivery:
            <Link href="/printing-shop-cidco-nashik" className="text-pink-400 hover:underline mx-1">
              Trimurti Chowk
            </Link> •
            <span className="text-slate-300 mx-1">Cidco</span> •
            <span className="text-slate-300 mx-1">Shivshakti Nagar</span> •
            <span className="text-slate-300 mx-1">Pawan Nagar</span> •
            <span className="text-slate-300 mx-1">Lekha Nagar</span> •
            <span className="text-slate-300 mx-1">Govind Nagar</span> •
            <span className="text-slate-300 mx-1">Indira Nagar</span> •
            <span className="text-slate-300 mx-1">Untwadi</span> •
            <span className="text-slate-300 mx-1">Cidco Bus Stand</span> •
            <span className="text-slate-300 mx-1">Ambad MIDC</span> •
            <span className="text-slate-300 mx-1">Nashik City</span>
          </p>
        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Swarali Prints (स्वराली प्रिंट्स). All rights reserved. Your Ideas, Our Prints.
          </div>

          <div className="flex items-center gap-3">
            <span>Accepted Payments:</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              UPI (GPay, PhonePe, Paytm)
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Cash on Pickup
            </span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono">
              Cards / NetBanking
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
