'use client';

import React from 'react';
import { Printer, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import { Order } from '@/lib/types';
import SwaraliLogo from './SwaraliLogo';
import { INITIAL_SETTINGS } from '@/lib/data';

interface PrintInvoiceProps {
  order: Order;
  onClose?: () => void;
}

export const PrintInvoice: React.FC<PrintInvoiceProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-lg border border-slate-200 print:border-none print:shadow-none print:p-0">
      {/* Non-printed Toolbar */}
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
        {onClose && (
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold text-xs shadow transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Actual Printable Invoice Container */}
      <div className="space-y-6 text-slate-800 font-sans">
        {/* Invoice Header */}
        <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div>
            <div className="bg-white p-2 rounded inline-block">
              <SwaraliLogo size="md" showTagline={true} />
            </div>
            <div className="text-xs text-slate-600 mt-2 space-y-0.5">
              <p className="font-semibold text-slate-900">{INITIAL_SETTINGS.businessName} ({INITIAL_SETTINGS.businessNameMarathi})</p>
              <p>{INITIAL_SETTINGS.addressLine1}</p>
              <p>{INITIAL_SETTINGS.addressLine2}, {INITIAL_SETTINGS.city} - {INITIAL_SETTINGS.pincode}</p>
              <p>Phone: {INITIAL_SETTINGS.phone1} | GSTIN: {INITIAL_SETTINGS.gstNumber}</p>
            </div>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-mono font-bold text-xs uppercase tracking-wider">
              Tax Invoice / Cash Memo
            </span>
            <div className="text-2xl font-black text-slate-900">{order.id}</div>
            <div className="text-xs text-slate-500">
              Date: {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <div className="text-xs font-semibold text-emerald-700 uppercase">
              Status: {order.paymentStatus.replace(/_/g, ' ')}
            </div>
          </div>
        </div>

        {/* Bill To & Delivery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-2xl">
          <div>
            <strong className="text-slate-400 uppercase tracking-wider block mb-1">
              Billed To Customer:
            </strong>
            <div className="text-sm font-bold text-slate-900">{order.customerName}</div>
            <div className="text-slate-600">{order.customerPhone}</div>
            <div className="text-slate-600">{order.customerEmail}</div>
          </div>

          <div>
            <strong className="text-slate-400 uppercase tracking-wider block mb-1">
              Fulfillment Method:
            </strong>
            <div className="text-sm font-bold text-slate-900 capitalize">
              {order.fulfillmentMethod.replace(/_/g, ' ')}
            </div>
            {order.deliveryAddress ? (
              <div className="text-slate-600">
                {order.deliveryAddress.street}, {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                {order.deliveryAddress.landmark && ` (Near: ${order.deliveryAddress.landmark})`}
              </div>
            ) : (
              <div className="text-slate-600">Store Pickup at Trimurti Chowk, Cidco, Nashik</div>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900 text-white font-semibold">
                <th className="p-3 w-10 text-center">#</th>
                <th className="p-3">Item & Printing Specifications</th>
                <th className="p-3 text-center">Qty</th>
                <th className="p-3 text-right">Unit Rate</th>
                <th className="p-3 text-right">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, index) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 text-center text-slate-400 font-mono">{index + 1}</td>
                  <td className="p-3 space-y-1">
                    <div className="font-bold text-slate-900">{item.title}</div>
                    {item.customConfig && (
                      <div className="text-[11px] text-slate-500 space-y-0.5">
                        {item.customConfig.serviceType === 'flex-printing' && (
                          <p>Size: {item.customConfig.widthFt}ft x {item.customConfig.heightFt}ft | Material: {item.customConfig.material}</p>
                        )}
                        {item.customConfig.serviceType === 'document-printing' && (
                          <p>{item.customConfig.pageCount} Pages | {item.customConfig.colorMode?.toUpperCase()} | {item.customConfig.binding}</p>
                        )}
                        {item.customConfig.finishing && item.customConfig.finishing.length > 0 && (
                          <p>Finishing: {item.customConfig.finishing.join(', ')}</p>
                        )}
                      </div>
                    )}
                    {item.instructions && (
                      <div className="text-[10px] text-pink-700 italic">
                        Note: {item.instructions}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-center font-bold">{item.quantity}</td>
                  <td className="p-3 text-right font-mono">₹{item.unitPrice.toLocaleString()}</td>
                  <td className="p-3 text-right font-bold text-slate-900 font-mono">
                    ₹{item.totalPrice.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Totals */}
        <div className="flex justify-end pt-2">
          <div className="w-full sm:w-72 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-semibold">₹{order.subtotal.toLocaleString()}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-700 font-semibold">
                <span>Discount ({order.couponCode || 'Promo'}):</span>
                <span className="font-mono">-₹{order.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600">
              <span>Delivery / Handling:</span>
              <span className="font-mono">
                {order.fulfillmentCost > 0 ? `₹${order.fulfillmentCost}` : 'FREE'}
              </span>
            </div>
            <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t-2 border-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-base">₹{order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer Notes & Signature */}
        <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] text-slate-500">
          <div>
            <div className="font-bold text-slate-700 mb-1">Terms & Conditions:</div>
            <p>1. Proof approval is customer's final confirmation of text and layout.</p>
            <p>2. Please inspect ready prints at store pickup counter.</p>
            <p>3. This is a computer generated invoice from Swarali Prints, Nashik.</p>
          </div>

          <div className="sm:text-right pt-4 sm:pt-0">
            <div className="font-semibold text-slate-900">For Swarali Prints (स्वराली प्रिंट्स)</div>
            <div className="text-[10px] text-slate-400 mt-6">Authorized Signatory</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice;
