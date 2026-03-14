import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getServiceById } from '@/lib/api';
import { ServiceForm } from '@/components/admin/ServiceForm';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = await getServiceById(id);
  return { title: service ? `Edit: ${service.title}` : 'Edit Service' };
}

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div className="p-6">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Services
      </Link>
      <h1 className="font-display font-bold text-2xl text-navy mb-1">Edit Service</h1>
      <p className="text-sm text-gray-500 mb-6">{service.title}</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ServiceForm initialData={service} />
      </div>
    </div>
  );
}
