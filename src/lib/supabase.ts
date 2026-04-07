import { createServerClient as createServer, createBrowserClient as createBrowser } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

const url = import.meta.env.PUBLIC_SUPABASE_URL;
const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export function createServerClient(cookieStore: {
  get: (name: string) => string | undefined;
  set: (name: string, value: string, options: CookieOptions) => void;
  remove: (name: string, options: CookieOptions) => void;
}) {
  return createServer(url, key, {
    cookies: {
      get: cookieStore.get,
      set: cookieStore.set,
      remove: cookieStore.remove,
    },
  });
}

export function createBrowserClient() {
  return createBrowser(url, key);
}
