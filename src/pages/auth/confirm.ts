import type { APIRoute } from 'astro';
import { createServerClient } from '../../lib/supabase';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const supabase = createServerClient(cookies);
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type');
  const code = url.searchParams.get('code');

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as 'signup' | 'recovery' | 'invite' | 'email_change' | 'magiclink' | 'email',
    });

    if (!error) {
      return redirect('/dashboard');
    }
  }

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect('/dashboard');
    }
  }

  return redirect('/login?message=auth-error');
};
