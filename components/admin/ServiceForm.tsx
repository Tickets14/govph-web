'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Agency, Service } from '@/types';

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

export function ServiceForm({ initialData, agencies }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initialData?.title ?? '',
    slug: initialData?.slug ?? '',
    description: initialData?.description ?? '',
    agencyId: initialData?.agencyId ?? '',
    estimatedTime: initialData?.processingTime ?? '',
    appointmentUrl: initialData?.appointmentUrl ?? '',
    isActive: initialData?.isActive ?? true,
  });
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    const body: Record<string, unknown> = {
      agency_id: form.agencyId,
      name: form.name,
      slug: form.slug,
      description: form.description,
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
      setError(json?.error?.message ?? 'Failed to save service.');
      setSubmitting(false);
      return;
    }

    router.push('/admin/services');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Service Name</label>
          <Input
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., New Passport Application"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
          <Input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            placeholder="e.g., new-passport-application"
            required
          />
          <p className="text-xs text-gray-400 mt-1">Lowercase letters, numbers, and hyphens only.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description of the service..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency</label>
          <select
            value={form.agencyId}
            onChange={(e) => setForm({ ...form, agencyId: e.target.value })}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Time</label>
            <Input
              value={form.estimatedTime}
              onChange={(e) => setForm({ ...form, estimatedTime: e.target.value })}
              placeholder="e.g., 10-15 working days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Appointment URL</label>
            <Input
              type="url"
              value={form.appointmentUrl}
              onChange={(e) => setForm({ ...form, appointmentUrl: e.target.value })}
              placeholder="https://..."
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4 rounded text-navy border-gray-300"
          />
          <span className="text-sm text-gray-700">Active (visible to users)</span>
        </label>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={submitting} className="bg-navy hover:bg-navy/90 text-white">
          {submitting ? 'Saving…' : initialData ? 'Save Changes' : 'Create Service'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
