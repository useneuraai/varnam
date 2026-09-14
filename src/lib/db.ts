import fs from "fs";
import path from "path";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { TEMPLATES } from "./templates";

// =====================================================================================
// DATA TYPES & INTERFACES
// =====================================================================================

export interface ProfileRecord {
  id: string; // references auth.users(id)
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role?: string; // "customer" | "admin"
  created_at?: string;
  updated_at?: string;
}

export interface TemplateRecord {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  category: string;
  religion: string;
  language: string;
  price: number;
  thumbnail_url?: string;
  preview_music_url?: string;
  config?: Record<string, any>;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface InvitationRecord {
  id?: string;
  template_slug: string;
  slug: string;
  user_id?: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_venue: string;
  quote?: string;
  family_names?: string;
  rsvp_phone?: string;
  custom_message?: string;
  music_url?: string;
  is_paid: boolean;
  payment_id?: string;
  order_id?: string;
  
  // Licensed Event Features
  bg_image_url?: string;
  slideshow_images?: string;
  dress_code?: string;
  transport_info?: string;
  scratch_enabled?: string;
  sangeet_enabled?: string;
  sangeet_date?: string;
  sangeet_venue?: string;
  reception_date?: string;
  reception_venue?: string;
  gmap_coordinates?: string;
  music_enabled?: string;
  slideshow_enabled?: string;
  dress_code_enabled?: string;
  transport_enabled?: string;
  custom_sections?: string;

  created_at?: string;
  updated_at?: string;
}

export interface PaymentRecord {
  id?: string;
  invitation_id?: string;
  invitation_slug?: string;
  user_id?: string;
  razorpay_order_id: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount: number;
  currency?: string;
  status: string; // "captured" | "pending" | "failed"
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface RsvpRecord {
  id?: string;
  invitation_id?: string;
  invitation_slug: string;
  name: string;
  email?: string;
  phone?: string;
  attendance: string; // "yes" | "no"
  guest_count: number;
  dietary_preferences?: string;
  wishes?: string;
  created_at?: string;
}

// =====================================================================================
// LOCAL MOCK DB STORAGE HELPERS (FOR DEV / OFFLINE FALLBACK)
// =====================================================================================

const MOCK_INVITATIONS_PATH = path.join(process.cwd(), "src", "lib", "mock-invitations.json");
const MOCK_PAYMENTS_PATH = path.join(process.cwd(), "src", "lib", "mock-payments.json");
const MOCK_RSVPS_PATH = path.join(process.cwd(), "src", "lib", "mock-rsvps.json");
const MOCK_PROFILES_PATH = path.join(process.cwd(), "src", "lib", "mock-profiles.json");

function readJsonFile<T>(filePath: string, defaultVal: T): T {
  try {
    if (!fs.existsSync(filePath)) {
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data || JSON.stringify(defaultVal));
  } catch (error) {
    console.error(`Error reading mock file ${filePath}:`, error);
    return defaultVal;
  }
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing mock file ${filePath}:`, error);
  }
}

// =====================================================================================
// 1. TEMPLATES DATABASE OPERATIONS
// =====================================================================================

export async function ensureTemplateExists(templateSlug: string): Promise<void> {
  if (!isSupabaseConfigured) return;

  try {
    const { data: existing, error } = await supabaseAdmin
      .from("templates")
      .select("slug")
      .eq("slug", templateSlug)
      .maybeSingle();

    if (error) {
      console.error(`Error querying template slug "${templateSlug}":`, error);
      return;
    }

    if (!existing) {
      const localDef = TEMPLATES.find((t) => t.slug === templateSlug);
      if (localDef) {
        console.log(`Auto-seeding missing template in Supabase: ${templateSlug}`);
        const insertRecord = {
          slug: localDef.slug,
          name: localDef.name,
          description: localDef.description,
          category: localDef.category,
          religion: localDef.religion,
          language: localDef.language,
          price: localDef.price,
          thumbnail_url: localDef.thumbnailUrl,
          preview_music_url: localDef.previewMusicUrl,
          config: { fields: localDef.fields },
          is_active: true,
        };

        const { error: insertError } = await supabaseAdmin
          .from("templates")
          .insert(insertRecord);

        if (insertError) {
          console.error(`Failed to auto-seed template "${templateSlug}":`, insertError);
        } else {
          console.log(`Successfully auto-seeded template "${templateSlug}".`);
        }
      }
    }
  } catch (err) {
    console.error(`Graceful exception ensuring template "${templateSlug}" exists:`, err);
  }
}

export async function getAllTemplates(): Promise<TemplateRecord[]> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("is_active", true)
        .order("name", { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch (err) {
      console.error("Supabase error fetching templates, falling back to local definitions:", err);
    }
  }

  // Fallback to static TEMPLATES definitions
  return TEMPLATES.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
    religion: t.religion,
    language: t.language,
    price: t.price,
    thumbnail_url: t.thumbnailUrl,
    preview_music_url: t.previewMusicUrl,
    config: { fields: t.fields },
    is_active: true,
  }));
}

export async function getTemplateBySlugFromDb(slug: string): Promise<TemplateRecord | null> {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("templates")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (!error && data) {
        return data;
      }
    } catch (err) {
      console.error(`Supabase error fetching template "${slug}":`, err);
    }
  }

  const local = TEMPLATES.find((t) => t.slug === slug);
  if (!local) return null;

  return {
    slug: local.slug,
    name: local.name,
    description: local.description,
    category: local.category,
    religion: local.religion,
    language: local.language,
    price: local.price,
    thumbnail_url: local.thumbnailUrl,
    preview_music_url: local.previewMusicUrl,
    config: { fields: local.fields },
    is_active: true,
  };
}

// =====================================================================================
// 2. INVITATIONS DATABASE OPERATIONS
// =====================================================================================

export async function saveInvitation(record: InvitationRecord): Promise<InvitationRecord> {
  if (isSupabaseConfigured) {
    await ensureTemplateExists(record.template_slug);
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Supabase error saving invitation:", error);
      throw error;
    }
    return data;
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    const newRecord: InvitationRecord = {
      ...record,
      id: record.id || Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db[record.slug] = newRecord;
    writeJsonFile(MOCK_INVITATIONS_PATH, db);
    return newRecord;
  }
}

export async function getInvitationBySlug(slug: string): Promise<InvitationRecord | null> {
  if (isSupabaseConfigured) {
    // 1. Try query by id
    const { data: byId } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("id", slug)
      .maybeSingle();

    if (byId) return byId;

    // 2. Try query by slug
    const { data: bySlug } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (bySlug) return bySlug;

    // Fallback to local cache
    const localDb = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    return localDb[slug] || Object.values(localDb).find((r) => r.id === slug) || null;
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    return db[slug] || Object.values(db).find((r) => r.id === slug) || null;
  }
}

export async function getAllInvitations(): Promise<InvitationRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching all invitations:", error);
      const localDb = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
      return Object.values(localDb);
    }
    return data || [];
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    return Object.values(db);
  }
}

export async function getInvitationsByUserId(userId: string): Promise<InvitationRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Supabase error fetching invitations for user "${userId}":`, error);
      const localDb = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
      return Object.values(localDb).filter((r) => r.user_id === userId);
    }
    return data || [];
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    return Object.values(db).filter((r) => r.user_id === userId);
  }
}

