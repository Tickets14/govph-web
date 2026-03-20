import { NextRequest } from 'next/server';
import { adminFetch } from '@/lib/admin-api';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  return adminFetch(`/services/${id}/steps/reorder`, { method: 'PATCH', body: JSON.stringify(body) });
}
