import { NextRequest } from 'next/server';
import { adminFetch } from '@/lib/admin-api';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  return adminFetch(`/services/${id}/steps`, { method: 'POST', body: JSON.stringify(body) });
}
