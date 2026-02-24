import { createClient } from '@supabase/supabase-js';

// During build, import.meta.env might be empty. 
// We provide fallbacks to prevent the "supabaseUrl is required" crash.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);