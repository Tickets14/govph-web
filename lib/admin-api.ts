import { NextResponse } from 'next/server';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';
const ADMIN_API_KEY = process.env.ADMIN_API_KEY ?? '';

export async function adminFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Admin-Key': ADMIN_API_KEY,
      ...options.headers,
    },
  });

  if (res.status === 401 || res.status === 403) {
    return NextResponse.json({ error: 'Unauthorized – invalid or missing admin key' }, { status: 401 });
  }

  if (res.status === 204) return new NextResponse(null, { status: 204 });

  const json = await res.json().catch(() => ({}));
  return NextResponse.json(json, { status: res.status });
}
