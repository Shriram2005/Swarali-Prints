'use client';

import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Download,
  Eye,
  MessageSquare,
  Sparkles,
  Check,
  RotateCcw,
} from 'lucide-react';
import { ProofItem } from '@/lib/types';
import { approveProof, requestProofChanges } from '@/lib/storage';

interface ProofApprovalBoxProps {
  orderId: string;
  proof: ProofItem;
  onProofUpdated?: () => void;
}

export const ProofApprovalBox: React.FC<ProofApprovalBoxProps> = ({
  orderId,
  proof,
  onProofUpdated,
}) => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [actionDone, setActionDone] = useState<string | null>(null);

  const handleApprove = () => {
    setLoading(true);
    approveProof(orderId, proof.id);
    setActionDone('approved');
    setLoading(false);
    if (onProofUpdated) onProofUpdated();
  };

  const handleRequestChanges = () => {
    if (!comment.trim()) return;
    setLoading(true);
    requestProofChanges(orderId, proof.id, comment);
    setActionDone('changes_requested');
    setShowFeedbackModal(false);
    setLoading(false);
    if (onProofUpdated) onProofUpdated();
  };

  return (
    <div className="w-full bg-gradient-to-br from-amber-50/70 via-white to-pink-50/50 border-2 border-amber-300/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-200/80 pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 font-bold text-xs">
            <Sparkles className="w-3.5 h-3.5" /> Action Required: Digital Proof Review
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 mt-1">
            Review Sample Proof v{proof.version}
          </h3>
          <p className="text-xs text-slate-600">
            Please examine spellings, contact details, crop alignment, and colors carefully before approving.
          </p>
        </div>

        <div>
          {proof.status === 'approved' || actionDone === 'approved' ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved for Printing
            </span>
          ) : proof.status === 'changes_requested' || actionDone === 'changes_requested' ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
              <RotateCcw className="w-4 h-4 text-rose-600" /> Changes Requested
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 font-bold text-xs animate-pulse">
              <AlertCircle className="w-4 h-4 text-amber-600" /> Awaiting Your Approval
            </span>
          )}
        </div>
      </div>

      {/* Proof Image Preview */}
      <div className="space-y-2">
        <div className="relative group rounded-2xl overflow-hidden border border-slate-300 bg-slate-100 flex items-center justify-center max-h-96">
          <img
            src={proof.imageUrl}
            alt={`Proof v${proof.version}`}
            className="w-full h-auto object-contain max-h-96"
          />
          <a
            href={proof.imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-4 right-4 bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold px-3 py-2 rounded-xl backdrop-blur flex items-center gap-1.5 shadow transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open High-Res Proof</span>
          </a>
        </div>

        {proof.notes && (
          <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700">
            <strong className="text-slate-900 block mb-0.5">Note from Designer:</strong>
            {proof.notes}
          </div>
        )}

        {proof.customerComments && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800">
            <strong className="text-rose-900 block mb-0.5">Your Feedback:</strong>
            {proof.customerComments}
          </div>
        )}
      </div>

      {/* Action Buttons if still pending */}
      {proof.status === 'pending' && !actionDone && (
        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleApprove}
            disabled={loading}
            className="flex-1 sm:flex-initial py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Approve Proof & Start Printing</span>
          </button>

          <button
            type="button"
            onClick={() => setShowFeedbackModal(true)}
            disabled={loading}
            className="flex-1 sm:flex-initial py-3 px-6 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 text-rose-700 font-bold text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Request Changes / Edit</span>
          </button>
        </div>
      )}

      {/* Changes Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-lg">
              <MessageSquare className="w-5 h-5" />
              <h4>Request Design Corrections</h4>
            </div>

            <p className="text-xs text-slate-500">
              Please clearly describe what you would like changed (e.g. spelling, telephone numbers, background colors, font size).
            </p>

            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="e.g. Please change the font color of the shop name to deep navy and change the mobile number to +91 98231 23456."
              className="w-full p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestChanges}
                disabled={!comment.trim() || loading}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow transition-all disabled:opacity-50"
              >
                Submit Feedback to Designer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofApprovalBox;
