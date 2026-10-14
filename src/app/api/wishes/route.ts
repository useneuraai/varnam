import { NextRequest, NextResponse } from "next/server";
import { getPublicWishes } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ message: "Missing invitation slug" }, { status: 400 });
    }

    const wishes = await getPublicWishes(slug);
    return NextResponse.json(wishes);
  } catch (error: any) {
    console.error("Error fetching guest wishes:", error);
    return NextResponse.json(
      { message: error.message || "Failed to load wedding wishes" },
      { status: 500 }
    );
  }
}
