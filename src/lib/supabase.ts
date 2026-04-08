// Supabase Auth settings:
// Auth > URL Configuration: Site URL and Redirect URLs must match this app's domain.
// Auth > Email: disable Confirm email during development if you want register to log in immediately.
import {
  createBrowserClient as createSupabaseBrowserClient,
  createServerClient as createSupabaseServerClient,
  type CookieOptions,
} from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

function requiredEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

const url = requiredEnv('PUBLIC_SUPABASE_URL', supabaseUrl);
const anonKey = requiredEnv('PUBLIC_SUPABASE_ANON_KEY', supabaseAnonKey);

export function createServerClient(cookies: Pick<AstroCookies, 'get' | 'set' | 'delete'>) {
  return createSupabaseServerClient(url, anonKey, {
    cookies: {
      get(name: string) {
        return cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        cookies.set(name, value, options);
      },
      remove(name: string, options: CookieOptions) {
        cookies.delete(name, options);
      },
    },
  });
}

export function createBrowserClient() {
  return createSupabaseBrowserClient(url, anonKey);
}
