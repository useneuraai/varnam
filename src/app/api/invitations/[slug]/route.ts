import { NextRequest, NextResponse } from "next/server";
import { getInvitationBySlug, getPublicInvitationBySlug, updateInvitation, deleteInvitation } from "@/lib/db";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const slug = params.slug;

    // Check if caller provides authentication
    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      // In offline mock mode without auth header, allow mock user if set
      if (authHeader === "Bearer mock-user-token") {
        userId = "mock-user-123";
      }
    }

    const invitation = await getInvitationBySlug(slug);
    if (!invitation || invitation.deleted_at) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    // If caller is the authenticated owner, return full record
    if (userId && invitation.user_id === userId) {
      return NextResponse.json(invitation);
    }

    // Public guest access: Must be published and paid
    if (invitation.status !== "published" || !invitation.is_paid) {
      return NextResponse.json(
        { message: "This invitation is private, unpublished, or pending payment." },
        { status: 404 }
      );
    }

    const publicInvitation = await getPublicInvitationBySlug(slug);
    if (!publicInvitation) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    return NextResponse.json(publicInvitation);
  } catch (error: any) {
    console.error("Error fetching invitation:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const slug = params.slug;
    const body = await req.json();
    const { formData, revision } = body;

    if (!formData) {
      return NextResponse.json({ message: "Missing update data" }, { status: 400 });
    }

    const invitation = await getInvitationBySlug(slug);
    if (!invitation || invitation.deleted_at) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    // Check authentication and ownership
    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      userId = "mock-user-123";
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: Please log in" }, { status: 401 });
    }

    if (invitation.user_id && invitation.user_id !== userId) {
      return NextResponse.json({ message: "Forbidden: You do not own this invitation" }, { status: 403 });
    }

    // Concurrency check: prevent older client overwrites
    if (typeof revision === "number" && typeof invitation.revision === "number") {
      if (revision < invitation.revision) {
        return NextResponse.json(
          {
            message: "Conflict: Newer changes exist on server. Please refresh.",
            serverRevision: invitation.revision,
          },
          { status: 409 }
        );
      }
    }

    // Gating check: "Edit details freely until 5 days after event completes"
    const now = new Date();
    const eventDate = new Date(invitation.wedding_date);
    const archiveLimitDate = new Date(eventDate.getTime() + 5 * 24 * 60 * 60 * 1000); // 5 days later

    if (now > archiveLimitDate) {
      return NextResponse.json(
        { message: "This invitation is archived and cannot be edited. The license has expired." },
        { status: 403 }
      );
    }

    // Save/update the fields
    const updated = await updateInvitation(slug, {
      bride_name: formData.bride_name,
      groom_name: formData.groom_name,
      wedding_date: formData.wedding_date,
      wedding_venue: formData.wedding_venue,
      quote: formData.quote || undefined,
      family_names: formData.family_names || undefined,
      rsvp_phone: formData.rsvp_phone || undefined,
      custom_message: formData.custom_message || undefined,
      music_url: formData.music_url || invitation.music_url,

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
      gmap_coordinates: formData.gmap_coordinates || undefined,
      music_enabled: formData.music_enabled || "yes",
      slideshow_enabled: formData.slideshow_enabled || "yes",
      dress_code_enabled: formData.dress_code_enabled || "yes",
      transport_enabled: formData.transport_enabled || "yes",
      custom_sections: formData.custom_sections || "",
      content_json: formData,
      revision: (invitation.revision || 1) + 1,
    });

    return NextResponse.json({
      success: true,
      message: "Invitation updated successfully.",
      revision: updated.revision,
      invitation: updated,
    });
  } catch (error: any) {
    console.error("Error updating invitation:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const slug = params.slug;

    const invitation = await getInvitationBySlug(slug);
    if (!invitation) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      userId = "mock-user-123";
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: Please log in" }, { status: 401 });
    }

    if (invitation.user_id && invitation.user_id !== userId) {
      return NextResponse.json({ message: "Forbidden: You do not own this invitation" }, { status: 403 });
    }

    await deleteInvitation(slug, userId);
    return NextResponse.json({ success: true, message: "Invitation removed successfully." });
  } catch (error: any) {
    console.error("Error deleting invitation:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
