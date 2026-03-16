'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency Name</label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Acronym</label>
        <Input value={form.acronym} onChange={(e) => setForm({ ...form, acronym: e.target.value })} required />
        <p className="text-xs text-gray-400 mt-1">Alphanumeric with optional hyphens.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
        <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
        <Input
          type="url"
          value={form.website_url}
          onChange={(e) => setForm({ ...form, website_url: e.target.value })}
          placeholder="https://agency.gov.ph"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={submitting} className="bg-navy hover:bg-navy/90 text-white">
          {submitting ? 'Saving…' : 'Save Changes'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
