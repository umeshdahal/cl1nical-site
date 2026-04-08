import type { SupabaseClient, User } from '@supabase/supabase-js';

export type ProfileRecord = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  settings: Record<string, unknown> | null;
  updated_at: string | null;
};

function isMissingProfilesTable(message: string | undefined) {
  return Boolean(message?.includes(`Could not find the table 'public.profiles' in the schema cache`));
}

export async function getProfileByUser(supabase: SupabaseClient, user: User) {
  const result = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle<ProfileRecord>();

  if (result.error && !isMissingProfilesTable(result.error.message)) {
    throw result.error;
  }

  return {
    profile: result.error ? null : result.data,
    missingProfilesTable: Boolean(result.error && isMissingProfilesTable(result.error.message)),
  };
}

export async function upsertProfileByUser(
  supabase: SupabaseClient,
  user: User,
  values: {
    display_name: string | null;
    avatar_url: string | null;
    settings: Record<string, unknown>;
  },
) {
  const payload = {
    id: user.id,
    ...values,
    updated_at: new Date().toISOString(),
  };

  const result = await supabase
    .from('profiles')
    .upsert(payload, { onConflict: 'id' });

  if (result.error && isMissingProfilesTable(result.error.message)) {
    return {
      ok: false as const,
      missingProfilesTable: true,
      error: 'The Supabase profiles table is not available yet. Run the latest SQL migration, then try again.',
    };
  }

  if (result.error) {
    throw result.error;
  }

  return {
    ok: true as const,
    missingProfilesTable: false,
  };
}
