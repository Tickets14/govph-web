import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? '';

// PUT /api/admin/steps/[id] — update a step
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();

  const res = await fetch(`${API_URL}/steps/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_API_KEY,
    },
    body: JSON.stringify(body),
  });

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}

// DELETE /api/admin/steps/[id] — delete a step
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const res = await fetch(`${API_URL}/steps/${id}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Key': ADMIN_API_KEY },
  });

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}
