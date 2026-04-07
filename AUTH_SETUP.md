# Supabase Authentication Setup

## Prerequisites

This project uses Astro 5.x which requires an SSR adapter for server-side authentication. The following steps set up the database schema and client utilities.

## 1. Run SQL Migration

Copy the contents of `supabase/migrations/001_initial_schema.sql` and run it in your Supabase SQL Editor:

1. Go to https://app.supabase.com/project/ynijuyggmzszbtccvwdz/sql
2. Paste the SQL from `supabase/migrations/001_initial_schema.sql`
3. Click "Run"

This creates:
- `profiles` table linked to `auth.users` with `ON DELETE CASCADE`
- Row Level Security (RLS) policies ensuring users can ONLY access their own data
- Auto-create profile trigger on signup
- Auto-update `updated_at` trigger

## 2. Environment Variables

The `.env` file is already configured:
```
PUBLIC_SUPABASE_URL=https://ynijuyggmzszbtccvwdz.supabase.co
PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yucNzuubyuUUFIMcJcXyyQ_Qf6VVbGC
```

## 3. For Full SSR Auth (Future)

To enable HTTP-only cookie-based auth (preventing XSS token theft):

1. Upgrade to Astro 6.x or install a compatible SSR adapter
2. Add to `astro.config.mjs`:
```js
import node from '@astrojs/node';
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  // ...
});
```

3. The middleware (`src/middleware.ts`) and server client (`src/lib/supabase/server.ts`) are already prepared for this.

## 4. Current Client-Side Auth

For now, use the browser client (`src/lib/supabase/client.ts`) with Supabase's built-in session management. Tokens are stored in cookies by Supabase's internal implementation.

## Security Notes

- RLS policies prevent IDOR attacks - users can ONLY access their own `profiles` row
- Passwords are hashed by Supabase Auth (bcrypt/argon2) - never stored plaintext
- `.env` is in `.gitignore` - secrets never committed
