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
  Clock,
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
    { name: 'Custom Printing', href: '/custom-printing' },
    { name: 'Portfolio', href: '/portfolio' },
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
      <div className="bg-slate-900 text-slate-200 py-1.5 px-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 text-[11px] sm:text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <a
              href="https://maps.app.goo.gl/mkEikdDKM32mBLQy9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors min-w-0"
              title="Open Swarali Prints location on Google Maps: Shop No. 1, Opp. New Sadguru Hotel, Trimurti Chowk, Cidco, Nashik"
            >
              <MapPin className="w-3.5 h-3.5 text-pink-500 shrink-0" />
              <span className="truncate">
                <span className="sm:hidden font-medium">Trimurti Chowk, Cidco</span>
                <span className="hidden sm:inline md:hidden">Trimurti Chowk, Cidco, Nashik</span>
                <span className="hidden md:inline">Opp. New Sadguru Hotel, Trimurti Chowk, Cidco, Nashik</span>
              </span>
            </a>
            <span className="hidden md:flex items-center gap-1 text-slate-400 shrink-0">
              <Clock className="w-3.5 h-3.5 text-lime-400" />
              <span>Open Today: 9:30 AM – 9:00 PM</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="tel:+919823123456"
              className="flex items-center gap-1 hover:text-white transition-colors"
              title="Call Swarali Prints at +91 98231 23456"
            >
              <Phone className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="font-medium hidden sm:inline">+91 98231 23456</span>
              <span className="font-medium sm:hidden">Call</span>
            </a>
            <span className="text-slate-700">|</span>
            <a
              href={buildWhatsAppChatLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-lime-400 hover:text-lime-300 font-semibold"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">WhatsApp Us</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex-shrink-0 flex items-center">
            <SwaraliLogo size="sm" withLink showTagline={true} />
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
          <div className="space-y-1">
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

          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <span className="font-medium text-slate-800">
                  Shop No. 1, Opp. New Sadguru Hotel, Trimurti Chowk, Cidco, Nashik
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-lime-600 shrink-0" />
                <span>Open Today: 9:30 AM – 9:00 PM</span>
              </div>
              <div className="flex items-center gap-3 pt-1 border-t border-slate-200/60 font-medium">
                <a
                  href="tel:+919823123456"
                  className="flex items-center gap-1.5 text-blue-600 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+91 98231 23456</span>
                </a>
                <span className="text-slate-300">|</span>
                <a
                  href={buildWhatsAppChatLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-600 hover:underline"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <Link
              href="/printing-shop-cidco-nashik"
              className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors shadow-sm"
            >
              <MapPin className="w-3.5 h-3.5 text-pink-400" />
              <span>Cidco Nashik Store Guide & Directions</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
