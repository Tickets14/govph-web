"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function NewAgencyPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    acronym: "",
    description: "",
    website: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, POST to API
    router.push("/admin/agencies");
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Brief description..."
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Website URL</label>
            <Input
              type="url"
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://agency.gov.ph"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="bg-navy hover:bg-navy/90 text-white">
              Create Agency
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
