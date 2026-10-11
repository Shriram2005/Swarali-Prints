import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import SwaraliLogo from './SwaraliLogo';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';
import { INITIAL_SETTINGS } from '@/lib/data';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    { name: 'Flex & Banner Printing', href: '/services/flex-printing' },
    { name: 'Visiting & Business Cards', href: '/services/visiting-card-printing' },
    { name: 'Document & Thesis Xerox', href: '/services/document-printing' },
    { name: 'Waterproof Vinyl Stickers', href: '/services/sticker-label-printing' },
    { name: 'Sunboard Posters & Frames', href: '/services/poster-printing' },
    { name: 'Brochures & Pamphlets', href: '/services/flyer-brochure-printing' },
  ];

  const quickLinks = [
    { name: 'Custom Print Calculator', href: '/custom-printing', highlight: true },
    { name: 'Request Bulk Quotation', href: '/request-quote' },
    { name: 'Track Order Status', href: '/track-order' },
    { name: 'Portfolio & Recent Work', href: '/portfolio' },
    { name: 'Shop Ready Products', href: '/products' },
    { name: 'Discounts & Offers', href: '/offers' },
    { name: 'Frequently Asked Questions', href: '/faq' },
  ];

  const localities = [
    { name: 'Trimurti Chowk', href: '/printing-shop-cidco-nashik' },
    { name: 'Cidco', href: '/printing-shop-cidco-nashik' },
    { name: 'Pawan Nagar', href: '/printing-shop-cidco-nashik' },
    { name: 'Govind Nagar', href: '/printing-shop-cidco-nashik' },
    { name: 'Indira Nagar', href: '/printing-shop-cidco-nashik' },
    { name: 'Untwadi', href: '/printing-shop-cidco-nashik' },
    { name: 'Lekha Nagar', href: '/printing-shop-cidco-nashik' },
    { name: 'Ambad MIDC', href: '/printing-shop-cidco-nashik' },
  ];

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        {/* Main Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-800/70">
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white px-3 py-1.5 rounded-xl inline-flex items-center shadow-xs">
              <SwaraliLogo size="md" withLink showTagline={true} />
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Your trusted local printing destination in Cidco, Nashik. Fast turnaround, eco-solvent color precision, and verified proof approval before printing.
            </p>

            {/* Quick Live Status & WhatsApp */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800/80 px-2.5 py-1.5 rounded-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Open Mon–Sat: 9:30 AM – 9 PM</span>
              </div>

              <a
                href={buildWhatsAppChatLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-800/50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          {/* Popular Services (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Printing Services
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {services.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="hover:text-pink-400 transition-colors inline-block"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  href="/services"
                  className="text-xs font-medium text-pink-400 hover:text-pink-300 inline-flex items-center gap-1"
                >
                  <span>View All Services</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Actions (2 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`transition-colors inline-block ${
                      item.highlight
                        ? 'text-pink-400 hover:text-pink-300 font-medium'
                        : 'hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Location & Direct Contact (3 cols) */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Store & Contact
            </h3>

            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-pink-500 shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed text-slate-300">
                  <strong className="text-white block font-medium">Swarali Prints</strong>
                  Shop No. 1, Opp. New Sadguru Hotel,<br />
                  Trimurti Chowk, Cidco, Nashik 422008
                </address>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <a
                  href="tel:+919823123456"
                  className="hover:text-white transition-colors"
                >
                  +91 98231 23456 / 94222 78910
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a
                  href="mailto:contact@swaraliprints.com"
                  className="hover:text-white transition-colors"
                >
                  contact@swaraliprints.com
                </a>
              </div>
            </div>

            <div className="pt-1">
              <a
                href={INITIAL_SETTINGS.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-pink-500" />
                <span>Open in Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Hyperlocal Service Coverage (Clean chip pills) */}
        <div className="py-5 border-b border-slate-800/70 flex flex-col md:flex-row md:items-center gap-3 text-xs">
          <span className="text-slate-400 font-medium shrink-0">
            Local Pickup & Delivery:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {localities.map((loc) => (
              <Link
                key={loc.name}
                href={loc.href}
                className="px-2.5 py-1 rounded-md bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
              >
                {loc.name}
              </Link>
            ))}
            <span className="text-slate-500 text-[11px] px-1.5">
              & surrounding Nashik areas
            </span>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Secondary Links */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p className="text-center sm:text-left">
            © {currentYear} Swarali Prints (स्वराली प्रिंट्स). All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/printing-shop-cidco-nashik"
              className="hover:text-slate-400 transition-colors"
            >
              Cidco Guide
            </Link>
            <span>•</span>
            <Link
              href="/contact"
              className="hover:text-slate-400 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
