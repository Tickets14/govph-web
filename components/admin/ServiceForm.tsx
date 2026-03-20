'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Agency, Service } from '@/types';
import { SERVICE_CATEGORIES } from '@/lib/constants';

interface ServiceFormProps {
  initialData?: Service;
  agencies: Agency[];
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const inputCls =
  'w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50';

export function ServiceForm({ initialData, agencies }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    agencyId: initialData?.agencyId ?? '',
    category: (initialData?.category as string) ?? '',
    estimatedTime: initialData?.processingTime ?? '',
    appointmentUrl: initialData?.appointmentUrl ?? '',
    isActive: initialData?.isActive ?? true,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleNameChange = (name: string) => {
    setForm((prev) => ({
      ...prev,
      name,
      slug: initialData ? prev.slug : toSlug(name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const body: Record<string, unknown> = {
      agency_id: form.agencyId,
      name: form.name,
      slug: form.slug,
      description: form.description,
      category: form.category || undefined,
      is_active: form.isActive,
    };
    if (form.estimatedTime) body.estimated_time = form.estimatedTime;
    if (form.appointmentUrl) body.appointment_url = form.appointmentUrl;

    const url = initialData ? `/api/admin/services/${initialData.id}` : '/api/admin/services';
    const method = initialData ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      toast.error(json?.error?.message ?? 'Failed to save service.');
      setSubmitting(false);
      return;
    }

    toast.success(initialData ? 'Service updated.' : 'Service created.');
    router.push('/admin/services');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Service Name <span className="text-red-400">*</span>
        </label>
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g., New Passport Application"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Slug <span className="text-red-400">*</span>
        </label>
        <input
          className={inputCls}
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="e.g., new-passport-application"
          required
        />
        <p className="text-[11px] text-gray-400 mt-1">Lowercase letters, numbers, and hyphens only.</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Brief description of the service..."
          rows={3}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder:text-gray-300 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50 resize-none"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Agency <span className="text-red-400">*</span>
        </label>
        <select
          value={form.agencyId}
          onChange={(e) => setForm({ ...form, agencyId: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50"
          required
        >
          <option value="">Select agency...</option>
          {agencies.map((a) => (
            <option key={a.id} value={a.id}>
              {a.acronym} – {a.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
          Category <span className="text-red-400">*</span>
        </label>
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 outline-none focus:border-navy/40 focus:ring-2 focus:ring-navy/8 transition-all duration-200 bg-gray-50/50"
          required
        >
          <option value="">Select category...</option>
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Estimated Time
          </label>
          <input
            className={inputCls}
            value={form.estimatedTime}
            onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
            placeholder="e.g., 10-15 working days"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">
            Appointment URL
          </label>
          <input
            type="url"
            className={inputCls}
            value={form.appointmentUrl}
            onChange={(e) => setForm({ ...form, appointmentUrl: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer py-1">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          className="w-4 h-4 rounded accent-navy border-gray-300"
        />
        <span className="text-sm text-gray-600">Active (visible to users)</span>
      </label>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-5 py-2.5 rounded-xl hover:bg-navy/90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50"
        >
          {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {submitting ? 'Saving…' : initialData ? 'Save Changes' : 'Create Service'}
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
