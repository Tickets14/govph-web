import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getServiceBySlug, getAgencies } from '@/lib/api';
import { ServiceForm } from '@/components/admin/ServiceForm';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id: slug } = await params;
  const service = await getServiceBySlug(slug);
  return { title: service ? `Edit: ${service.title}` : 'Edit Service' };
}

export default async function EditServicePage({ params }: Props) {
  const { id: slug } = await params;
  const [service, agencies] = await Promise.all([getServiceBySlug(slug), getAgencies()]);
  if (!service) notFound();

  return (
    <div className="p-8 animate-fade-in">
      <Link
        href="/admin/services"
        className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-navy mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Services
      </Link>
      <h1 className="font-display font-bold text-xl text-navy mb-1">Edit Service</h1>
      <p className="text-sm text-gray-400 mb-8">{service.title}</p>
      <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-fade-in-up animation-delay-100">
        <ServiceForm initialData={service} agencies={agencies} />
      </div>
    </div>
  );
}
