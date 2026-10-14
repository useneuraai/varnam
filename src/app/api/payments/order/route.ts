import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getTemplateBySlug } from "@/lib/templates";
import { createOrder, getInvitationBySlug, updateInvitation } from "@/lib/db";
import { getUserIdFromAuthHeader } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateSlug, invitationSlug } = body;

    if (!templateSlug) {
      return NextResponse.json({ message: "Template slug is required" }, { status: 400 });
    }

    const template = getTemplateBySlug(templateSlug);
    if (!template) {
      return NextResponse.json({ message: "Invalid template slug" }, { status: 400 });
    }

    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    let userId = await getUserIdFromAuthHeader(authHeader);
    if (!userId && !isSupabaseConfigured) {
      userId = "mock-user-123";
    }

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized: Please log in to checkout" }, { status: 401 });
    }

    // Check invitation ownership if invitationSlug provided
    let invitation = null;
    if (invitationSlug) {
      invitation = await getInvitationBySlug(invitationSlug);
      if (invitation && invitation.user_id && invitation.user_id !== userId) {
        return NextResponse.json({ message: "Forbidden: You do not own this invitation" }, { status: 403 });
      }
      if (invitation && invitation.status === "draft") {
        await updateInvitation(invitationSlug, { status: "pending_payment" });
      }
    }

    // Server-side authoritative price in INR & paise
    const trustedPriceInr = template.price;
    const amountInPaise = Math.round(trustedPriceInr * 100);

    // Live Razorpay order creation
    if (razorpay && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      try {
        const order = await razorpay.orders.create({
          amount: amountInPaise,
          currency: "INR",
          receipt: `rcpt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          notes: {
            template_slug: template.slug,
            invitation_slug: invitationSlug || "",
            user_id: userId,
          },
        });

        // Persist order in orders table
        await createOrder({
          user_id: userId,
          invitation_id: invitation?.id,
          amount_inr: trustedPriceInr,
          currency: "INR",
          status: "created",
          payment_provider: "razorpay",
          provider_order_id: order.id,
          metadata: {
            template_slug: template.slug,
            invitation_slug: invitationSlug,
          },
        });

        return NextResponse.json({
          id: order.id,
          amount: order.amount,
          currency: order.currency,
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
      } catch (err: any) {
        console.error("Razorpay order creation error:", err);
        return NextResponse.json(
          { message: err.message || "Failed to initialize payment gateway" },
          { status: 500 }
        );
      }
    }

    // Mock Mode Fallback (if credentials are not yet configured in environment)
    const mockOrderId = `order_mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    console.log(`[MOCK MODE] Generating mock payment order: ${mockOrderId}`);

    await createOrder({
      user_id: userId,
      invitation_id: invitation?.id,
      amount_inr: trustedPriceInr,
      currency: "INR",
      status: "created",
      payment_provider: "mock",
      provider_order_id: mockOrderId,
      metadata: {
        template_slug: template.slug,
        invitation_slug: invitationSlug,
        mock: true,
      },
    });

    return NextResponse.json({
      id: mockOrderId,
      amount: amountInPaise,
      currency: "INR",
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_placeholder",
      mock: true,
    });
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
