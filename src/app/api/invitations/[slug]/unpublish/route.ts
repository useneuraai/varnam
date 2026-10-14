import { NextRequest, NextResponse } from "next/server";
import { getInvitationBySlug, unpublishInvitation } from "@/lib/db";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ slug: string }> }
) {
  try {
    const params = await props.params;
    const slug = params.slug;

    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      userId = "mock-user-123";
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: Please log in" }, { status: 401 });
    }

    const invitation = await getInvitationBySlug(slug);
    if (!invitation || invitation.deleted_at) {
      return NextResponse.json({ message: "Invitation not found" }, { status: 404 });
    }

    if (invitation.user_id && invitation.user_id !== userId) {
      return NextResponse.json({ message: "Forbidden: You do not own this invitation" }, { status: 403 });
    }

    const unpublished = await unpublishInvitation(slug, userId);

    return NextResponse.json({
      success: true,
      message: "Invitation unpublished. Public access has been disabled.",
      slug: unpublished.slug,
      status: unpublished.status,
    });
  } catch (error: any) {
    console.error("Error unpublishing invitation:", error);
    return NextResponse.json(
      { message: error.message || "Failed to unpublish invitation" },
      { status: 500 }
    );
  }
}
