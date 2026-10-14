import { NextRequest, NextResponse } from "next/server";
import { getRsvpsByInvitationSlug, getInvitationBySlug } from "@/lib/db";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ message: "Missing invitation slug" }, { status: 400 });
    }

    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      if (authHeader === "Bearer mock-user-token") {
        userId = "mock-user-123";
      }
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in as owner to export RSVPs" },
        { status: 401 }
      );
    }

    const invitation = await getInvitationBySlug(slug);
    if (!invitation || invitation.deleted_at) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    if (invitation.user_id && invitation.user_id !== userId) {
      return NextResponse.json(
        { message: "Forbidden: You do not own this invitation" },
        { status: 403 }
      );
    }

    const rsvps = await getRsvpsByInvitationSlug(slug, userId);

    // Escape CSV cell values safely
    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const headers = [
      "Guest Name",
      "Attendance",
      "Guest Count",
      "Contact Info",
      "Dietary Preferences",
      "Wedding Wishes / Message",
      "Submitted At",
    ];

    const rows = rsvps.map((r) => [
      escapeCsv(r.guest_name || r.name),
      escapeCsv(r.attendance_status || r.attendance),
      escapeCsv(r.guest_count),
      escapeCsv(r.guest_contact || r.phone || r.email || ""),
      escapeCsv(r.dietary_preferences || ""),
      escapeCsv(r.wishes || r.message || ""),
      escapeCsv(r.created_at ? new Date(r.created_at).toLocaleString() : ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="rsvps_${slug}_${Date.now()}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("Error exporting RSVPs CSV:", error);
    return NextResponse.json(
      { message: error.message || "Failed to export RSVPs" },
      { status: 500 }
    );
  }
}
