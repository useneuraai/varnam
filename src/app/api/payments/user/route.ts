import { NextRequest, NextResponse } from "next/server";
import { getPaymentsByUserId } from "@/lib/db";
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

    const payments = await getPaymentsByUserId(userId);
    return NextResponse.json({ success: true, payments });
  } catch (error: any) {
    console.error("Error fetching user payments:", error);
    return NextResponse.json(
      { message: error.message || "Server error fetching payments" },
      { status: 500 }
    );
  }
}
