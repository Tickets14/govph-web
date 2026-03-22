import { PageHeader } from '@/components/common/PageHeader';
import { getAgencies } from '@/lib/api';
import { NearbyClient } from './NearbyClient';

export const metadata = {
  title: 'Nearby Agencies — Gov Requirements Tracker',
  description: 'Find the nearest government agency offices to your location.',
};

export default async function NearbyPage() {
  const agencies = await getAgencies();

  return (
    <>
      <PageHeader title="Nearby Agencies" description="Find government offices closest to you." />
      <NearbyClient agencies={agencies} />
    </>
  );
}
