import { NextRequest, NextResponse } from "next/server";
import { getInvitationsByUserId } from "@/lib/db";
import { getUserIdFromAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = await getUserIdFromAuthHeader(authHeader);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: Invalid or missing session" }, { status: 401 });
    }

    const invitations = await getInvitationsByUserId(userId);
    return NextResponse.json({ success: true, invitations });
  } catch (error: any) {
    console.error("Error fetching user invitations:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
