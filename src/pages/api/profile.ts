import type { APIRoute } from 'astro';
import { upsertProfileByUser } from '../../lib/profile';
import { createServerClient } from '../../lib/supabase';

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createServerClient(cookies);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json();
  try {
    const result = await upsertProfileByUser(supabase, user, {
      display_name: typeof body.display_name === 'string' ? body.display_name.trim() : null,
      avatar_url: typeof body.avatar_url === 'string' ? body.avatar_url.trim() : null,
      settings: typeof body.settings === 'object' && body.settings ? body.settings : {},
    });

    if (!result.ok) {
      return new Response(JSON.stringify({ error: result.error, missingProfilesTable: true }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save profile';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
