import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const metadata: Metadata = { title: "New Service" };

export default function NewServicePage() {
  return (
    <div className="p-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>
      <h1 className="font-display font-bold text-2xl text-navy mb-6">Create New Service</h1>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ServiceForm />
      </div>
    </div>
  );
}
