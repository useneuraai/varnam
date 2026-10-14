import { NextRequest } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "./supabase";

export interface AuthenticatedUser {
  id: string;
  email?: string;
  role?: string;
}

/**
 * Validates the user session from the Authorization header using Supabase Auth.
 * Rejects unverified, forged, or expired tokens.
 */
export async function getAuthenticatedUser(
  reqOrHeader: NextRequest | Headers | string | null
): Promise<AuthenticatedUser | null> {
  let authHeader: string | null = null;

  if (typeof reqOrHeader === "string") {
    authHeader = reqOrHeader;
  } else if (reqOrHeader && "headers" in reqOrHeader && typeof reqOrHeader.headers?.get === "function") {
    authHeader = reqOrHeader.headers.get("Authorization");
  } else if (reqOrHeader && "get" in reqOrHeader && typeof reqOrHeader.get === "function") {
    authHeader = (reqOrHeader as Headers).get("Authorization");
  }

  if (!authHeader) return null;

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  // Local / dev fallback when Supabase is not configured
  if (!isSupabaseConfigured) {
    if (token === "mock-user-token" || token.startsWith("mock-")) {
      return { id: "mock-user-123", email: "demo.user@varnam.com", role: "authenticated" };
    }
    return null;
  }

  try {
    // Authenticate token cryptographically against Supabase Auth
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role || "authenticated",
    };
  } catch (err) {
    console.error("Authentication verification error:", err);
    return null;
  }
}

/**
 * Backwards compatible helper returning only userId string
 */
export async function getUserIdFromAuthHeader(authHeader: string | null): Promise<string | undefined> {
  const user = await getAuthenticatedUser(authHeader);
  return user?.id;
}