export async function updateInvitation(
  slug: string,
  record: Partial<InvitationRecord>
): Promise<InvitationRecord> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .update({
        ...record,
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error updating invitation with slug "${slug}":`, error);
      throw error;
    }
    return data;
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    if (!db[slug]) {
      throw new Error(`Invitation with slug "${slug}" not found.`);
    }
    const updatedRecord: InvitationRecord = {
      ...db[slug],
      ...record,
      updated_at: new Date().toISOString(),
    };
    db[slug] = updatedRecord;
    writeJsonFile(MOCK_INVITATIONS_PATH, db);
    return updatedRecord;
  }
}

export async function upsertInvitation(record: InvitationRecord): Promise<InvitationRecord> {
  if (isSupabaseConfigured) {
    await ensureTemplateExists(record.template_slug);
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .upsert(
        {
          ...record,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      )
      .select()
      .single();

    if (error) {
      console.error("Supabase error upserting invitation:", error);
      throw error;
    }
    return data;
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    const existing = db[record.slug] || {};
    const newRecord: InvitationRecord = {
      ...existing,
      ...record,
      id: record.id || existing.id || Math.random().toString(36).substring(2, 9),
      created_at: existing.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db[record.slug] = newRecord;
    writeJsonFile(MOCK_INVITATIONS_PATH, db);
    return newRecord;
  }
}

export async function deleteInvitation(slug: string, userId?: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    let query = supabaseAdmin.from("invitations").delete().eq("slug", slug);
    if (userId) {
      query = query.eq("user_id", userId);
    }
    const { error } = await query;
    if (error) {
      console.error(`Supabase error deleting invitation "${slug}":`, error);
      throw error;
    }
    return true;
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    if (db[slug]) {
      if (userId && db[slug].user_id !== userId) {
        throw new Error("Unauthorized to delete this invitation");
      }
      delete db[slug];
      writeJsonFile(MOCK_INVITATIONS_PATH, db);
      return true;
    }
    return false;
  }
}

// =====================================================================================
// 3. PAYMENTS DATABASE OPERATIONS
// =====================================================================================

export async function savePayment(record: PaymentRecord): Promise<PaymentRecord> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .insert({
        invitation_id: record.invitation_id || null,
        invitation_slug: record.invitation_slug || null,
        user_id: record.user_id || null,
        razorpay_order_id: record.razorpay_order_id,
        razorpay_payment_id: record.razorpay_payment_id || null,
        razorpay_signature: record.razorpay_signature || null,
        amount: record.amount,
        currency: record.currency || "INR",
        status: record.status || "captured",
        metadata: record.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error saving payment record:", error);
      throw error;
    }
    return data;
  } else {
    const payments = readJsonFile<PaymentRecord[]>(MOCK_PAYMENTS_PATH, []);
    const newRecord: PaymentRecord = {
      ...record,
      id: record.id || `pay_mock_${Math.random().toString(36).substring(2, 9)}`,
      currency: record.currency || "INR",
      status: record.status || "captured",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    payments.unshift(newRecord);
    writeJsonFile(MOCK_PAYMENTS_PATH, payments);
    return newRecord;
  }
}

export async function getPaymentsByUserId(userId: string): Promise<PaymentRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Supabase error fetching payments for user "${userId}":`, error);
      const localPayments = readJsonFile<PaymentRecord[]>(MOCK_PAYMENTS_PATH, []);
      return localPayments.filter((p) => p.user_id === userId);
    }
    return data || [];
  } else {
    const payments = readJsonFile<PaymentRecord[]>(MOCK_PAYMENTS_PATH, []);
    return payments.filter((p) => p.user_id === userId);
  }
}

