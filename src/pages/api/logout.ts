import type { APIRoute } from 'astro';
import { createServerClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ cookies }) => {
  const supabase = createServerClient(cookies);
  await supabase.auth.signOut();

  return new Response(null, {
    status: 302,
    headers: { Location: '/login' },
  });
};
