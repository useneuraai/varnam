import { NextRequest, NextResponse } from "next/server";
import { getAllTemplates, getTemplateBySlugFromDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const template = await getTemplateBySlugFromDb(slug);
      if (!template) {
        return NextResponse.json({ message: "Template not found" }, { status: 404 });
      }
      return NextResponse.json(template);
    }

    const templates = await getAllTemplates();
    return NextResponse.json({ success: true, count: templates.length, templates });
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { message: error.message || "Failed to load templates" },
      { status: 500 }
    );
  }
}
