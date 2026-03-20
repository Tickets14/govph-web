import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

/**
 * Client-side fetch wrapper for admin API routes.
 * Automatically signs out and redirects to login on 401.
 */
export async function adminClientFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, options);

  if (res.status === 401) {
    toast.error('Session expired. Redirecting to login…');
    await signOut({ redirectTo: '/admin/login' });
  }

  return res;
}
