import type { Metadata } from 'next';
import { getAgencies, getServices } from '@/lib/api';
import { PageHeader } from '@/components/common/PageHeader';
import { AgencyCard } from '@/components/agencies/AgencyCard';

export const metadata: Metadata = {
  title: 'Agencies',
  description: 'Browse all Philippine government agencies covered by Gov Requirements Tracker.',
};

export default async function AgenciesPage() {
  const [agencies, services] = await Promise.all([getAgencies(), getServices()]);

  const serviceCountByAgency = services.reduce<Record<string, number>>((acc, s) => {
    acc[s.agencyId] = (acc[s.agencyId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Government Agencies" description={`${agencies.length} agencies currently covered.`} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agencies.map((agency, i) => (
            <div key={agency.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 40}ms` }}>
              <AgencyCard agency={agency} serviceCount={serviceCountByAgency[agency.id] ?? 0} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
