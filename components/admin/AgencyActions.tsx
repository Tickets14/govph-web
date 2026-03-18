'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Pencil, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AgencyActionsProps {
  id: string;
  acronym: string;
}

export function AgencyActions({ id, acronym }: AgencyActionsProps) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);

    const res = await fetch(`/api/admin/agencies/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to delete agency.');
      setDeleting(false);
      setShowDialog(false);
      return;
    }

    toast.success(`Agency "${acronym}" deleted.`);
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`/admin/agencies/${id}/edit`}
          className="p-2 rounded-lg text-gray-300 hover:text-navy hover:bg-gray-50 transition-all duration-150"
          title="Edit"
        >
          <Pencil className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => setShowDialog(true)}
          className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150"
          title="Delete"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Delete confirmation dialog — portaled to body to escape table stacking context */}
      {showDialog &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fade-in"
            onClick={() => !deleting && setShowDialog(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm mx-4 p-6 animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Delete agency</p>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                    Are you sure you want to delete <span className="font-medium text-gray-600">{acronym}</span>? This
                    action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowDialog(false)}
                  disabled={deleting}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 disabled:opacity-50"
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
