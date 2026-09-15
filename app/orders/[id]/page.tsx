'use client';

import React, { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Printer,
  FileText,
  MessageCircle,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloatingButton from '@/components/WhatsAppFloatingButton';
import OrderTimeline from '@/components/OrderTimeline';
import ProofApprovalBox from '@/components/ProofApprovalModal';
import PrintInvoice from '@/components/PrintInvoice';
import { Order } from '@/lib/types';
import { getOrderById, updateOrderStatus } from '@/lib/storage';
import { buildWhatsAppOrderSummary, buildWhatsAppChatLink } from '@/lib/whatsapp';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const loadOrder = React.useCallback(() => {
    const found = getOrderById(id);
    if (found) {
      setOrder({ ...found });
    }
  }, [id]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
        <Navbar />
        <main className="flex-grow py-20 text-center space-y-4">
          <p className="text-slate-500">Order not found with reference: {id}</p>
          <Link
            href="/track-order"
            className="inline-block px-5 py-2.5 rounded-xl bg-pink-600 text-white font-bold text-xs shadow"
          >
            Back to Order Search
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const latestProof = order.proofs && order.proofs.length > 0 ? order.proofs[order.proofs.length - 1] : null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <Navbar />

      <main className="flex-grow py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumb & Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Link href="/" className="hover:text-pink-600">Home</Link>
                <span>/</span>
                <Link href="/track-order" className="hover:text-pink-600">Track Order</Link>
                <span>/</span>
                <span className="text-slate-900 font-mono font-semibold">{order.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Order <span className="text-pink-600 font-mono">{order.id}</span>
                </h1>
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-100 text-pink-700">
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="py-2.5 px-4 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <FileText className="w-4 h-4 text-blue-900" />
                <span>View Tax Invoice</span>
              </button>

              <a
                href={buildWhatsAppChatLink(`Hi Swarali Prints, I have a query about my order ${order.id}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* 10-Stage Progress Timeline */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Production & Fulfillment Progress
              </h2>
              <span className="text-xs text-slate-400">
                Ordered: {new Date(order.createdAt).toLocaleString('en-IN')}
              </span>
            </div>

            <OrderTimeline currentStatus={order.status} history={order.history} />
          </div>

          {/* Digital Proof Review Box (If pending/requested or proof exists) */}
          {latestProof && (
            <ProofApprovalBox
              orderId={order.id}
              proof={latestProof}
              onProofUpdated={loadOrder}
            />
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Items Table (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="p-4 sm:p-5 border-b border-slate-100 font-bold text-sm text-slate-900">
                  Ordered Print Items ({order.items.length})
                </div>

                <div className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <div key={item.id} className="p-4 sm:p-5 flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-bold text-slate-900 text-sm">{item.title}</div>

                        {item.customConfig && (
                          <div className="text-xs text-slate-500 space-y-0.5">
                            {item.customConfig.serviceType === 'flex-printing' && (
                              <p>Specs: {item.customConfig.widthFt}ft x {item.customConfig.heightFt}ft ({item.customConfig.material})</p>
                            )}
                            {item.customConfig.serviceType === 'document-printing' && (
                              <p>{item.customConfig.pageCount} Pages • {item.customConfig.colorMode} • {item.customConfig.binding}</p>
                            )}
                            {item.customConfig.finishing && item.customConfig.finishing.length > 0 && (
                              <p>Finishing: {item.customConfig.finishing.join(', ')}</p>
                            )}
                            {item.customConfig.uploadedFiles.length > 0 && (
                              <p className="text-blue-900 font-semibold text-[11px]">
                                File: {item.customConfig.uploadedFiles[0].name} ({(item.customConfig.uploadedFiles[0].size / 1024).toFixed(0)} KB)
                              </p>
                            )}
                          </div>
                        )}

                        {item.instructions && (
                          <p className="text-[11px] text-pink-700 italic">
                            Instructions: "{item.instructions}"
                          </p>
                        )}

                        <div className="text-xs text-slate-400">
                          Qty: <strong className="text-slate-700">{item.quantity}</strong> × ₹{item.unitPrice.toLocaleString()}
                        </div>
                      </div>

                      <div className="font-bold font-mono text-slate-900 text-sm">
                        ₹{item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Pricing Breakdown */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs text-xs">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                  Payment Summary
                </h3>

                <div className="flex justify-between text-slate-600">
                  <span>Items Subtotal:</span>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{order.subtotal.toLocaleString()}
                  </span>
                </div>

                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Discount:</span>
                    <span className="font-mono">-₹{order.discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-slate-600">
                  <span>Delivery / Pickup:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {order.fulfillmentCost > 0 ? `₹${order.fulfillmentCost}` : 'FREE'}
                  </span>
                </div>

                <div className="pt-2 border-t-2 border-slate-900 flex justify-between items-baseline text-sm font-black text-slate-900">
                  <span>Total Amount:</span>
                  <span className="font-mono text-lg text-pink-600">
                    ₹{order.totalAmount.toLocaleString()}
                  </span>
                </div>

                <div className="pt-2 flex justify-between items-center text-[11px]">
                  <span className="text-slate-400">Payment Status:</span>
                  <span className="font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>

              {/* Fulfillment & Customer Info */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs text-xs">
                <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2.5">
                  Fulfillment & Pickup
                </h3>

                <div>
                  <span className="text-slate-400 block">Method:</span>
                  <strong className="text-slate-800 capitalize">
                    {order.fulfillmentMethod.replace(/_/g, ' ')}
                  </strong>
                </div>

                {order.deliveryAddress ? (
                  <div>
                    <span className="text-slate-400 block">Delivery Address:</span>
                    <div className="text-slate-700 font-medium">
                      {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-slate-400 block">Store Pickup Location:</span>
                    <div className="text-slate-800 font-semibold">
                      Shop No. 1, Opp. New Sadguru Hotel, Trimurti Chowk, Cidco, Nashik
                    </div>
                  </div>
                )}

                <div>
                  <span className="text-slate-400 block">Customer Contact:</span>
                  <div className="text-slate-800 font-semibold">{order.customerName} ({order.customerPhone})</div>
                  {order.customerEmail && <div className="text-slate-500">{order.customerEmail}</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Modal for Printable Invoice */}
          {showInvoiceModal && (
            <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <PrintInvoice order={order} onClose={() => setShowInvoiceModal(false)} />
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
