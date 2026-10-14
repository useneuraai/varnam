import fs from "fs";
import path from "path";
import { supabase, supabaseAdmin, isSupabaseConfigured } from "./supabase";
import { TEMPLATES } from "./templates";

// =====================================================================================
// DATA TYPES & INTERFACES (5 CORE RELATIONAL ENTITIES)
// =====================================================================================

export interface ProfileRecord {
  id: string; // references auth.users(id)
  email: string;
  display_name?: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role?: string; // "customer" | "admin"
  created_at?: string;
  updated_at?: string;
}

export interface TemplateRecord {
  slug: string;
  name: string;
  description?: string;
  category: string;
  religion: string;
  language: string;
  price: number;
  price_inr?: number;
  thumbnail_url?: string;
  preview_music_url?: string;
  config?: Record<string, any>;
  is_active?: boolean;
}

export type InvitationStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "published"
  | "unpublished"
  | "removed";

export interface InvitationRecord {
  id?: string;
  user_id?: string;
  template_slug: string;
  title?: string;
  slug: string;
  status?: InvitationStatus;
  content_json?: Record<string, any>;
  template_version?: string;
  revision?: number;
  is_paid: boolean;
  payment_id?: string;
  order_id?: string;
  published_at?: string | null;
  deleted_at?: string | null;

  // Relational fields for fast querying, display & templates
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  wedding_venue: string;
  quote?: string;
  family_names?: string;
  rsvp_phone?: string;
  custom_message?: string;
  music_url?: string;
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

export interface OrderRecord {
  id?: string;
  user_id?: string;
  invitation_id?: string;
  amount_inr: number;
  currency: string;
  status: "created" | "pending" | "paid" | "failed" | "cancelled" | "refunded";
  payment_provider: string; // 'razorpay'
  provider_order_id: string;
  provider_payment_id?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface PaymentRecord {
  id?: string;
  order_id?: string;
  invitation_id?: string;
  invitation_slug?: string;
  user_id?: string;
  provider?: string;
  provider_order_id?: string;
  provider_payment_id?: string;
  provider_signature?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  amount_inr?: number;
  amount?: number; // backwards compatibility
  currency?: string;
  status: string; // "captured" | "pending" | "failed"
  verified_at?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface RsvpRecord {
  id?: string;
  invitation_id?: string;
  invitation_slug: string;
  guest_name?: string;
  name?: string; // backwards compatibility
  guest_contact?: string;
  phone?: string; // backwards compatibility
  email?: string;
  attendance_status?: "attending" | "not_attending" | "undecided";
  attendance?: string; // backwards compatibility "yes" | "no"
  guest_count: number;
  wishes?: string; // Guest wedding wishes & blessings message directly in rsvps!
  message?: string; // backwards compatibility alias
  dietary_preferences?: string;
  ip_address?: string;
  created_at?: string;
  updated_at?: string;
}

// =====================================================================================
// LOCAL MOCK STORAGE HELPERS (FOR DEV / OFFLINE FALLBACK)
// =====================================================================================

const MOCK_INVITATIONS_PATH = path.join(process.cwd(), "src", "lib", "mock-invitations.json");
const MOCK_ORDERS_PATH = path.join(process.cwd(), "src", "lib", "mock-orders.json");
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
// 1. TEMPLATES (CODE-BASED CONFIGURATION - NO DB TABLE NEEDED)
// =====================================================================================

export async function ensureTemplateExists(_templateSlug: string): Promise<void> {
  // No-op: Templates are managed entirely in code via @/lib/templates.ts
}

export async function getAllTemplates(): Promise<TemplateRecord[]> {
  return TEMPLATES.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    category: t.category,
    religion: t.religion,
    language: t.language,
    price: t.price,
    price_inr: t.price,
    thumbnail_url: t.thumbnailUrl,
    preview_music_url: t.previewMusicUrl,
    config: { fields: t.fields },
    is_active: true,
  }));
}

