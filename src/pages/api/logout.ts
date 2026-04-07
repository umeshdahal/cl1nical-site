import type { APIRoute } from 'astro';
import { createServerClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ cookies }) => {
  const supabase = createServerClient({
    get: (name) => cookies.get(name)?.value,
    set: (name, value, options) => cookies.set(name, value, options),
    remove: (name, options) => cookies.delete(name, options),
  });

  await supabase.auth.signOut();
  return new Response(null, { status: 302, headers: { Location: '/login' } });
};
