'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, PackageCheck, Phone, ArrowRight, Clock, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { getOrderById, getAllOrders } from '@/lib/storage';

export default function TrackOrderPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchTerm.trim();
    if (!clean) return;

    // Check if it matches an order ID (case insensitive, trimmed)
    const foundById = getOrderById(clean);
    if (foundById) {
      router.push(`/orders/${foundById.id}`);
      return;
    }

    // Check if it matches a phone number (strip non-digits for comparison)
    const all = getAllOrders();
    const cleanDigits = clean.replace(/[^0-9]/g, '');
    const foundByPhone = all.find((o) => {
      const orderDigits = o.customerPhone.replace(/[^0-9]/g, '');
      if (cleanDigits.length >= 6) {
        return orderDigits.includes(cleanDigits) || cleanDigits.includes(orderDigits);
      }
      return o.customerPhone.toLowerCase().includes(clean.toLowerCase());
    });
    if (foundByPhone) {
      router.push(`/orders/${foundByPhone.id}`);
      return;
    }

    setErrorMessage(`No order found matching "${clean}". Please check your order ID (e.g. SP-2026-0001) or mobile number.`);
  };

  const [sampleOrders, setSampleOrders] = useState<any[]>([]);

  React.useEffect(() => {
    setSampleOrders(getAllOrders().slice(0, 4));
    const onOrdersUpdate = () => setSampleOrders(getAllOrders().slice(0, 4));
    window.addEventListener('orders_updated', onOrdersUpdate);
    return () => window.removeEventListener('orders_updated', onOrdersUpdate);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-bold uppercase tracking-wider">
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Real-Time Job Tracking</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Track Your Print Order
            </h1>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Enter your Order Reference Number or registered Mobile Number to check real-time printing status and review proof.
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Order ID or Mobile Number:
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. SP-2026-0001 or 9823123456"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                  <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
                </div>
              </div>

              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>Track Order Status</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Live status updated in 10 stages
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-pink-600" />
                Trimurti Chowk Cidco
              </span>
            </div>
          </div>

          {/* Quick Demo Orders */}
          {sampleOrders.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">
                Or inspect recent sample orders in demo mode:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sampleOrders.map((ord) => (
                  <Link
                    key={ord.id}
                    href={`/orders/${ord.id}`}
                    className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-pink-300 hover:shadow-sm transition-all flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-mono font-bold text-pink-600">{ord.id}</div>
                      <div className="text-slate-700 font-semibold">{ord.customerName}</div>
                      <div className="text-slate-400 text-[11px] capitalize mt-0.5">
                        Status: {ord.status.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
