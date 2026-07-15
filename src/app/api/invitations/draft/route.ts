import { NextRequest, NextResponse } from "next/server";
import { upsertInvitation } from "@/lib/db";
import { getTemplateBySlug } from "@/lib/templates";
import { getUserIdFromAuthHeader } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, templateSlug, formData } = body;

    if (!slug || !templateSlug || !formData) {
      return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
    }

    const template = getTemplateBySlug(templateSlug);
    if (!template) {
      return NextResponse.json({ message: "Invalid template reference" }, { status: 400 });
    }

    // Get authenticated user if token is present
    const authHeader = req.headers.get("Authorization");
    const userId = await getUserIdFromAuthHeader(authHeader);

    const record = await upsertInvitation({
      template_slug: template.slug,
      slug: slug,
      user_id: userId,
      bride_name: formData.bride_name || "",
      groom_name: formData.groom_name || "",
      wedding_date: formData.wedding_date || new Date().toISOString(),
      wedding_venue: formData.wedding_venue || "",
      quote: formData.quote || undefined,
      family_names: formData.family_names || undefined,
      rsvp_phone: formData.rsvp_phone || undefined,
      custom_message: formData.custom_message || undefined,
      music_url: formData.music_url || template.previewMusicUrl,
      is_paid: false, // It is a draft!

      // Features
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
      gmap_coordinates: formData.gmap_coordinates || undefined,
      music_enabled: formData.music_enabled || "yes",
      slideshow_enabled: formData.slideshow_enabled || "yes",
      dress_code_enabled: formData.dress_code_enabled || "yes",
      transport_enabled: formData.transport_enabled || "yes",
      custom_sections: formData.custom_sections || "",
    });

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully.",
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
