import { NextRequest, NextResponse } from "next/server";
import { saveRsvp, getRsvpsByInvitationSlug, deleteRsvp, getInvitationBySlug } from "@/lib/db";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const identifier = searchParams.get("slug") || searchParams.get("id") || searchParams.get("template_id");

    if (!identifier) {
      return NextResponse.json({ message: "Missing invitation slug or template ID" }, { status: 400 });
    }

    // Enforce Owner Authentication: Only the owner can view RSVPs
    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      if (authHeader === "Bearer mock-user-token") {
        userId = "mock-user-123";
      }
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in as the invitation owner to view RSVPs" },
        { status: 401 }
      );
    }

    const invitation = await getInvitationBySlug(identifier);
    if (!invitation || invitation.deleted_at) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    if (invitation.user_id && invitation.user_id !== userId) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this invitation's RSVP records" },
        { status: 403 }
      );
    }

    const rsvps = await getRsvpsByInvitationSlug(invitation.slug, userId);
    return NextResponse.json(rsvps);
  } catch (error: any) {
    console.error("Error fetching RSVPs:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      invitationSlug,
      name,
      guest_name,
      attendance,
      attendance_status,
      guestCount,
      guest_count,
      phone,
      guest_contact,
      email,
      dietary_preferences,
      wishes,
      message,
    } = body;

    const finalSlug = invitationSlug;
    const finalName = (guest_name || name || "").trim();
    const rawAttendance = attendance_status || attendance || "attending";
    const finalAttendance =
      rawAttendance === "yes" || rawAttendance === "attending"
        ? "attending"
        : rawAttendance === "no" || rawAttendance === "not_attending"
        ? "not_attending"
        : "undecided";

    const parsedCount = Math.max(1, Math.min(10, Number(guest_count || guestCount) || 1));
    const finalContact = (guest_contact || phone || email || "").trim().slice(0, 50);
    const finalMessage = (message || wishes || "").trim().slice(0, 500);
    const finalDiet = (dietary_preferences || "").trim().slice(0, 100);

    if (!finalSlug || !finalName) {
      return NextResponse.json({ message: "Guest name and invitation slug are required" }, { status: 400 });
    }

    // Verify parent invitation exists and is published + paid
    const invitation = await getInvitationBySlug(finalSlug);
    if (!invitation || invitation.deleted_at) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    if (invitation.status !== "published" || !invitation.is_paid) {
      return NextResponse.json(
        { message: "This invitation is not published or active for RSVP submissions." },
        { status: 403 }
      );
    }

    // Client IP for abuse prevention / audit
    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";

    const saved = await saveRsvp({
      invitation_id: invitation.id,
      invitation_slug: finalSlug,
      guest_name: finalName,
      name: finalName,
      attendance_status: finalAttendance,
      attendance: finalAttendance === "attending" ? "yes" : "no",
      guest_count: parsedCount,
      guest_contact: finalContact || undefined,
      phone: finalContact || undefined,
      message: finalMessage || undefined,
      wishes: finalMessage || undefined,
      dietary_preferences: finalDiet || undefined,
      ip_address: ipAddress,
    });

    return NextResponse.json({
      success: true,
      message: "RSVP registered successfully. Thank you for your blessings!",
      rsvp: {
        id: saved.id,
        guest_name: saved.guest_name,
        attendance_status: saved.attendance_status,
        guest_count: saved.guest_count,
        created_at: saved.created_at,
      },
    });
  } catch (error: any) {
    console.error("Error saving RSVP:", error);
    return NextResponse.json(
      { message: error.message || "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Missing RSVP ID" }, { status: 400 });
    }

    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      userId = "mock-user-123";
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: Please log in" }, { status: 401 });
    }

    await deleteRsvp(id, userId);
    return NextResponse.json({ success: true, message: "RSVP deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting RSVP:", error);
    return NextResponse.json(
      { message: error.message || "Failed to delete RSVP" },
      { status: 500 }
    );
  }
}
