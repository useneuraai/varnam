import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

if (supabaseUrl === "https://placeholder-project.supabase.co") {
  console.warn(
    "Supabase credentials are not set. Using placeholder credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
