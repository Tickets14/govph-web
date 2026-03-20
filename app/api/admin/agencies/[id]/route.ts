import { NextRequest } from 'next/server';
import { adminFetch } from '@/lib/admin-api';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  return adminFetch(`/agencies/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return adminFetch(`/agencies/${id}`, { method: 'DELETE' });
}
