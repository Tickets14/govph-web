import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getServices } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = { title: "Manage Services" };

export default async function AdminServicesPage() {
  const services = await getServices();

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy">Services</h1>
          <p className="text-sm text-gray-500 mt-0.5">{services.length} services total</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-navy text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-navy/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Service
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Agency</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Featured</th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{service.title}</p>
                  <p className="text-xs text-gray-400 sm:hidden">{service.agency?.acronym}</p>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell text-gray-600">
                  {service.agency?.acronym}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {service.category}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  {service.isFeatured ? (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Yes</span>
                  ) : (
                    <span className="text-xs text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/services/${service.id}/edit`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-navy hover:text-navy/70 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