export async function getPaymentsByInvitationId(invitationId: string): Promise<PaymentRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .eq("invitation_id", invitationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Supabase error fetching payments for invitation "${invitationId}":`, error);
      return [];
    }
    return data || [];
  } else {
    const payments = readJsonFile<PaymentRecord[]>(MOCK_PAYMENTS_PATH, []);
    return payments.filter((p) => p.invitation_id === invitationId);
  }
}

export async function getAllPayments(): Promise<PaymentRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching all payments:", error);
      return readJsonFile<PaymentRecord[]>(MOCK_PAYMENTS_PATH, []);
    }
    return data || [];
  } else {
    return readJsonFile<PaymentRecord[]>(MOCK_PAYMENTS_PATH, []);
  }
}

// =====================================================================================
// 4. RSVPS & GUEST WISHES DATABASE OPERATIONS
// =====================================================================================

export async function saveRsvp(record: RsvpRecord): Promise<RsvpRecord> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .insert({
        invitation_id: record.invitation_id || null,
        invitation_slug: record.invitation_slug,
        name: record.name,
        email: record.email || null,
        phone: record.phone || null,
        attendance: record.attendance,
        guest_count: record.guest_count || 1,
        dietary_preferences: record.dietary_preferences || null,
        wishes: record.wishes || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error saving RSVP:", error);
      throw error;
    }
    return data;
  } else {
    const rsvps = readJsonFile<RsvpRecord[]>(MOCK_RSVPS_PATH, []);
    const newRecord: RsvpRecord = {
      ...record,
      id: record.id || Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    rsvps.unshift(newRecord);
    writeJsonFile(MOCK_RSVPS_PATH, rsvps);
    return newRecord;
  }
}

export async function getRsvpsByInvitationSlug(invitationSlug: string): Promise<RsvpRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .select("*")
      .eq("invitation_slug", invitationSlug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Supabase error fetching RSVPs for slug "${invitationSlug}":`, error);
      const localRsvps = readJsonFile<RsvpRecord[]>(MOCK_RSVPS_PATH, []);
      return localRsvps.filter((r) => r.invitation_slug === invitationSlug);
    }
    return data || [];
  } else {
    const rsvps = readJsonFile<RsvpRecord[]>(MOCK_RSVPS_PATH, []);
    return rsvps
      .filter((r) => r.invitation_slug === invitationSlug)
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }
}

