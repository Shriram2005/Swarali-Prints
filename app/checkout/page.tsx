'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  QrCode,
  Store,
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Clock,
  ArrowRight,
  MessageCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { CartItem, Coupon, Order, FulfillmentMethod, PaymentMethod, PaymentStatus } from '@/lib/types';
import { getCart, getActiveCoupon, saveOrder, clearCart, getStoreSettings } from '@/lib/storage';
import { buildWhatsAppOrderSummary } from '@/lib/whatsapp';

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Delivery states
  const [fulfillmentMethod, setFulfillmentMethod] = useState<FulfillmentMethod>('store_pickup');
  const [street, setStreet] = useState('');
  const [area, setArea] = useState('Trimurti Chowk, Cidco');
  const [city, setCity] = useState('Nashik');
  const [pincode, setPincode] = useState('422008');
  const [landmark, setLandmark] = useState('');

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi_qr');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const items = getCart();
    setCartItems(items);
    setCoupon(getActiveCoupon());
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  let discount = 0;
  if (coupon) {
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
    } else {
      discount = coupon.discountValue;
    }
  }

  let fulfillmentCost = 0;
  if (fulfillmentMethod === 'local_delivery_cidco') {
    fulfillmentCost = subtotal > 1000 ? 0 : 50;
  } else if (fulfillmentMethod === 'courier_nashik') {
    fulfillmentCost = 80;
  }

  const grandTotal = Math.max(0, subtotal - discount + fulfillmentCost);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert('Please provide your name and phone number.');
      return;
    }

    if (fulfillmentMethod !== 'store_pickup' && !street.trim()) {
      alert('Please enter your delivery street address.');
      return;
    }

    setIsProcessing(true);

    const orderId = `SP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    let paymentStatus: PaymentStatus = 'pending';
    if (paymentMethod === 'upi_qr' || paymentMethod === 'card_online') {
      paymentStatus = 'paid';
    } else if (paymentMethod === 'cash_on_pickup') {
      paymentStatus = 'pending';
    }

    const newOrder: Order = {
      id: orderId,
      customerName: name,
      customerPhone: phone,
      customerEmail: email || `${phone}@customer.swaraliprints.local`,
      customerGst: gstNumber || undefined,
      items: cartItems,
      subtotal,
      discount,
      fulfillmentCost,
      totalAmount: grandTotal,
      couponCode: coupon?.code,
      status: 'order_placed',
      paymentMethod,
      paymentStatus,
      fulfillmentMethod,
      deliveryAddress:
        fulfillmentMethod !== 'store_pickup'
          ? {
              street,
              area,
              city,
              pincode,
              landmark,
            }
          : undefined,
      specialInstructions,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: 'order_placed',
          timestamp: new Date().toISOString(),
          note: `Order received via website. Fulfillment: ${fulfillmentMethod.replace(/_/g, ' ')}`,
        },
      ],
      history: [
        {
          status: 'order_placed',
          timestamp: new Date().toISOString(),
          note: `Order received via website. Fulfillment: ${fulfillmentMethod.replace(/_/g, ' ')}`,
        },
      ],
      // For demonstration of proof workflow, attach a mock proof if custom items exist
      proofs: cartItems.some((i) => i.customConfig)
        ? [
            {
              id: `prf-${Date.now()}`,
              version: 1,
              imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&auto=format&fit=crop',
              uploadedAt: new Date().toISOString(),
              status: 'pending',
              notes: 'Draft print layout prepared by Swarali Prints design team. Please review text, dimensions, and margin alignment before approval.',
            },
          ]
        : [],
    };

    saveOrder(newOrder);
    clearCart();
    setCompletedOrder(newOrder);
    setIsProcessing(false);
  };

  if (completedOrder) {
    const waLink = buildWhatsAppOrderSummary(completedOrder);

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar />

        <main className="flex-grow py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center space-y-6 shadow-sm">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  Order Successfully Placed
                </span>
                <h1 className="text-3xl font-black text-slate-900 mt-3">
                  Thank You, {completedOrder.customerName}!
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Your order has been recorded at Swarali Prints shop.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                  <span className="text-xs text-slate-400 font-bold uppercase">Order Reference:</span>
                  <span className="text-lg font-black text-pink-600 font-mono">
                    {completedOrder.id}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Total Amount:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{completedOrder.totalAmount.toLocaleString()} ({completedOrder.paymentStatus})
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Fulfillment:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {completedOrder.fulfillmentMethod.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="flex justify-between text-xs text-slate-600">
                  <span>Store Pickup Address:</span>
                  <span className="text-slate-800 font-medium">
                    Shop No. 1, Opp. New Sadguru Hotel, Trimurti Chowk, Cidco
                  </span>
                </div>
              </div>

              {/* Instant WhatsApp Dispatch & Tracking Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Order Details to WhatsApp</span>
                </a>

                <Link
                  href={`/orders/${completedOrder.id}`}
                  className="flex-1 py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2"
                >
                  <span>Track Status & Review Proof &rarr;</span>
                </Link>
              </div>

              <div className="text-xs text-slate-400 pt-2">
                Questions? Call our Trimurti Chowk counter directly at{' '}
                <a href="tel:+919823123456" className="text-slate-700 font-bold underline">
                  +91 98231 23456
                </a>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar />
        <main className="flex-grow py-16 text-center">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block text-pink-600 font-bold underline text-sm">
            Browse Printing Products
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Link href="/" className="hover:text-pink-600">Home</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-pink-600">Cart</Link>
              <span>/</span>
              <span className="text-slate-900 font-semibold">Checkout</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Checkout & Delivery Details
            </h1>
          </div>

          <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Customer Contact */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  1. Contact Information
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Patil"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Mobile / WhatsApp No. *</label>
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
                    <label className="block text-xs font-bold text-slate-700">Email Address (Optional)</label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">GST Number (For B2B Tax Invoice)</label>
                    <input
                      type="text"
                      placeholder="e.g. 27ABCDE1234F1Z5"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs uppercase font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Fulfillment Method Selection */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  2. Choose Fulfillment Method
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('store_pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      fulfillmentMethod === 'store_pickup'
                        ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Store className={`w-5 h-5 mb-2 ${fulfillmentMethod === 'store_pickup' ? 'text-pink-600' : 'text-slate-400'}`} />
                    <div className="font-bold text-xs text-slate-900">Store Pickup</div>
                    <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">FREE</div>
                    <div className="text-[10px] text-slate-400 mt-1">Trimurti Chowk Cidco</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('local_delivery_cidco')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      fulfillmentMethod === 'local_delivery_cidco'
                        ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Truck className={`w-5 h-5 mb-2 ${fulfillmentMethod === 'local_delivery_cidco' ? 'text-pink-600' : 'text-slate-400'}`} />
                    <div className="font-bold text-xs text-slate-900">Local Cidco Delivery</div>
                    <div className="text-[11px] text-slate-700 font-semibold mt-0.5">
                      {subtotal > 1000 ? 'FREE (Above ₹1k)' : '₹50'}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">Same/Next Day</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentMethod('courier_nashik')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      fulfillmentMethod === 'courier_nashik'
                        ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <Truck className={`w-5 h-5 mb-2 ${fulfillmentMethod === 'courier_nashik' ? 'text-pink-600' : 'text-slate-400'}`} />
                    <div className="font-bold text-xs text-slate-900">Nashik Courier</div>
                    <div className="text-[11px] text-slate-700 font-semibold mt-0.5">₹80</div>
                    <div className="text-[10px] text-slate-400 mt-1">Direct to doorstep</div>
                  </button>
                </div>

                {fulfillmentMethod === 'store_pickup' ? (
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="font-bold text-slate-800 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-pink-600" />
                      <span>Pickup Counter Location:</span>
                    </div>
                    <p>Shop No. 1, Opposite New Sadguru Hotel, Trimurti Chowk, Cidco, Nashik.</p>
                    <p className="text-[11px] text-slate-500">We will message you on WhatsApp as soon as your job is printed and trimmed.</p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Street Address / Flat / Building *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Flat 302, Sai Residency, Near Shivaji Chowk"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Area / Locality</label>
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => setArea(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">City</label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-xs font-bold text-slate-700">Pincode</label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-pink-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">Landmark (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. Behind Kaka Halwai / Near City Center Mall"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Methods */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                  3. Select Payment Option
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi_qr')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'upi_qr'
                        ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <QrCode className="w-5 h-5 text-pink-600" />
                      <span className="font-bold text-xs text-slate-900">Scan UPI QR Code</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cash_on_pickup')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'cash_on_pickup'
                        ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Store className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-xs text-slate-900">Pay on Store Pickup</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Cash or UPI at Trimurti Chowk counter</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card_online')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'card_online'
                        ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-xs text-slate-900">Cards / NetBanking</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Debit / Credit Cards & NetBanking</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pay_after_quote')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      paymentMethod === 'pay_after_quote'
                        ? 'border-pink-600 bg-pink-50/50 ring-2 ring-pink-500/20 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-5 h-5 text-amber-600" />
                      <span className="font-bold text-xs text-slate-900">Pay After Proof OK</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Inspect digital proof first, then pay</p>
                  </button>
                </div>

                {/* Simulated UPI Scan Box */}
                {paymentMethod === 'upi_qr' && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                    <div className="bg-white p-3 rounded-xl border border-slate-200 text-center flex-shrink-0">
                      <div className="w-28 h-28 bg-slate-900 rounded-lg flex flex-col items-center justify-center text-white p-2">
                        <QrCode className="w-12 h-12 mb-1" />
                        <span className="text-[9px] font-mono">UPI: swarali@okhdfc</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-bold block mt-1">
                        Swarali Prints
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="font-bold text-slate-900">Instant UPI Payment Details:</div>
                      <p>VPA: <code className="font-mono text-pink-600 font-bold">swaraliprints@upi</code></p>
                      <p>Amount to Pay: <strong className="text-slate-900 font-mono">₹{grandTotal.toLocaleString()}</strong></p>
                      <p className="text-[11px] text-slate-400">
                        Scan with GPay, PhonePe, or Paytm. Your payment will be verified instantly.
                      </p>
                    </div>
                  </div>
                )}

                {/* Additional Notes */}
                <div className="space-y-1 pt-2">
                  <label className="block text-xs font-bold text-slate-700">Special Instructions / Urgent Delivery Note</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Need this urgently by 5 PM today for college seminar, please trim extra 0.5 inch border."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Right Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                  Order Items ({cartItems.length})
                </h3>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="pr-2">
                        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="text-slate-400 text-[11px]">Qty: {item.quantity}</div>
                      </div>
                      <div className="font-mono font-bold text-slate-900">
                        ₹{item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Discount:</span>
                      <span className="font-mono">-₹{discount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span>Fulfillment ({fulfillmentMethod.replace(/_/g, ' ')}):</span>
                    <span className="font-mono font-semibold">
                      {fulfillmentCost > 0 ? `₹${fulfillmentCost}` : 'FREE'}
                    </span>
                  </div>

                  <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                    <span className="text-sm font-black text-slate-900">Total Payable:</span>
                    <span className="text-2xl font-black text-slate-900 font-mono">
                      ₹{grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-4 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                >
                  <ShieldCheck className="w-5 h-5" />
                  <span>{isProcessing ? 'Processing Order...' : 'Confirm & Place Order'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-[11px] text-center text-slate-400">
                  By placing an order you confirm your digital proof review requirement.
                </p>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
}
