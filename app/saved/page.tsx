import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { SavedServicesClient } from './SavedServicesClient';

export const metadata: Metadata = {
  title: 'Saved Services',
  description: 'View your saved government services.',
};

export default function SavedPage() {
  return (
    <div>
      <PageHeader title="Saved Services" description="Government services you've bookmarked for quick access." />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SavedServicesClient />
      </div>
    </div>
  );
}
