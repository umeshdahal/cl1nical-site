# Vercel Deploy Checklist

## Vercel Environment Variables

Add these in `Vercel -> Project -> Settings -> Environment Variables`.

Apply each variable to:
- `Production`
- `Preview`
- `Development`

### `PUBLIC_SUPABASE_URL`
- Value: your Supabase project URL
- Example: `https://xyzcompany.supabase.co`

### `PUBLIC_SUPABASE_ANON_KEY`
- Value: your Supabase anon public key
- Copy it exactly from `Supabase -> Project Settings -> API`

## Where To Find These In Supabase

Go to:
- `Supabase -> Project Settings -> API`

Copy:
- `Project URL` -> use for `PUBLIC_SUPABASE_URL`
- `anon public` key -> use for `PUBLIC_SUPABASE_ANON_KEY`

## Supabase Auth URL Configuration

Go to:
- `Supabase -> Authentication -> URL Configuration`

### Site URL
Set this to your production Vercel URL only.

Example:
- `https://your-project-name.vercel.app`

### Redirect URLs
Add each of these on its own line:
- `http://localhost:4321`
- `https://your-project-name.vercel.app`
- `https://your-project-name-git-main-username.vercel.app`

If you later add a custom domain, also add:
- `https://yourdomain.com`

Then update `Site URL` to:
- `https://yourdomain.com`

## If You Want Instant Login After Register

Go to:
- `Supabase -> Authentication -> Providers -> Email`

Disable:
- `Confirm email`

If you keep confirm email enabled, register will redirect to login with the check-email message instead of creating an immediate session.

## Vercel Deploy Steps

1. Push the repo to GitHub.
2. Import the repo into Vercel.
3. Keep the framework preset as `Astro`.
4. Keep the root directory as the repo root.
5. Leave the build command as the default.
6. Leave the output setting as the default.
7. Add the two environment variables above.
8. Deploy.

## What To Test After Deploy

- `/register`
- `/login`
- `/dashboard`
- `/profile`
- `/elections`
- logout button
- hard refresh on protected pages after login

## Important Note

This repo is configured for SSR auth now, so it must stay on Vercel or another server-capable host.

Do not deploy this app to GitHub Pages.
