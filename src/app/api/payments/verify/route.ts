import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { saveInvitation } from "@/lib/db";
import { getTemplateBySlug } from "@/lib/templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
      templateSlug,
    } = body;

    if (!formData || !templateSlug) {
      return NextResponse.json({ message: "Missing required invitation parameters" }, { status: 400 });
    }

    const template = getTemplateBySlug(templateSlug);
    if (!template) {
      return NextResponse.json({ message: "Invalid template reference" }, { status: 400 });
    }

    // 1. Verify Payment Signature (if keys are set)
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (keySecret && !razorpay_order_id.startsWith("order_mock_")) {
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(razorpay_order_id + "|" + razorpay_payment_id)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        return NextResponse.json({ message: "Invalid payment signature" }, { status: 400 });
      }
    } else {
      console.log("[MOCK MODE] Bypassing Razorpay signature verification.");
    }

    // 2. Generate Unique Sharing Slug
    const cleanName = (name: string) => name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
    const bride = cleanName(formData.bride_name || "bride");
    const groom = cleanName(formData.groom_name || "groom");
    const randomStr = Math.random().toString(36).substring(2, 7);
    const finalSlug = `${bride}-weds-${groom}-${randomStr}`;

    // 3. Save Invitation & Payment Data via DB Layer
    await saveInvitation({
      template_slug: template.slug,
      slug: finalSlug,
      bride_name: formData.bride_name,
      groom_name: formData.groom_name,
      wedding_date: formData.wedding_date,
      wedding_venue: formData.wedding_venue,
      quote: formData.quote || undefined,
      family_names: formData.family_names || undefined,
      rsvp_phone: formData.rsvp_phone || undefined,
      custom_message: formData.custom_message || undefined,
      music_url: template.previewMusicUrl,
      is_paid: true,
      payment_id: razorpay_payment_id || `pay_mock_${randomStr}`,
      order_id: razorpay_order_id || `order_mock_${randomStr}`,
    });

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      message: "Payment verified and invitation generated successfully.",
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: error.message || "Internal server verification error" },
      { status: 500 }
    );
  }
}
