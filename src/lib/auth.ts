import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Extracts and decodes the user ID (sub claim) from an Authorization Bearer header.
 * Uses fast local JWT parsing first, falling back to Supabase API calls.
 */
export async function getUserIdFromAuthHeader(authHeader: string | null): Promise<string | undefined> {
  if (!authHeader) return undefined;

  const token = authHeader.replace("Bearer ", "");

  if (!isSupabaseConfigured) {
    return "mock-user-123";
  }

  // 1. Fast local JWT payload decode
  try {
    const parts = token.split(".");
    if (parts.length === 3) {
      const payload = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
      if (payload && payload.sub) {
        return payload.sub;
      }
    }
  } catch (jwtError) {
    console.warn("Local JWT decode failed, falling back to Supabase auth API:", jwtError);
  }

  // 2. Safe network fallback
  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (!error && user) {
      return user.id;
    }
  } catch (supabaseError) {
    console.error("Supabase getUser fallback error:", supabaseError);
  }

  return undefined;
}
