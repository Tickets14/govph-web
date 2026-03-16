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
    <div className="flex items-center justify-end gap-2">
      <Link
        href={`/admin/services/${slug}/edit`}
        className="p-1.5 text-gray-400 hover:text-navy transition-colors"
        title="Edit"
      >
        <Pencil className="w-4 h-4" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
