// Supabase Auth settings:
// Auth > URL Configuration: Site URL and Redirect URLs must match this app's domain.
// Auth > Email: disable Confirm email during development if you want register to log in immediately.
import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from './lib/supabase';

const PROTECTED = ['/dashboard', '/profile', '/elections'];
const GUEST_ONLY = ['/login', '/register'];

export const onRequest = defineMiddleware(async (context, next) => {
  if (context.url.hostname === 'www.cl1nical.dev') {
    return context.redirect(`https://cl1nical.dev${context.url.pathname}${context.url.search}`, 308);
  }

  const path = context.url.pathname;
  const supabase = createServerClient(context.cookies);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user && PROTECTED.some((route) => path.startsWith(route))) {
    return context.redirect('/login');
  }

  if (user && GUEST_ONLY.some((route) => path.startsWith(route))) {
    return context.redirect('/dashboard');
  }

  return next();
});
