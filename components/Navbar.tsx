'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Phone,
  MessageCircle,
  MapPin,
  ShoppingBag,
  Menu,
  X,
  Printer,
  Sparkles,
  Search,
  Clock,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import SwaraliLogo from './SwaraliLogo';
import { getCart } from '@/lib/storage';
import { buildWhatsAppChatLink } from '@/lib/whatsapp';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      const count = cart.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
    };

    updateCount();
    window.addEventListener('cart_updated', updateCount);
    return () => window.removeEventListener('cart_updated', updateCount);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services', hasDropdown: true },
    { name: 'Shop Products', href: '/products' },
    { name: 'Custom Printing', href: '/custom-printing', highlight: true },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Offers', href: '/offers' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'Contact', href: '/contact' },
  ];

  const quickServices = [
    { name: 'Flex & Banner Printing', href: '/services/flex-printing', desc: 'From ₹12/sq.ft' },
    { name: 'Visiting Cards', href: '/services/visiting-card-printing', desc: 'Matte, Gloss, Velvet' },
    { name: 'Document & PDF Printing', href: '/services/document-printing', desc: 'Laser Xerox & Thesis' },
    { name: 'Sticker & Label Printing', href: '/services/sticker-label-printing', desc: 'Die-cut waterproof' },
    { name: 'Posters & Photo Frames', href: '/services/poster-printing', desc: 'High-res sunboard' },
    { name: 'Pamphlets & Brochures', href: '/services/flyer-brochure-printing', desc: 'Bulk marketing' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm transition-all">
      {/* Hyperlocal Top Bar */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-pink-500" />
              <span>Opp. New Sadguru Hotel, Trimurti Chowk, Cidco, Nashik</span>
            </span>
            <span className="hidden md:flex items-center gap-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-lime-400" />
              <span>Open Today: 9:30 AM – 9:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <a
              href="tel:+919823123456"
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-blue-400" />
              <span className="font-medium">+91 98231 23456</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={buildWhatsAppChatLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-lime-400 hover:text-lime-300 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Us</span>
            </a>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1 text-xs text-pink-400 hover:text-pink-300 font-medium"
            >
              <ShieldCheck className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <SwaraliLogo size="md" withLink showTagline={true} />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                        isActive
                          ? 'text-pink-600 bg-pink-50'
                          : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    </Link>

                    {/* Services Dropdown */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-100 p-2 z-50">
                        <div className="px-3 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Popular Printing Services
                        </div>
                        <div className="grid gap-1">
                          {quickServices.map((qs) => (
                            <Link
                              key={qs.name}
                              href={qs.href}
                              className="px-3 py-2 rounded-lg hover:bg-pink-50 text-left group transition-colors flex items-center justify-between"
                            >
                              <div>
                                <div className="text-sm font-medium text-slate-900 group-hover:text-pink-600">
                                  {qs.name}
                                </div>
                                <div className="text-xs text-slate-500">{qs.desc}</div>
                              </div>
                            </Link>
                          ))}
                          <div className="pt-2 border-t border-slate-100 mt-1">
                            <Link
                              href="/services"
                              className="block px-3 py-1.5 text-xs text-center font-bold text-blue-800 hover:underline"
                            >
                              View All 12+ Printing Services &rarr;
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              if (link.highlight) {
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-pink-600 text-white shadow-sm hover:shadow hover:brightness-105 transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{link.name}</span>
                    <span className="inline-block w-2 h-2 rounded-full bg-lime-400 animate-pulse" />
                  </Link>
                );
              }

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                    isActive
                      ? 'text-pink-600 bg-pink-50'
                      : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3">
            {/* Quick Quote Button */}
            <Link
              href="/request-quote"
              className="hidden md:inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-xs font-bold border border-blue-800 text-blue-900 hover:bg-blue-50 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-600" />
              <span>Get a Quote</span>
            </Link>

            {/* Cart Icon with Live Count */}
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full text-slate-700 hover:text-pink-600 hover:bg-pink-50 transition-colors"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg max-h-[80vh] overflow-y-auto">
          {/* Custom Printing prominent button */}
          <Link
            href="/custom-printing"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-pink-600 text-white font-bold text-base shadow-sm"
          >
            <Printer className="w-5 h-5" />
            <span>Start Custom Printing Order</span>
          </Link>

          <div className="pt-2 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  pathname === link.href
                    ? 'bg-pink-50 text-pink-600 font-bold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            <Link
              href="/request-quote"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg border border-blue-800 text-blue-900 font-semibold text-sm"
            >
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span>Request Custom Price Quote</span>
            </Link>
            <Link
              href="/printing-shop-cidco-nashik"
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-pink-600" />
              <span>Cidco Nashik Store Guide & Directions</span>
            </Link>
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full py-2 px-4 rounded-lg border border-dashed border-slate-300 text-slate-600 text-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Business Admin Dashboard</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