export async function deleteRsvp(id: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    const { error } = await supabaseAdmin.from("rsvps").delete().eq("id", id);
    if (error) {
      console.error(`Supabase error deleting RSVP "${id}":`, error);
      throw error;
    }
    return true;
  } else {
    const rsvps = readJsonFile<RsvpRecord[]>(MOCK_RSVPS_PATH, []);
    const filtered = rsvps.filter((r) => r.id !== id);
    writeJsonFile(MOCK_RSVPS_PATH, filtered);
    return true;
  }
}

// =====================================================================================
// 5. USER PROFILES DATABASE OPERATIONS
// =====================================================================================

export async function getUserProfile(userId: string): Promise<ProfileRecord | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error fetching profile for user "${userId}":`, error);
      const profiles = readJsonFile<Record<string, ProfileRecord>>(MOCK_PROFILES_PATH, {});
      return profiles[userId] || null;
    }
    return data;
  } else {
    const profiles = readJsonFile<Record<string, ProfileRecord>>(MOCK_PROFILES_PATH, {});
    return profiles[userId] || {
      id: userId,
      email: "demo.user@varnam.com",
      full_name: "Demo User",
      role: "customer",
    };
  }
}

export async function upsertUserProfile(record: ProfileRecord): Promise<ProfileRecord> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          ...record,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select()
      .single();

    if (error) {
      console.error(`Supabase error upserting profile for user "${record.id}":`, error);
      throw error;
    }
    return data;
  } else {
    const profiles = readJsonFile<Record<string, ProfileRecord>>(MOCK_PROFILES_PATH, {});
    const updated: ProfileRecord = {
      ...profiles[record.id],
      ...record,
      updated_at: new Date().toISOString(),
    };
    profiles[record.id] = updated;
    writeJsonFile(MOCK_PROFILES_PATH, profiles);
    return updated;
  }
}

export async function getAllUsers(): Promise<ProfileRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching all profiles:", error);
      const profiles = readJsonFile<Record<string, ProfileRecord>>(MOCK_PROFILES_PATH, {});
      return Object.values(profiles);
    }
    return data || [];
  } else {
    const profiles = readJsonFile<Record<string, ProfileRecord>>(MOCK_PROFILES_PATH, {});
    return Object.values(profiles);
  }
}
