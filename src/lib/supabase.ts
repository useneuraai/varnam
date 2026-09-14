import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://placeholder-project.supabase.co";

const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "placeholder-anon-key";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || supabaseAnonKey;

export const isSupabaseConfigured =
  Boolean(process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL) !==
    "https://placeholder-project.supabase.co";

if (!isSupabaseConfigured && typeof window !== "undefined") {
  console.warn(
    "Supabase credentials are not configured. Running in local/mock database mode. Set SUPABASE_URL and SUPABASE_ANON_KEY in your environment to connect to Supabase Cloud."
  );
}

// Client for frontend and user-scoped RLS operations
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Privileged client for server-side API routes (bypasses RLS when service role key is present)
export const supabaseAdmin: SupabaseClient = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
