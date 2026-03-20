'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { adminClientFetch } from '@/lib/admin-fetch';

export default function NewAgencyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', acronym: '', description: '', website_url: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body: Record<string, string> = {
      name: form.name,
      acronym: form.acronym,
      description: form.description,
    };
    if (form.website_url) body.website_url = form.website_url;

    const res = await adminClientFetch('/api/admin/agencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to create agency.');
      setSubmitting(false);
      return;
    }

    toast.success('Agency created.');
    router.push('/admin/agencies');
    router.refresh();
  };

  return (
    <div className="p-8 animate-fade-in">
      <Link
        href="/admin/agencies"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Agencies
      </Link>
      <h1 className="font-display font-bold text-xl text-navy mb-1">Create New Agency</h1>
      <p className="text-sm text-gray-400 mb-8">Add a new government agency to the tracker.</p>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-lg animate-fade-in-up animation-delay-100">
        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            {
              key: 'name',
              label: 'Agency Name',
              placeholder: 'e.g., Department of Foreign Affairs',
              type: 'text',
              required: true,
            },
            {
              key: 'acronym',
              label: 'Acronym',
              placeholder: 'e.g., DFA',
              type: 'text',
              required: true,
              hint: 'Alphanumeric with optional hyphens (e.g., DFA, SSS, PhilHealth).',
            },
            {
              key: 'description',
              label: 'Description',
              placeholder: 'e.g., Handles passport and foreign affairs services',
              type: 'text',
              required: true,
            },
            {
              key: 'website_url',
              label: 'Website URL',
              placeholder: 'https://agency.gov.ph',
              type: 'url',
              required: false,
            },
          ].map(({ key, label, placeholder, type, required, hint }) => (
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

          <div className="flex gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-navy/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {submitting ? 'Creating…' : 'Create Agency'}
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
      </div>
    </div>
  );
}
