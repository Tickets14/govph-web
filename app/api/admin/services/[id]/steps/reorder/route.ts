import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? '';

// PATCH /api/admin/services/[id]/steps/reorder — reorder steps
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const res = await fetch(`${API_URL}/services/${id}/steps/reorder`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_API_KEY,
    },
    body: JSON.stringify(body),
  });

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}