export async function getTemplateBySlugFromDb(slug: string): Promise<TemplateRecord | null> {
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
    price_inr: local.price,
    thumbnail_url: local.thumbnailUrl,
    preview_music_url: local.previewMusicUrl,
    config: { fields: local.fields },
    is_active: true,
  };
}

// =====================================================================================
// 2. INVITATIONS DATABASE OPERATIONS
// =====================================================================================

function buildContentJson(record: Partial<InvitationRecord>): Record<string, any> {
  if (record.content_json && Object.keys(record.content_json).length > 0) {
    return record.content_json;
  }
  return {
    bride_name: record.bride_name,
    groom_name: record.groom_name,
    wedding_date: record.wedding_date,
    wedding_venue: record.wedding_venue,
    quote: record.quote,
    family_names: record.family_names,
    rsvp_phone: record.rsvp_phone,
    custom_message: record.custom_message,
    music_url: record.music_url,
    bg_image_url: record.bg_image_url,
    slideshow_images: record.slideshow_images,
    dress_code: record.dress_code,
    transport_info: record.transport_info,
    scratch_enabled: record.scratch_enabled,
    sangeet_enabled: record.sangeet_enabled,
    sangeet_date: record.sangeet_date,
    sangeet_venue: record.sangeet_venue,
    reception_date: record.reception_date,
    reception_venue: record.reception_venue,
    gmap_coordinates: record.gmap_coordinates,
    music_enabled: record.music_enabled,
    slideshow_enabled: record.slideshow_enabled,
    dress_code_enabled: record.dress_code_enabled,
    transport_enabled: record.transport_enabled,
    custom_sections: record.custom_sections,
  };
}

export async function saveInvitation(record: InvitationRecord): Promise<InvitationRecord> {
  const content_json = buildContentJson(record);
  const payload = {
    ...record,
    status: record.status || "draft",
    content_json,
    revision: record.revision || 1,
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .insert(payload)
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
      ...payload,
      id: record.id || `inv_${Math.random().toString(36).substring(2, 10)}`,
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
    // 1. Query by ID
    const { data: byId } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("id", slug)
      .is("deleted_at", null)
      .maybeSingle();

    if (byId) return byId;

    // 2. Query by slug
    const { data: bySlug } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .is("deleted_at", null)
      .maybeSingle();

    if (bySlug) return bySlug;

    // Fallback to local cache
    const localDb = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    const match = localDb[slug] || Object.values(localDb).find((r) => r.id === slug);
    if (match && !match.deleted_at) return match;
    return null;
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    const match = db[slug] || Object.values(db).find((r) => r.id === slug);
    if (match && !match.deleted_at) return match;
    return null;
  }
}

/**
 * Public Invitation Reader:
 * Returns sanitized invitation ONLY if published, paid, and not deleted.
 * Strips all sensitive fields (user_id, payment_id, order_id).
 */
export async function getPublicInvitationBySlug(slug: string): Promise<Partial<InvitationRecord> | null> {
  const inv = await getInvitationBySlug(slug);
  if (!inv) return null;

  if (inv.status !== "published" || !inv.is_paid || inv.deleted_at) {
    return null;
  }

  const {
    user_id,
    payment_id,
    order_id,
    deleted_at,
    ...publicSafeInvitation
  } = inv;

  return publicSafeInvitation;
}

