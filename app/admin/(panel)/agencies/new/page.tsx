'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NewAgencyPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', acronym: '', description: '', website_url: '' });
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

    const res = await fetch('/api/admin/agencies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json?.error?.message ?? 'Failed to create agency.');
      setSubmitting(false);
      return;
    }

    router.push('/admin/agencies');
    router.refresh();
  };

  return (
    <div className="p-6">
      <Link
        href="/admin/agencies"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Agencies
      </Link>
      <h1 className="font-display font-bold text-2xl text-navy mb-6">Create New Agency</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Agency Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Department of Foreign Affairs"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Acronym</label>
            <Input
              value={form.acronym}
              onChange={(e) => setForm({ ...form, acronym: e.target.value })}
              placeholder="e.g., DFA"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Alphanumeric with optional hyphens (e.g., DFA, SSS, PhilHealth).
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <Input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="e.g., Handles passport and foreign affairs services"
              required
            />
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
              {submitting ? 'Creating…' : 'Create Agency'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
