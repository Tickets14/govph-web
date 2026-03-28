import type { Metadata } from 'next';
import { PageHeader } from '@/components/common/PageHeader';
import { FeedbackClient } from './FeedbackClient';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Report an issue or suggest a feature to help us improve.',
};

export default function FeedbackPage() {
  return (
    <div>
      <PageHeader title="Feedback" description="Found a bug or have an idea? Let us know." />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <FeedbackClient />
      </div>
    </div>
  );
}