export async function getInvitationsByUserId(userId: string): Promise<InvitationRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Supabase error fetching invitations for user "${userId}":`, error);
      const localDb = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
      return Object.values(localDb).filter((r) => r.user_id === userId && !r.deleted_at);
    }
    return data || [];
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    return Object.values(db).filter((r) => r.user_id === userId && !r.deleted_at);
  }
}

export async function getAllInvitations(): Promise<InvitationRecord[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching all invitations:", error);
      const localDb = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
      return Object.values(localDb).filter((r) => !r.deleted_at);
    }
    return data || [];
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    return Object.values(db).filter((r) => !r.deleted_at);
  }
}

export async function updateInvitation(
  slug: string,
  record: Partial<InvitationRecord>
): Promise<InvitationRecord> {
  const content_json = buildContentJson(record);
  const updatePayload = {
    ...record,
    content_json,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .update(updatePayload)
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
    const currentRevision = db[slug].revision || 1;
    const updatedRecord: InvitationRecord = {
      ...db[slug],
      ...updatePayload,
      revision: currentRevision + 1,
      updated_at: new Date().toISOString(),
    };
    db[slug] = updatedRecord;
    writeJsonFile(MOCK_INVITATIONS_PATH, db);
    return updatedRecord;
  }
}

export async function upsertInvitation(record: InvitationRecord): Promise<InvitationRecord> {
  const content_json = buildContentJson(record);
  const payload = {
    ...record,
    status: record.status || "draft",
    content_json,
    updated_at: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("invitations")
      .upsert(payload, { onConflict: "slug" })
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
    const currentRevision = (existing.revision || 0) + 1;
    const newRecord: InvitationRecord = {
      ...existing,
      ...payload,
      id: record.id || existing.id || `inv_${Math.random().toString(36).substring(2, 10)}`,
      revision: currentRevision,
      created_at: existing.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    db[record.slug] = newRecord;
    writeJsonFile(MOCK_INVITATIONS_PATH, db);
    return newRecord;
  }
}

export async function publishInvitation(slug: string, userId: string): Promise<InvitationRecord> {
  const inv = await getInvitationBySlug(slug);
  if (!inv) {
    throw new Error("Invitation not found");
  }
  if (inv.user_id && inv.user_id !== userId) {
    throw new Error("Unauthorized to publish this invitation");
  }
  if (!inv.is_paid) {
    throw new Error("Cannot publish unpaid invitation. Verified payment is required.");
  }

  return updateInvitation(slug, {
    status: "published",
    published_at: new Date().toISOString(),
  });
}

export async function unpublishInvitation(slug: string, userId: string): Promise<InvitationRecord> {
  const inv = await getInvitationBySlug(slug);
  if (!inv) {
    throw new Error("Invitation not found");
  }
  if (inv.user_id && inv.user_id !== userId) {
    throw new Error("Unauthorized to unpublish this invitation");
  }

  return updateInvitation(slug, {
    status: "unpublished",
  });
}

export async function deleteInvitation(slug: string, userId?: string): Promise<boolean> {
  const inv = await getInvitationBySlug(slug);
  if (!inv) return true;

  if (userId && inv.user_id && inv.user_id !== userId) {
    throw new Error("Unauthorized to delete this invitation");
  }

  if (isSupabaseConfigured) {
    // Soft delete: mark as removed & set deleted_at
    const { error } = await supabaseAdmin
      .from("invitations")
      .update({
        status: "removed",
        deleted_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    if (error) {
      console.error(`Supabase error soft-deleting invitation "${slug}":`, error);
      throw error;
    }

    // Clean up RSVPs associated with this invitation
    if (inv.id) {
      await supabaseAdmin.from("rsvps").delete().eq("invitation_id", inv.id);
    }
    await supabaseAdmin.from("rsvps").delete().eq("invitation_slug", slug);

    return true;
  } else {
    const db = readJsonFile<Record<string, InvitationRecord>>(MOCK_INVITATIONS_PATH, {});
    if (db[slug]) {
      db[slug].status = "removed";
      db[slug].deleted_at = new Date().toISOString();
      writeJsonFile(MOCK_INVITATIONS_PATH, db);
    }

    // Clean up mock RSVPs
    const rsvps = readJsonFile<RsvpRecord[]>(MOCK_RSVPS_PATH, []);
    const filteredRsvps = rsvps.filter((r) => r.invitation_slug !== slug);
    writeJsonFile(MOCK_RSVPS_PATH, filteredRsvps);

    return true;
  }
}

// =====================================================================================
// 3. ORDERS & PAYMENTS DATABASE OPERATIONS
// =====================================================================================

export async function createOrder(order: OrderRecord): Promise<OrderRecord> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: order.user_id || null,
        invitation_id: order.invitation_id || null,
        amount_inr: order.amount_inr,
        currency: order.currency || "INR",
        status: order.status || "created",
        payment_provider: order.payment_provider || "razorpay",
        provider_order_id: order.provider_order_id,
        provider_payment_id: order.provider_payment_id || null,
        metadata: order.metadata || {},
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error creating order:", error);
      throw error;
    }
    return data;
  } else {
    const orders = readJsonFile<OrderRecord[]>(MOCK_ORDERS_PATH, []);
    const newRecord: OrderRecord = {
      ...order,
      id: order.id || `ord_${Math.random().toString(36).substring(2, 10)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    orders.unshift(newRecord);
    writeJsonFile(MOCK_ORDERS_PATH, orders);
    return newRecord;
  }
}

