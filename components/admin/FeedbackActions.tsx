'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2, AlertTriangle, Loader2, Eye, Bug, Lightbulb, MessageSquare, Mail, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { adminClientFetch } from '@/lib/admin-fetch';
import type { Feedback } from '@/types';

const TYPE_CONFIG = {
  bug: { label: 'Bug Report', icon: Bug, color: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40' },
  feature_request: {
    label: 'Feature Request',
    icon: Lightbulb,
    color: 'text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40',
  },
  general: {
    label: 'General',
    icon: MessageSquare,
    color: 'text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40',
  },
};

interface FeedbackActionsProps {
  feedback: Feedback;
}

export function FeedbackActions({ feedback }: FeedbackActionsProps) {
  const router = useRouter();
  const [showView, setShowView] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sending, setSending] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  const config = TYPE_CONFIG[feedback.type];
  const Icon = config.icon;

  const handleDelete = async () => {
    setDeleting(true);
    const res = await adminClientFetch(`/api/admin/feedbacks/${feedback.id}`, { method: 'DELETE' });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to delete feedback.');
      setDeleting(false);
      setShowDelete(false);
      return;
    }
    toast.success('Feedback deleted.');
    setShowDelete(false);
    setShowView(false);
    router.refresh();
  };

  const handleReply = async () => {
    if (!replyMessage.trim()) return;
    setSending(true);
    const res = await adminClientFetch(`/api/admin/feedbacks/${feedback.id}/reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: replyMessage, email: feedback.email }),
    });
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to send reply.');
      setSending(false);
      return;
    }
    toast.success('Reply sent successfully.');
    setSending(false);
    setShowReply(false);
    setReplyMessage('');
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <button
          onClick={() => setShowView(true)}
          className="p-2 rounded-lg text-gray-300 dark:text-gray-600 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-all duration-150"
          title="View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setShowDelete(true)}
          className="p-2 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── View Dialog ─────────────────────────────────────────────── */}
      {showView &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowView(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/[0.07] w-full max-w-lg mx-4 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between p-6 pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${config.color}`}>
                      {config.label}
                    </span>
                    <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1 leading-snug">
                      {feedback.subject}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowView(false)}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-100 dark:text-gray-600 dark:hover:text-gray-400 dark:hover:bg-gray-700 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 px-6 mt-3 text-[11px] text-gray-400">
                {feedback.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {feedback.email}
                  </span>
                )}
                {feedback.createdAt && (
                  <span>
                    {new Date(feedback.createdAt).toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="px-6 py-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {feedback.description}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 dark:border-white/[0.07]">
                <button
                  onClick={() => {
                    setShowView(false);
                    setShowDelete(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                  Delete
                </button>
                {feedback.email && (
                  <button
                    onClick={() => {
                      setShowView(false);
                      setShowReply(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 active:scale-95"
                  >
                    <Send className="w-3 h-3" />
                    Reply via Email
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── Reply Dialog ────────────────────────────────────────────── */}
      {showReply &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => !sending && setShowReply(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/[0.07] w-full max-w-lg mx-4 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 pb-0">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Reply to Feedback</h2>
                <p className="text-[11px] text-gray-400 mt-1">
                  Sending to <span className="font-medium text-gray-500 dark:text-gray-300">{feedback.email}</span>
                </p>
              </div>

              {/* Original message preview */}
              <div className="mx-6 mt-4 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-white/5">
                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider mb-1">Original</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{feedback.subject}</p>
                <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-2">{feedback.description}</p>
              </div>

              {/* Reply textarea */}
              <div className="px-6 py-4">
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={5}
                  className="w-full px-4 py-3 text-sm bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none placeholder:text-gray-300 dark:placeholder:text-gray-600"
                  autoFocus
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 dark:border-white/[0.07]">
                <button
                  onClick={() => {
                    setShowReply(false);
                    setReplyMessage('');
                  }}
                  disabled={sending}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReply}
                  disabled={sending || !replyMessage.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-95"
                >
                  {sending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <Send className="w-3 h-3" />
                  {sending ? 'Sending…' : 'Send Reply'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ── Delete Confirmation Dialog ──────────────────────────────── */}
      {showDelete &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => !deleting && setShowDelete(false)}
          >
            <div
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-white/[0.07] w-full max-w-sm mx-4 p-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Delete feedback</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-gray-600 dark:text-gray-300">
                      &ldquo;{feedback.subject}&rdquo;
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowDelete(false)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all duration-200 disabled:opacity-50 active:scale-95"
                >
                  {deleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {deleting ? 'Deleting…' : 'Delete'}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
