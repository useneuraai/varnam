import fs from "fs";
import path from "path";
import { supabase } from "./supabase";
import { TemplateData } from "./templates";

export interface InvitationRecord {
  template_slug: string;
  slug: string;
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
  created_at?: string;
  
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
}

const MOCK_FILE_PATH = path.join(process.cwd(), "src", "lib", "mock-invitations.json");

// Helper to ensure mock file exists and read it
function readLocalMockDb(): Record<string, InvitationRecord> {
  try {
    if (!fs.existsSync(MOCK_FILE_PATH)) {
      // Create empty file
      fs.mkdirSync(path.dirname(MOCK_FILE_PATH), { recursive: true });
      fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify({}, null, 2));
      return {};
    }
    const data = fs.readFileSync(MOCK_FILE_PATH, "utf-8");
    return JSON.parse(data || "{}");
  } catch (error) {
    console.error("Error reading local mock database file:", error);
    return {};
  }
}

// Helper to write to mock file
function writeLocalMockDb(data: Record<string, InvitationRecord>) {
  try {
    fs.mkdirSync(path.dirname(MOCK_FILE_PATH), { recursive: true });
    fs.writeFileSync(MOCK_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing local mock database file:", error);
  }
}

export async function saveInvitation(record: InvitationRecord): Promise<InvitationRecord> {
  const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  if (!isMockSupabase) {
    const { data, error } = await supabase
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
    // Save to local file cache
    const db = readLocalMockDb();
    const newRecord = {
      ...record,
      created_at: new Date().toISOString(),
    };
    db[record.slug] = newRecord;
    writeLocalMockDb(db);
    return newRecord;
  }
}

export async function getInvitationBySlug(slug: string): Promise<InvitationRecord | null> {
  const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  if (!isMockSupabase) {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error(`Supabase error fetching invitation with slug "${slug}":`, error);
      // If invitation is not found in supabase, fall back to local mock DB in case it was created locally
      const localDb = readLocalMockDb();
      return localDb[slug] || null;
    }
    return data;
  } else {
    // Read from local file cache
    const db = readLocalMockDb();
    return db[slug] || null;
  }
}

export async function getAllInvitations(): Promise<InvitationRecord[]> {
  const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  if (!isMockSupabase) {
    const { data, error } = await supabase
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching all invitations:", error);
      const localDb = readLocalMockDb();
      return Object.values(localDb);
    }
    return data;
  } else {
    const db = readLocalMockDb();
    return Object.values(db);
  }
}

export async function updateInvitation(slug: string, record: Partial<InvitationRecord>): Promise<InvitationRecord> {
  const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  if (!isMockSupabase) {
    const { data, error } = await supabase
      .from("invitations")
      .update(record)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      console.error(`Supabase error updating invitation with slug "${slug}":`, error);
      throw error;
    }
    return data;
  } else {
    const db = readLocalMockDb();
    if (!db[slug]) {
      throw new Error(`Invitation with slug "${slug}" not found.`);
    }
    const updatedRecord = {
      ...db[slug],
      ...record,
      updated_at: new Date().toISOString(),
    };
    db[slug] = updatedRecord;
    writeLocalMockDb(db);
    return updatedRecord;
  }
}

// RSVP Database Interfaces & Methods
export interface RsvpRecord {
  id?: string;
  invitation_slug: string;
  name: string;
  attendance: string; // "yes" | "no"
  guest_count: number;
  wishes: string;
  created_at?: string;
}

const MOCK_RSVP_FILE_PATH = path.join(process.cwd(), "src", "lib", "mock-rsvps.json");

function readLocalMockRsvps(): RsvpRecord[] {
  try {
    if (!fs.existsSync(MOCK_RSVP_FILE_PATH)) {
      fs.mkdirSync(path.dirname(MOCK_RSVP_FILE_PATH), { recursive: true });
      fs.writeFileSync(MOCK_RSVP_FILE_PATH, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(MOCK_RSVP_FILE_PATH, "utf-8");
    return JSON.parse(data || "[]");
  } catch (error) {
    console.error("Error reading local mock RSVPs file:", error);
    return [];
  }
}

function writeLocalMockRsvps(data: RsvpRecord[]) {
  try {
    fs.mkdirSync(path.dirname(MOCK_RSVP_FILE_PATH), { recursive: true });
    fs.writeFileSync(MOCK_RSVP_FILE_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing local mock RSVPs file:", error);
  }
}

export async function saveRsvp(record: RsvpRecord): Promise<RsvpRecord> {
  const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  if (!isMockSupabase) {
    const { data, error } = await supabase
      .from("rsvps")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Supabase error saving RSVP:", error);
      throw error;
    }
    return data;
  } else {
    const rsvps = readLocalMockRsvps();
    const newRecord: RsvpRecord = {
      ...record,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString(),
    };
    rsvps.push(newRecord);
    writeLocalMockRsvps(rsvps);
    return newRecord;
  }
}

export async function getRsvpsByInvitationSlug(invitationSlug: string): Promise<RsvpRecord[]> {
  const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  if (!isMockSupabase) {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .eq("invitation_slug", invitationSlug)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Supabase error fetching RSVPs for slug "${invitationSlug}":`, error);
      // Fallback to local files
      const localRsvps = readLocalMockRsvps();
      return localRsvps.filter(r => r.invitation_slug === invitationSlug);
    }
    return data;
  } else {
    const rsvps = readLocalMockRsvps();
    // Filter matching slug and sort descending by date/time
    return rsvps
      .filter(r => r.invitation_slug === invitationSlug)
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  }
}