export async function getOrderByProviderOrderId(providerOrderId: string): Promise<OrderRecord | null> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .eq("provider_order_id", providerOrderId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } else {
    const orders = readJsonFile<OrderRecord[]>(MOCK_ORDERS_PATH, []);
    return orders.find((o) => o.provider_order_id === providerOrderId) || null;
  }
}

export async function updateOrderStatus(
  providerOrderId: string,
  status: OrderRecord["status"],
  providerPaymentId?: string
): Promise<void> {
  if (isSupabaseConfigured) {
    const updatePayload: Record<string, any> = {
      status,
      updated_at: new Date().toISOString(),
    };
    if (providerPaymentId) {
      updatePayload.provider_payment_id = providerPaymentId;
    }

    await supabaseAdmin
      .from("orders")
      .update(updatePayload)
      .eq("provider_order_id", providerOrderId);
  } else {
    const orders = readJsonFile<OrderRecord[]>(MOCK_ORDERS_PATH, []);
    const idx = orders.findIndex((o) => o.provider_order_id === providerOrderId);
    if (idx !== -1) {
      orders[idx].status = status;
      if (providerPaymentId) orders[idx].provider_payment_id = providerPaymentId;
      orders[idx].updated_at = new Date().toISOString();
      writeJsonFile(MOCK_ORDERS_PATH, orders);
    }
  }
}

