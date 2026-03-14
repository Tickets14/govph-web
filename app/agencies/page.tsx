import type { Metadata } from "next";
import { getAgencies, getServices } from "@/lib/api";
import { PageHeader } from "@/components/common/PageHeader";
import { AgencyCard } from "@/components/agencies/AgencyCard";

export const metadata: Metadata = {
  title: "Agencies",
  description: "Browse all Philippine government agencies covered by GovPH Tracker.",
};

export default async function AgenciesPage() {
  const [agencies, services] = await Promise.all([getAgencies(), getServices()]);

  const serviceCountByAgency = services.reduce<Record<string, number>>((acc, s) => {
    acc[s.agencyId] = (acc[s.agencyId] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHeader
        title="Mga Ahensya ng Gobyerno"
        description={`${agencies.length} agencies ang kasalukuyang covered.`}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agencies.map((agency) => (
            <AgencyCard
              key={agency.id}
              agency={agency}
              serviceCount={serviceCountByAgency[agency.id] ?? 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
