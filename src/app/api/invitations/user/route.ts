import { NextRequest, NextResponse } from "next/server";
import { getInvitationsByUserId } from "@/lib/db";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    let userId = "mock-user-123";
    
    const isMockSupabase = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

    if (!isMockSupabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return NextResponse.json({ message: "Invalid session" }, { status: 401 });
      }
      userId = user.id;
    }

    const invitations = await getInvitationsByUserId(userId);
    return NextResponse.json({ success: true, invitations });
  } catch (error: any) {
    console.error("Error fetching user invitations:", error);
    return NextResponse.json({ message: error.message || "Server error" }, { status: 500 });
  }
}