export async function savePayment(record: PaymentRecord): Promise<PaymentRecord> {
  const amount = record.amount_inr || record.amount || 0;
  const orderId = record.provider_order_id || record.razorpay_order_id || "";
  const paymentId = record.provider_payment_id || record.razorpay_payment_id || `pay_${Date.now()}`;
  const signature = record.provider_signature || record.razorpay_signature || null;

  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .insert({
        order_id: record.order_id || null,
        invitation_id: record.invitation_id || null,
        invitation_slug: record.invitation_slug || null,
        user_id: record.user_id || null,
        provider: record.provider || "razorpay",
        provider_order_id: orderId,
        provider_payment_id: paymentId,
        provider_signature: signature,
        amount_inr: amount,
        currency: record.currency || "INR",
        status: record.status || "captured",
        verified_at: record.verified_at || new Date().toISOString(),
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
      id: record.id || `pay_${Math.random().toString(36).substring(2, 10)}`,
      provider_order_id: orderId,
      provider_payment_id: paymentId,
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      amount_inr: amount,
      amount,
      currency: record.currency || "INR",
      status: record.status || "captured",
      verified_at: record.verified_at || new Date().toISOString(),
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

export async function getPaymentByProviderPaymentId(paymentId: string): Promise<PaymentRecord | null> {
  if (isSupabaseConfigured) {
    const { data } = await supabaseAdmin
      .from("payments")
      .select("*")
      .or(`provider_payment_id.eq.${paymentId},razorpay_payment_id.eq.${paymentId}`)
      .maybeSingle();
    return data || null;
  } else {
    const payments = readJsonFile<PaymentRecord[]>(MOCK_PAYMENTS_PATH, []);
    return payments.find((p) => p.provider_payment_id === paymentId || p.razorpay_payment_id === paymentId) || null;
  }
}

// =====================================================================================
// 4. RSVPS & GUEST WISHES (STORED DIRECTLY IN RSVPS TABLE)
// =====================================================================================

export async function saveRsvp(record: RsvpRecord): Promise<RsvpRecord> {
  const guestName = record.guest_name || record.name || "Guest";
  const attendanceStatus = record.attendance_status || (record.attendance === "no" ? "not_attending" : "attending");
  const guestContact = record.guest_contact || record.phone || record.email || "";
  const wishesMessage = record.wishes || record.message || "";

  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .insert({
        invitation_id: record.invitation_id || null,
        invitation_slug: record.invitation_slug,
        guest_name: guestName,
        guest_contact: guestContact || null,
        attendance_status: attendanceStatus,
        guest_count: record.guest_count || 1,
        wishes: wishesMessage || null,
        message: wishesMessage || null,
        dietary_preferences: record.dietary_preferences || null,
        ip_address: record.ip_address || null,
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
      id: record.id || `rsvp_${Math.random().toString(36).substring(2, 10)}`,
      guest_name: guestName,
      name: guestName,
      attendance_status: attendanceStatus,
      attendance: attendanceStatus === "attending" ? "yes" : "no",
      guest_contact: guestContact,
      phone: guestContact,
      wishes: wishesMessage,
      message: wishesMessage,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    rsvps.unshift(newRecord);
    writeJsonFile(MOCK_RSVPS_PATH, rsvps);

    return newRecord;
  }
}

export async function getRsvpsByInvitationSlug(
  invitationSlug: string,
  requesterUserId?: string
): Promise<RsvpRecord[]> {
  if (requesterUserId) {
    const inv = await getInvitationBySlug(invitationSlug);
    if (!inv || (inv.user_id && inv.user_id !== requesterUserId)) {
      throw new Error("Unauthorized: You do not own this invitation's RSVPs");
    }
  }

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

export async function deleteRsvp(id: string, requesterUserId?: string): Promise<boolean> {
  if (isSupabaseConfigured) {
    if (requesterUserId) {
      const { data: rsvp } = await supabaseAdmin
        .from("rsvps")
        .select("invitation_slug")
        .eq("id", id)
        .maybeSingle();

      if (rsvp?.invitation_slug) {
        const inv = await getInvitationBySlug(rsvp.invitation_slug);
        if (inv?.user_id && inv.user_id !== requesterUserId) {
          throw new Error("Unauthorized to delete this RSVP");
        }
      }
    }

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

/**
 * Public Wishes Reader:
 * Pulls guest blessings directly from the `rsvps` table (columns `wishes` / `message`).
 * Strips phone, email, and guest counts to protect guest privacy.
 */
export async function getPublicWishes(
  invitationSlug: string
): Promise<{ guest_name: string; message: string; created_at?: string }[]> {
  if (isSupabaseConfigured) {
    const { data, error } = await supabaseAdmin
      .from("rsvps")
      .select("guest_name, wishes, message, created_at")
      .eq("invitation_slug", invitationSlug)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      return data
        .filter((r) => (r.wishes && r.wishes.trim()) || (r.message && r.message.trim()))
        .map((r) => ({
          guest_name: r.guest_name,
          message: (r.wishes || r.message || "").trim(),
          created_at: r.created_at,
        }));
    }
  }

  // Fallback to local mock RSVPs
  const rsvps = readJsonFile<RsvpRecord[]>(MOCK_RSVPS_PATH, []);
  return rsvps
    .filter((r) => r.invitation_slug === invitationSlug && ((r.wishes && r.wishes.trim()) || (r.message && r.message.trim())))
    .map((r) => ({
      guest_name: r.guest_name || r.name || "Guest",
      message: ((r.wishes || r.message) as string).trim(),
      created_at: r.created_at,
    }));
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
