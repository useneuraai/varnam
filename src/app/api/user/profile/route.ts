import { NextRequest, NextResponse } from "next/server";
import { getUserProfile, upsertUserProfile } from "@/lib/db";
import { getUserIdFromAuthHeader } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = await getUserIdFromAuthHeader(authHeader);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or missing session" },
        { status: 401 }
      );
    }

    const profile = await getUserProfile(userId);
    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { message: error.message || "Failed to load user profile" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const userId = await getUserIdFromAuthHeader(authHeader);

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid or missing session" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { email, full_name, avatar_url, phone } = body;

    const updated = await upsertUserProfile({
      id: userId,
      email: email || "",
      full_name: full_name || undefined,
      avatar_url: avatar_url || undefined,
      phone: phone || undefined,
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      profile: updated,
    });
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { message: error.message || "Failed to update user profile" },
      { status: 500 }
    );
  }
}
