import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { upsertInvitation, savePayment, updateOrderStatus, getOrderByProviderOrderId } from "@/lib/db";
import { getTemplateBySlug } from "@/lib/templates";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      formData,
      templateSlug,
      userId: bodyUserId,
      existingSlug,
    } = body;

    if (!formData || !templateSlug || !razorpay_order_id) {
      return NextResponse.json({ message: "Missing required payment verification parameters" }, { status: 400 });
    }

    const template = getTemplateBySlug(templateSlug);
    if (!template) {
      return NextResponse.json({ message: "Invalid template reference" }, { status: 400 });
    }

    // 1. Resolve and verify authenticated user
    const authHeader = req.headers.get("Authorization");
    let tokenUserId = await getUserIdFromAuthHeader(authHeader);
    if (!tokenUserId && !isSupabaseConfigured) {
      tokenUserId = bodyUserId || "mock-user-123";
    }

    const finalUserId = tokenUserId || bodyUserId || undefined;
    if (!finalUserId) {
      return NextResponse.json({ message: "Unauthorized: Missing authenticated session" }, { status: 401 });
    }

    // 2. Cryptographic Payment Verification
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const isLiveRazorpay = !!(keySecret && !razorpay_order_id.startsWith("order_mock_"));

    if (isLiveRazorpay) {
      if (!razorpay_payment_id || !razorpay_signature) {
        return NextResponse.json({ message: "Missing payment signature or ID" }, { status: 400 });
      }

      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      if (generatedSignature !== razorpay_signature) {
        console.error("[SECURITY] Invalid payment signature attempt detected!");
        return NextResponse.json({ message: "Invalid payment signature verification failed" }, { status: 400 });
      }
    } else {
      console.log(`[PAYMENT VERIFY] Mock or development order verified: ${razorpay_order_id}`);
    }

    // 3. Update Order status in database
    await updateOrderStatus(razorpay_order_id, "paid", razorpay_payment_id);

    const randomStr = Math.random().toString(36).substring(2, 9);
    const finalSlug = existingSlug || randomStr;
    const finalPaymentId = razorpay_payment_id || `pay_mock_${randomStr}`;
    const finalOrderId = razorpay_order_id;

    // 4. Upsert Invitation with paid entitlement
    const savedInvitation = await upsertInvitation({
      template_slug: template.slug,
      user_id: finalUserId,
      slug: finalSlug,
      status: "paid",
      is_paid: true,
      payment_id: finalPaymentId,
      order_id: finalOrderId,
      bride_name: formData.bride_name,
      groom_name: formData.groom_name,
      wedding_date: formData.wedding_date,
      wedding_venue: formData.wedding_venue,
      quote: formData.quote || undefined,
      family_names: formData.family_names || undefined,
      rsvp_phone: formData.rsvp_phone || undefined,
      custom_message: formData.custom_message || undefined,
      music_url: formData.music_url || template.previewMusicUrl,

      // Licensed Event Features
      bg_image_url: formData.bg_image_url || undefined,
      slideshow_images: formData.slideshow_images || undefined,
      dress_code: formData.dress_code || undefined,
      transport_info: formData.transport_info || undefined,
      scratch_enabled: formData.scratch_enabled || "no",
      sangeet_enabled: formData.sangeet_enabled || "no",
      sangeet_date: formData.sangeet_date || undefined,
      sangeet_venue: formData.sangeet_venue || undefined,
      reception_date: formData.reception_date || undefined,
      reception_venue: formData.reception_venue || undefined,
      gmap_coordinates: formData.gmap_coordinates || undefined,
      music_enabled: formData.music_enabled || "yes",
      slideshow_enabled: formData.slideshow_enabled || "yes",
      dress_code_enabled: formData.dress_code_enabled || "yes",
      transport_enabled: formData.transport_enabled || "yes",
      custom_sections: formData.custom_sections || "",
      content_json: formData,
    });

    // 5. Save verified Payment record
    const savedPayment = await savePayment({
      invitation_id: savedInvitation.id,
      invitation_slug: finalSlug,
      user_id: finalUserId,
      provider: isLiveRazorpay ? "razorpay" : "mock",
      provider_order_id: finalOrderId,
      provider_payment_id: finalPaymentId,
      provider_signature: razorpay_signature || undefined,
      razorpay_order_id: finalOrderId,
      razorpay_payment_id: finalPaymentId,
      razorpay_signature: razorpay_signature || undefined,
      amount_inr: template.price,
      currency: "INR",
      status: "captured",
      verified_at: new Date().toISOString(),
      metadata: {
        template_slug: template.slug,
        couple: `${formData.bride_name} & ${formData.groom_name}`,
        wedding_date: formData.wedding_date,
      },
    });

    return NextResponse.json({
      success: true,
      slug: finalSlug,
      message: "Payment verified, invitation entitlement granted, and receipt saved successfully.",
      invitation: savedInvitation,
      payment: savedPayment,
    });
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return NextResponse.json(
      { message: error.message || "Internal server verification error" },
      { status: 500 }
    );
  }
}
