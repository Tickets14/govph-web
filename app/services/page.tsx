import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { ServicesClient } from './ServicesClient';

export const metadata: Metadata = {
  title: 'Services',
  description: 'Browse all Philippine government services with step-by-step guides and requirements.',
};

export default function ServicesPage() {
  return (
    <div>
      <PageHeader
        title="Mga Government Services"
        description="Piliin ang serbisyong kailangan mo at makita ang buong proseso."
      />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ServicesClient />
      </div>
    </div>
  );
}
