import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY
  );
}

export type { User, Session } from '@supabase/supabase-js';
