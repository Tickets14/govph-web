"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SERVICE_CATEGORIES, MOCK_AGENCIES } from "@/lib/constants";
import type { Service, ServiceCategory } from "@/types";

interface ServiceFormProps {
  initialData?: Partial<Service>;
  onSubmit?: (data: Partial<Service>) => void;
}

export function ServiceForm({ initialData, onSubmit }: ServiceFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    description: initialData?.description ?? "",
    category: initialData?.category ?? "identity",
    agencyId: initialData?.agencyId ?? "",
    processingTime: initialData?.processingTime ?? "",
    totalFee: initialData?.totalFee?.toString() ?? "0",
    isFeatured: initialData?.isFeatured ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: Partial<Service> = {
      ...form,
      category: form.category as ServiceCategory,
      totalFee: Number(form.totalFee),
      steps: initialData?.steps ?? [],
      requirements: initialData?.requirements ?? [],
    };
    onSubmit?.(data);
    router.push("/admin/services");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g., New Passport Application"
            required
          />
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            >
              {SERVICE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
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
              {MOCK_AGENCIES.map((a) => (
                <option key={a.id} value={a.id}>{a.acronym} – {a.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Processing Time</label>
            <Input
              value={form.processingTime}
              onChange={(e) => setForm({ ...form, processingTime: e.target.value })}
              placeholder="e.g., 10-15 working days"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Total Fee (₱)</label>
            <Input
              type="number"
              min="0"
              value={form.totalFee}
              onChange={(e) => setForm({ ...form, totalFee: e.target.value })}
            />
          </div>
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded text-navy border-gray-300"
          />
          <span className="text-sm text-gray-700">Featured on homepage</span>
        </label>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" className="bg-navy hover:bg-navy/90 text-white">
          {initialData ? "Save Changes" : "Create Service"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
