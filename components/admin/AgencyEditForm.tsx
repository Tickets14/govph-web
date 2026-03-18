'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import type { Agency } from '@/types';

interface AgencyEditFormProps {
  agency: Agency;
}

export function AgencyEditForm({ agency }: AgencyEditFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: agency.name,
    acronym: agency.acronym,
    description: agency.description,
    website_url: agency.website ?? '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const body: Record<string, string> = {
      name: form.name,
      acronym: form.acronym,
      description: form.description,
    };
    if (form.website_url) body.website_url = form.website_url;

    const res = await fetch(`/api/admin/agencies/${agency.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json?.error?.message ?? 'Failed to update agency.');
      setSubmitting(false);
      return;
    }

    router.push('/admin/agencies');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {[
        { key: 'name', label: 'Agency Name', type: 'text', required: true },
        { key: 'acronym', label: 'Acronym', type: 'text', required: true, hint: 'Alphanumeric with optional hyphens.' },
        { key: 'description', label: 'Description', type: 'text', required: true },
        {
          key: 'website_url',
          label: 'Website URL',
          type: 'url',
          required: false,
          placeholder: 'https://agency.gov.ph',
        },
      ].map(({ key, label, type, required, hint, placeholder }) => (
        <div key={key}>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
          <input
            type={type}
            value={form[key as keyof typeof form]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            placeholder={placeholder}
            required={required}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50"
          />
          {hint && <p className="text-[11px] text-gray-400 mt-1">{hint}</p>}
        </div>
      ))}

      {error && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-3 py-2.5 rounded-xl">{error}</p>}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-navy/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
        >
          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {submitting ? 'Saving…' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-gray-400 hover:text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
