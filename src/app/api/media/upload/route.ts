import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, isSupabaseConfigured } from "@/lib/supabase";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import fs from "fs";
import path from "path";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
];

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      userId = "mock-user-123";
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: Please log in to upload files" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: `Unsupported file type: ${file.type}. Allowed: JPEG, PNG, WebP, GIF, MP3, WAV` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { message: "File exceeds 5MB limit. Please upload a smaller asset." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename & extension
    const cleanExt = path.extname(file.name).toLowerCase() || ".jpg";
    const safeBaseName = path
      .basename(file.name, cleanExt)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 30);
    const uniqueFileName = `${Date.now()}_${safeBaseName}${cleanExt}`;
    const storagePath = `${userId}/${uniqueFileName}`;

    if (isSupabaseConfigured) {
      const { data, error } = await supabaseAdmin.storage
        .from("invitation-assets")
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.error("Supabase storage upload error:", error);
        throw error;
      }

      const { data: publicUrlData } = supabaseAdmin.storage
        .from("invitation-assets")
        .getPublicUrl(storagePath);

      return NextResponse.json({
        success: true,
        url: publicUrlData.publicUrl,
        filename: file.name,
        size: file.size,
      });
    }

    // Local / Dev Fallback
    const localUploadDir = path.join(process.cwd(), "public", "uploads", userId);
    fs.mkdirSync(localUploadDir, { recursive: true });
    const localFilePath = path.join(localUploadDir, uniqueFileName);
    fs.writeFileSync(localFilePath, buffer);

    const localUrl = `/uploads/${userId}/${uniqueFileName}`;
    return NextResponse.json({
      success: true,
      url: localUrl,
      filename: file.name,
      size: file.size,
      mock: true,
    });
  } catch (error: any) {
    console.error("Error in media upload:", error);
    return NextResponse.json(
      { message: error.message || "Failed to upload asset" },
      { status: 500 }
    );
  }
}
