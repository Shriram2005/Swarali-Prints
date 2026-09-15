'use client';

import React from 'react';
import {
  CheckCircle,
  Clock,
  FileCheck,
  Palette,
  Eye,
  Printer,
  Sparkles,
  PackageCheck,
  Truck,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { OrderStatus } from '@/lib/types';

interface OrderTimelineProps {
  currentStatus: OrderStatus;
  history?: { status: OrderStatus; timestamp: string; note?: string }[];
}

const STAGES: { key: OrderStatus; label: string; icon: any; desc: string }[] = [
  { key: 'order_placed', label: 'Order Placed', icon: Clock, desc: 'Received online' },
  { key: 'payment_confirmed', label: 'Payment', icon: CheckCircle, desc: 'Verified' },
  { key: 'file_verification', label: 'File Check', icon: FileCheck, desc: 'DPI & bleed checked' },
  { key: 'proof_design', label: 'Proof Design', icon: Palette, desc: 'Sample prepared' },
  { key: 'customer_approval', label: 'Customer Approval', icon: Eye, desc: 'Awaiting your OK' },
  { key: 'printing', label: 'Printing', icon: Printer, desc: 'High-speed press' },
  { key: 'quality_check', label: 'Quality Check', icon: Sparkles, desc: 'Color & cut audit' },
  { key: 'ready', label: 'Ready', icon: PackageCheck, desc: 'Ready at shop' },
  { key: 'out_for_delivery', label: 'Delivery/Pickup', icon: Truck, desc: 'Dispatched / Pickup' },
  { key: 'completed', label: 'Completed', icon: CheckCircle2, desc: 'Delivered' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ currentStatus, history = [] }) => {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStatus);
  const isCancelled = currentStatus === 'cancelled';

  if (isCancelled) {
    return (
      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3 text-rose-800">
        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
        <div>
          <div className="font-bold text-sm">Order Cancelled</div>
          <p className="text-xs text-rose-600">This order has been cancelled or refunded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Visual Stepper */}
      <div className="relative">
        {/* Progress Bar Background */}
        <div className="hidden md:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
          <div
            className="h-full bg-pink-600 transition-all duration-500"
            style={{
              width: `${(Math.max(0, currentIndex) / (STAGES.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3 relative z-10">
          {STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const isPending = idx > currentIndex;

            return (
              <div
                key={stage.key}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all ${
                  isCurrent
                    ? 'bg-pink-50 border border-pink-300 ring-2 ring-pink-500/20'
                    : 'bg-transparent'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-2 transition-all ${
                    isPassed
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurrent
                      ? 'bg-pink-600 text-white shadow-md animate-pulse'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  {isPassed ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>

                <div
                  className={`text-[11px] leading-tight font-bold ${
                    isCurrent
                      ? 'text-pink-600'
                      : isPassed
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {stage.label}
                </div>

                <div className="text-[10px] text-slate-400 mt-0.5 hidden sm:block">
                  {stage.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Log Timeline (Readable) */}
      {history.length > 0 && (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider">
            Order Activity History:
          </div>
          <div className="space-y-1.5">
            {history.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full bg-pink-500 mt-1.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-slate-900 capitalize">
                    {h.status.replace(/_/g, ' ')}
                  </span>{' '}
                  <span className="text-slate-400 text-[11px]">
                    ({new Date(h.timestamp).toLocaleString('en-IN')})
                  </span>
                  {h.note && <div className="text-slate-500 italic text-[11px]">{h.note}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTimeline;
