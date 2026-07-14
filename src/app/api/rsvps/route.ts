import { NextRequest, NextResponse } from "next/server";
import { saveRsvp, getRsvpsByInvitationSlug } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ message: "Missing invitation slug" }, { status: 400 });
    }

    const rsvps = await getRsvpsByInvitationSlug(slug);
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
    const { invitationSlug, name, attendance, guestCount, wishes } = body;

    if (!invitationSlug || !name || !attendance) {
      return NextResponse.json({ message: "Missing required RSVP parameters" }, { status: 400 });
    }

    const saved = await saveRsvp({
      invitation_slug: invitationSlug,
      name,
      attendance,
      guest_count: Number(guestCount) || 1,
      wishes: wishes || "",
    });

    return NextResponse.json({
      success: true,
      message: "RSVP registered successfully.",
      rsvp: saved,
    });
  } catch (error: any) {
    console.error("Error saving RSVP:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
