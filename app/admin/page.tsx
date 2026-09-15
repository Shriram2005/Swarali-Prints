'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  ShoppingBag,
  Settings,
  Tag,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Eye,
  MessageCircle,
  Search,
  Filter,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SwaraliLogo from '@/components/SwaraliLogo';
import PrintInvoice from '@/components/PrintInvoice';
import { Order, OrderStatus, QuoteRequest, StoreSettings, ProofItem } from '@/lib/types';
import {
  getAllOrders,
  updateOrderStatus,
  addOrderProof,
  getAllQuoteRequests,
  updateQuoteStatus,
  getStoreSettings,
  saveStoreSettings,
} from '@/lib/storage';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '@/lib/data';
import { buildWhatsAppStatusNotification } from '@/lib/whatsapp';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'orders' | 'quotes' | 'products' | 'coupons' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [quotes, setQuotes] = useState<QuoteRequest[]>([]);
  const [settings, setSettings] = useState<StoreSettings>(getStoreSettings());

  // Search & Filters
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Selected Order for Modal Actions
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [proofModalOrder, setProofModalOrder] = useState<Order | null>(null);
  const [proofUrlInput, setProofUrlInput] = useState('');
  const [proofNoteInput, setProofNoteInput] = useState('');

  const refreshData = () => {
    setOrders(getAllOrders());
    setQuotes(getAllQuoteRequests());
    setSettings(getStoreSettings());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus.replace(/_/g, ' ')} by Admin`);
    refreshData();
  };

  const handleUploadProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofModalOrder || !proofUrlInput.trim()) return;

    addOrderProof(
      proofModalOrder.id,
      proofUrlInput.trim(),
      proofNoteInput.trim() || 'Sample digital layout prepared for your approval. Please verify text and dimensions.'
    );

    setProofModalOrder(null);
    setProofUrlInput('');
    setProofNoteInput('');
    refreshData();
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoreSettings(settings);
    alert('Store settings successfully updated!');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      o.customerPhone.includes(orderSearch);
    return matchesStatus && matchesSearch;
  });

  const allStatuses: OrderStatus[] = [
    'order_placed',
    'payment_confirmed',
    'file_verification',
    'proof_design',
    'customer_approval',
    'printing',
    'quality_check',
    'ready',
    'out_for_delivery',
    'completed',
    'cancelled',
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 bg-pink-600 rounded text-xs font-mono font-bold uppercase">
              Admin Portal
            </span>
            <span className="font-extrabold text-sm sm:text-base tracking-tight">
              Swarali Prints Manager
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition-colors"
            >
              View Live Store &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Navigation Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-6 overflow-x-auto text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Orders Management ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('quotes')}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'quotes'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Bulk RFQ Quotes ({quotes.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Products Catalog ({INITIAL_PRODUCTS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coupons')}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'coupons'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Promo Coupons ({INITIAL_COUPONS.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`py-3.5 border-b-2 flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'border-pink-600 text-pink-600'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store Settings & NAP</span>
            </button>
          </div>
        </div>
      </div>

      <main className="flex-grow py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* TAB 1: ORDERS MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search & Filter bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="relative w-full sm:w-80">
                <input
                  type="text"
                  placeholder="Search order ID, customer name, phone..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-medium focus:ring-2 focus:ring-pink-500 focus:outline-none"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  {allStatuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <th className="p-4">Order ID & Date</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items & Specs</th>
                      <th className="p-4">Amount</th>
                      <th className="p-4">Digital Proof</th>
                      <th className="p-4">Current Status (10-Stage)</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-slate-500">
                          No orders found matching the filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.map((ord) => {
                        const hasProof = ord.proofs && ord.proofs.length > 0;
                        const latestProof = hasProof ? ord.proofs![ord.proofs!.length - 1] : null;

                        return (
                          <tr key={ord.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-4 align-top">
                              <Link
                                href={`/orders/${ord.id}`}
                                target="_blank"
                                className="font-mono font-bold text-pink-600 hover:underline block"
                              >
                                {ord.id}
                              </Link>
                              <span className="text-[11px] text-slate-400">
                                {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                                  day: '2-digit',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </td>

                            <td className="p-4 align-top">
                              <div className="font-bold text-slate-900">{ord.customerName}</div>
                              <div className="text-slate-500 font-mono text-[11px]">{ord.customerPhone}</div>
                              <span className="inline-block mt-0.5 px-2 py-0.5 rounded bg-slate-100 text-[10px] capitalize text-slate-600">
                                {ord.fulfillmentMethod.replace(/_/g, ' ')}
                              </span>
                            </td>

                            <td className="p-4 align-top max-w-xs">
                              <div className="space-y-1">
                                {ord.items.map((item) => (
                                  <div key={item.id} className="text-[11px]">
                                    <strong className="text-slate-800">{item.title}</strong>
                                    <span className="text-slate-400"> (x{item.quantity})</span>
                                    {item.customConfig && (
                                      <div className="text-[10px] text-slate-500">
                                        {item.customConfig.serviceType === 'flex-printing' && (
                                          <span>{item.customConfig.widthFt}x{item.customConfig.heightFt}ft {item.customConfig.material}</span>
                                        )}
                                        {item.customConfig.serviceType === 'document-printing' && (
                                          <span>{item.customConfig.pageCount} pgs, {item.customConfig.binding}</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </td>

                            <td className="p-4 align-top">
                              <div className="font-mono font-bold text-slate-900">
                                ₹{ord.totalAmount.toLocaleString()}
                              </div>
                              <span
                                className={`inline-block text-[10px] font-bold uppercase px-2 py-0.5 rounded mt-0.5 ${
                                  ord.paymentStatus === 'paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {ord.paymentStatus}
                              </span>
                            </td>

                            {/* Digital Proof Cell */}
                            <td className="p-4 align-top">
                              {latestProof ? (
                                <div className="space-y-1">
                                  <span
                                    className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                      latestProof.status === 'approved'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : latestProof.status === 'changes_requested'
                                        ? 'bg-rose-100 text-rose-800'
                                        : 'bg-amber-100 text-amber-800'
                                    }`}
                                  >
                                    v{latestProof.version}: {latestProof.status.replace(/_/g, ' ')}
                                  </span>

                                  {latestProof.customerComments && (
                                    <p className="text-[10px] text-rose-700 font-medium italic line-clamp-2">
                                      Customer: "{latestProof.customerComments}"
                                    </p>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setProofModalOrder(ord);
                                      setProofUrlInput(latestProof.imageUrl);
                                    }}
                                    className="text-[11px] text-pink-600 hover:underline block font-bold"
                                  >
                                    Upload New Revision
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setProofModalOrder(ord);
                                    setProofUrlInput('https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&auto=format&fit=crop');
                                  }}
                                  className="px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-[10px] transition-colors"
                                >
                                  + Upload Proof
                                </button>
                              )}
                            </td>

                            {/* Status Selector */}
                            <td className="p-4 align-top">
                              <select
                                value={ord.status}
                                onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                                className="px-2.5 py-1.5 rounded-xl border border-slate-300 bg-white text-[11px] font-bold focus:ring-2 focus:ring-pink-500 focus:outline-none"
                              >
                                {allStatuses.map((st) => (
                                  <option key={st} value={st}>
                                    {st.replace(/_/g, ' ')}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="p-4 align-top text-right space-x-1.5 whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setSelectedOrderForInvoice(ord)}
                                title="Print GST Invoice"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                              >
                                <Printer className="w-3.5 h-3.5" />
                              </button>

                              <a
                                href={buildWhatsAppStatusNotification(ord.customerPhone, ord.id, ord.status, ord.customerName)}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Notify on WhatsApp"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 inline-block"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUOTE REQUESTS */}
        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-slate-100 font-bold text-sm text-slate-900">
                Bulk Inquiries & RFQs Received
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {quotes.length === 0 ? (
                  <div className="p-8 text-center text-slate-500">No quote requests recorded yet.</div>
                ) : (
                  quotes.map((q) => (
                    <div key={q.id} className="p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-pink-600">{q.id}</span>
                          <span className="font-bold text-slate-900">{q.name || q.customerName}</span>
                          {q.company && <span className="text-slate-400">({q.company})</span>}
                          <span className="text-slate-500 font-mono">📱 {q.phone}</span>
                        </div>
                        <div className="text-slate-700 font-semibold">
                          Service: {q.serviceType || q.serviceNeeded} | Qty: {q.quantity || q.approxQuantity} {q.deadline ? `| Deadline: ${q.deadline}` : ''}
                        </div>
                        {q.description && (
                          <p className="text-slate-500 text-[11px] max-w-2xl italic">
                            "{q.description}"
                          </p>
                        )}
                        <span className="text-[10px] text-slate-400 block">
                          Submitted: {new Date(q.createdAt).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={q.status}
                          onChange={(e) => {
                            updateQuoteStatus(q.id, e.target.value as any);
                            refreshData();
                          }}
                          className="px-2.5 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="quoted">Quoted</option>
                          <option value="converted">Converted</option>
                          <option value="rejected">Rejected</option>
                        </select>

                        <a
                          href={`https://wa.me/91${q.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${q.name || q.customerName}, Greetings from Swarali Prints Cidco Nashik regarding your quote request for ${q.serviceType || q.serviceNeeded}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2 px-3 bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp Quote</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between font-bold text-sm text-slate-900">
                <span>Print Products Catalog ({INITIAL_PRODUCTS.length})</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                {INITIAL_PRODUCTS.map((prod) => (
                  <div key={prod.id} className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-bold text-slate-900">{prod.name}</div>
                        <div className="text-slate-400 text-[11px] capitalize">{prod.category}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="font-mono font-bold text-slate-900">
                        ₹{prod.salePrice || prod.basePrice}
                      </div>
                      <Link
                        href={`/products/${prod.slug}`}
                        target="_blank"
                        className="text-pink-600 hover:underline font-bold"
                      >
                        View &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Active Promo Codes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {INITIAL_COUPONS.map((cpn) => (
                  <div key={cpn.code} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-1 text-xs">
                    <div className="font-mono font-black text-pink-600 text-sm">{cpn.code}</div>
                    <div className="font-semibold text-slate-800">{cpn.description}</div>
                    <div className="text-slate-500 text-[11px]">
                      Value: {cpn.discountValue}{cpn.discountType === 'percentage' ? '%' : ' INR'} off (Min. ₹{cpn.minOrderAmount || cpn.minOrderValue})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE SETTINGS & NAP */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Store Information & NAP Configuration
            </h2>

            <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Business English Name</label>
                  <input
                    type="text"
                    value={settings.businessName}
                    onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Business Marathi Name</label>
                  <input
                    type="text"
                    value={settings.businessNameMarathi}
                    onChange={(e) => setSettings({ ...settings, businessNameMarathi: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Primary Counter Phone</label>
                  <input
                    type="text"
                    value={settings.phone1}
                    onChange={(e) => setSettings({ ...settings, phone1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">WhatsApp Dispatch Phone</label>
                  <input
                    type="text"
                    value={settings.whatsapp || settings.whatsappNumber || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        whatsapp: e.target.value,
                        whatsappNumber: e.target.value,
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Address Line 1 (Shop & Landmark)</label>
                  <input
                    type="text"
                    value={settings.addressLine1}
                    onChange={(e) => setSettings({ ...settings, addressLine1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="font-bold text-slate-700">Address Line 2 (Chowk & Locality)</label>
                  <input
                    type="text"
                    value={settings.addressLine2}
                    onChange={(e) => setSettings({ ...settings, addressLine2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">GSTIN Tax Number</label>
                  <input
                    type="text"
                    value={settings.gstNumber}
                    onChange={(e) => setSettings({ ...settings, gstNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">UPI Payment VPA</label>
                  <input
                    type="text"
                    value={settings.upiId}
                    onChange={(e) => setSettings({ ...settings, upiId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition-colors"
              >
                Save Store NAP Settings
              </button>
            </form>
          </div>
        )}

        {/* MODAL: UPLOAD DIGITAL PROOF */}
        {proofModalOrder && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="font-bold text-base text-slate-900">
                  Upload Proof for Order <span className="font-mono text-pink-600">{proofModalOrder.id}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setProofModalOrder(null)}
                  className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleUploadProof} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Proof Image URL or Mock CDN:</label>
                  <input
                    type="url"
                    required
                    value={proofUrlInput}
                    onChange={(e) => setProofUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Note for Customer:</label>
                  <textarea
                    rows={3}
                    value={proofNoteInput}
                    onChange={(e) => setProofNoteInput(e.target.value)}
                    placeholder="e.g. Please examine the spelling, phone number, and margins before approving for printing."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setProofModalOrder(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold shadow"
                  >
                    Publish Proof to Customer
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: PRINT INVOICE */}
        {selectedOrderForInvoice && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <PrintInvoice
                order={selectedOrderForInvoice}
                onClose={() => setSelectedOrderForInvoice(null)}
              />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
