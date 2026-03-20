import { NextRequest } from 'next/server';
import { adminFetch } from '@/lib/admin-api';

export async function POST(req: NextRequest) {
  const body = await req.json();
  return adminFetch('/services', { method: 'POST', body: JSON.stringify(body) });
}
