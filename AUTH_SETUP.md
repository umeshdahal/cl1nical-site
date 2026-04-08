# Supabase Authentication Setup

## Prerequisites

This project uses Astro SSR with Supabase cookie-based authentication.

Before running locally or deploying, make sure you have:
- a Supabase project
- the SQL migration applied
- environment variables configured
- a server-capable deployment target such as Vercel

## 1. Run SQL Migration

Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in your Supabase SQL Editor.

Steps:
1. Open your Supabase dashboard.
2. Go to `SQL Editor`.
3. Paste the SQL from `supabase/migrations/001_initial_schema.sql`.
4. Run it.

This creates:
- the `profiles` table linked to `auth.users`
- Row Level Security policies so users can only access their own row
- the signup trigger that auto-creates a profile

## 2. Environment Variables

Create a local `.env` file with:

```env
PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For Vercel, add the same values in:
- `Project Settings -> Environment Variables`

Use them for:
- `Production`
- `Preview`
- `Development`

## 3. Supabase Auth Configuration

In Supabase:
- go to `Authentication -> URL Configuration`

Set:
- `Site URL` to your production domain
- `Redirect URLs` to include:
  - `http://localhost:4321`
  - your Vercel production URL
  - your Vercel preview URL if needed

If you want users to log in immediately after registering during development:
- go to `Authentication -> Providers -> Email`
- disable `Confirm email`

If email confirmation stays enabled, registration will redirect users back to login with a check-email message.

## 4. Current Auth Architecture

This repo uses:
- `src/lib/supabase.ts` for server and browser clients
- `src/middleware.ts` for route protection
- server-side `login`, `register`, `logout`, and `profile` handling

Protected routes:
- `/dashboard`
- `/profile`
- `/elections`

## Security Notes

- `.env` is gitignored and should never be committed
- do not commit service role keys
- the anon key is intended for browser use, but documentation should still use placeholders in public repos
- RLS must remain enabled in Supabase for `profiles`
