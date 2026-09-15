'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Tag,
  ShieldCheck,
  MapPin,
  ArrowLeft,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import { CartItem, Coupon } from '@/lib/types';
import {
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  applyCoupon,
  getActiveCoupon,
  removeCoupon,
} from '@/lib/storage';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const refreshCart = () => {
    setCartItems(getCart());
    setAppliedCoupon(getActiveCoupon());
  };

  useEffect(() => {
    refreshCart();
    window.addEventListener('cart_updated', refreshCart);
    return () => window.removeEventListener('cart_updated', refreshCart);
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    const res = applyCoupon(couponCode, subtotal);
    if (res.success && res.coupon) {
      setAppliedCoupon(res.coupon);
      setCouponMessage({ text: res.message, isError: false });
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setAppliedCoupon(null);
    setCouponMessage(null);
    setCouponCode('');
  };

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
              <span className="text-slate-900 font-semibold">Shopping Cart</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Review Your Cart
            </h1>
          </div>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-pink-50 text-pink-600 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Your printing cart is empty</h2>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Configure custom flex banners, visiting cards, or browse our standard shop products to get started.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/custom-printing"
                  className="py-3 px-6 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow"
                >
                  Custom Printing Studio
                </Link>
                <Link
                  href="/products"
                  className="py-3 px-5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs"
                >
                  Browse Shop
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Cart Line Items (7 or 8 cols) */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>{cartItems.length} Item(s) in Cart</span>
                    <button
                      type="button"
                      onClick={() => clearCart()}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Clear All
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
                          />
                          <div className="space-y-1">
                            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                              {item.title}
                            </h3>

                            {item.customConfig && (
                              <div className="text-xs text-slate-500 space-y-0.5">
                                {item.customConfig.serviceType === 'flex-printing' && (
                                  <p>Size: {item.customConfig.widthFt}ft x {item.customConfig.heightFt}ft ({item.customConfig.material})</p>
                                )}
                                {item.customConfig.serviceType === 'document-printing' && (
                                  <p>{item.customConfig.pageCount} Pages • {item.customConfig.copies} Copies • {item.customConfig.binding}</p>
                                )}
                                {item.customConfig.uploadedFiles.length > 0 && (
                                  <p className="text-emerald-700 font-medium">
                                    ✓ File attached: {item.customConfig.uploadedFiles[0].name}
                                  </p>
                                )}
                              </div>
                            )}

                            {item.instructions && (
                              <p className="text-[11px] text-pink-700 italic">
                                Note: "{item.instructions}"
                              </p>
                            )}

                            <div className="text-xs font-semibold text-slate-700 pt-1">
                              Rate: ₹{item.unitPrice.toLocaleString()} each
                            </div>
                          </div>
                        </div>

                        {/* Right side: Quantity & Subtotal & Delete */}
                        <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                          {/* Quantity Controls */}
                          <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-0.5">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-base font-black text-slate-900">
                              ₹{item.totalPrice.toLocaleString()}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Continue Shopping Link */}
                <div className="flex items-center justify-between text-xs text-slate-500 pt-2">
                  <Link href="/products" className="flex items-center gap-1 hover:text-pink-600 font-semibold">
                    <ArrowLeft className="w-4 h-4" /> Continue Shopping
                  </Link>
                  <Link href="/custom-printing" className="flex items-center gap-1 text-pink-600 hover:underline font-bold">
                    + Add Another Custom Print Job
                  </Link>
                </div>
              </div>

              {/* Order Summary Right (4 or 5 cols) */}
              <div className="lg:col-span-5 xl:col-span-4 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
                    Order Summary
                  </h3>

                  {/* Coupon Form */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Have a Coupon Code?
                    </label>

                    {appliedCoupon ? (
                      <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-emerald-600" />
                          <span className="font-bold">{appliedCoupon.code}</span>
                          <span>(-₹{discount})</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          className="text-xs text-rose-600 font-bold hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleApplyCoupon} className="flex gap-2">
                        <input
                          type="text"
                          placeholder="e.g. WELCOME10 or CIDCOFREE"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs uppercase font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                        <button
                          type="submit"
                          className="py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
                        >
                          Apply
                        </button>
                      </form>
                    )}

                    {couponMessage && (
                      <p className={`text-xs ${couponMessage.isError ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {couponMessage.text}
                      </p>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Try coupon <strong className="text-slate-600">WELCOME10</strong> for 10% off or <strong className="text-slate-600">CIDCOFREE</strong> for local discount.
                    </div>
                  </div>

                  {/* Itemized Calculation */}
                  <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                    <div className="flex justify-between text-slate-600">
                      <span>Items Subtotal:</span>
                      <span className="font-bold font-mono text-slate-900">
                        ₹{subtotal.toLocaleString()}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Coupon Discount:</span>
                        <span className="font-mono">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-slate-600">
                      <span>Store Pickup (Trimurti Chowk):</span>
                      <span className="font-bold text-emerald-600">FREE</span>
                    </div>

                    <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline">
                      <span className="text-sm font-black text-slate-900">Estimated Total:</span>
                      <span className="text-2xl font-black text-slate-900 font-mono">
                        ₹{grandTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Checkout CTA */}
                  <Link
                    href="/checkout"
                    className="w-full py-3.5 px-4 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 group transition-all"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="space-y-1.5 text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Digital proof sent for review before printing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Instant UPI QR code or Pay on Store Pickup</span>
                    </div>
                  </div>
                </div>
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
