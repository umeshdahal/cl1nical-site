import type { SupabaseClient, User } from '@supabase/supabase-js';

export type ProfileRecord = {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  settings: Record<string, unknown> | null;
  updated_at: string | null;
};

export async function getProfileByUser(supabase: SupabaseClient, user: User) {
  const metadata = user.user_metadata && typeof user.user_metadata === 'object'
    ? user.user_metadata as Record<string, unknown>
    : {};
  const rawSettings = metadata.settings;

  return {
    profile: {
      id: user.id,
      display_name: typeof metadata.display_name === 'string' ? metadata.display_name : null,
      avatar_url: typeof metadata.avatar_url === 'string' ? metadata.avatar_url : null,
      settings: rawSettings && typeof rawSettings === 'object' ? rawSettings as Record<string, unknown> : {},
      updated_at: typeof metadata.profile_updated_at === 'string' ? metadata.profile_updated_at : null,
    } satisfies ProfileRecord,
    missingProfilesTable: false,
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
  const result = await supabase.auth.updateUser({
    data: {
      display_name: values.display_name,
      avatar_url: values.avatar_url,
      settings: values.settings,
      profile_updated_at: new Date().toISOString(),
    },
  });

  if (result.error) {
    throw result.error;
  }

  return {
    ok: true as const,
    missingProfilesTable: false,
  };
}
