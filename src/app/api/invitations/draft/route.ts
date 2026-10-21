import { NextRequest, NextResponse } from "next/server";
import { upsertInvitation, getInvitationBySlug } from "@/lib/db";
import { getTemplateBySlug } from "@/lib/templates";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, templateSlug, formData, revision } = body;

    if (!slug || !templateSlug || !formData) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const template = getTemplateBySlug(templateSlug);
    if (!template) {
      return NextResponse.json({ message: "Invalid template reference" }, { status: 400 });
    }

    // Require authentication for saving drafts
    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);

    // If Supabase is not configured, support local mock session fallback
    if (!userId && !isSupabaseConfigured) {
      userId = "mock-user-123";
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Authentication required. Please log in to save your draft." },
        { status: 401 }
      );
    }

    // If invitation already exists, enforce ownership and revision check
    const existing = await getInvitationBySlug(slug);
    if (existing) {
      if (existing.user_id && existing.user_id !== "mock-user-123" && existing.user_id !== userId) {
        return NextResponse.json(
          { message: "Forbidden: You do not own this invitation draft" },
          { status: 403 }
        );
      }
      // Concurrency check: prevent older client request from overwriting newer server revision
      if (typeof revision === "number" && typeof existing.revision === "number") {
        if (revision < existing.revision) {
          return NextResponse.json(
            {
              message: "Conflict: Newer changes exist on server. Please refresh.",
              serverRevision: existing.revision,
              record: existing,
            },
            { status: 409 }
          );
        }
      }
    }

    const newRevision = existing ? (existing.revision || 1) + 1 : 1;

    const record = await upsertInvitation({
      id: existing?.id,
      template_slug: template.slug,
      slug: slug,
      user_id: userId,
      status: existing?.status === "paid" || existing?.status === "published" ? existing.status : "draft",
      is_paid: existing ? existing.is_paid : false,
      revision: newRevision,
      bride_name: formData.bride_name || "",
      groom_name: formData.groom_name || "",
      wedding_date: formData.wedding_date || new Date().toISOString(),
      wedding_venue: formData.wedding_venue || "",
      quote: formData.quote || undefined,
      family_names: formData.family_names || undefined,
      rsvp_phone: formData.rsvp_phone || undefined,
      custom_message: formData.custom_message || undefined,
      music_url: formData.music_url || template.previewMusicUrl,

      // Licensed Event Features
      bg_image_url: formData.bg_image_url || undefined,
      slideshow_images: formData.slideshow_images || undefined,
      dress_code: formData.dress_code || undefined,
      transport_info: formData.transport_info || undefined,
      scratch_enabled: formData.scratch_enabled || "no",
      sangeet_enabled: formData.sangeet_enabled || "no",
      sangeet_date: formData.sangeet_date || undefined,
      sangeet_venue: formData.sangeet_venue || undefined,
      reception_date: formData.reception_date || undefined,
      reception_venue: formData.reception_venue || undefined,
      wedding_events: formData.wedding_events || undefined,
      gmap_coordinates: formData.gmap_coordinates || undefined,
      music_enabled: formData.music_enabled || "yes",
      slideshow_enabled: formData.slideshow_enabled || "yes",
      dress_code_enabled: formData.dress_code_enabled || "yes",
      transport_enabled: formData.transport_enabled || "yes",
      custom_sections: formData.custom_sections || "",
      content_json: formData,
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully.",
      revision: record.revision,
      record,
    });
  } catch (error: any) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      { message: error.message || "Failed to save draft" },
      { status: 500 }
    );
  }
}
