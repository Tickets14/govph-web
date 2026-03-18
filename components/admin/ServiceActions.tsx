'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';

interface ServiceActionsProps {
  id: string;
  slug: string;
  name: string;
}

export function ServiceActions({ id, slug, name }: ServiceActionsProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete service "${name}"? This cannot be undone.`)) return;
    setDeleting(true);

    const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      alert(json?.error?.message ?? 'Failed to delete service.');
      setDeleting(false);
      return;
    }

    router.refresh();
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Link
        href={`/admin/services/${slug}/edit`}
        className="p-2 rounded-lg text-gray-300 hover:text-navy hover:bg-gray-50 transition-all duration-150"
        title="Edit"
      >
        <Pencil className="w-3.5 h-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-2 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-50 transition-all duration-150 disabled:opacity-40"
        title="Delete"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
