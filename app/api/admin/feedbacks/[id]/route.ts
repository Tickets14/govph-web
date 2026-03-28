import { NextRequest } from 'next/server';
import { adminFetch } from '@/lib/admin-api';

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminFetch(`/feedbacks/${id}`, { method: 'DELETE' });
}
