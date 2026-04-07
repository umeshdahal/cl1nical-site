import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from './lib/supabase';

const PROTECTED = ['/dashboard', '/profile'];
const AUTH = ['/login', '/register'];

export const onRequest = defineMiddleware(async (context, next) => {
  const path = new URL(context.request.url).pathname;

  const supabase = createServerClient({
    get: (name) => context.cookies.get(name)?.value,
    set: (name, value, options) => context.cookies.set(name, value, options),
    remove: (name, options) => context.cookies.delete(name, options),
  });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session && PROTECTED.some((p) => path.startsWith(p))) {
    return context.redirect('/login');
  }

  if (session && AUTH.some((p) => path.startsWith(p))) {
    return context.redirect('/dashboard');
  }

  return next();
});
