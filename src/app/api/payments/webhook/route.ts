import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import {
  getPaymentByProviderPaymentId,
  updateOrderStatus,
  getOrderByProviderOrderId,
  updateInvitation,
  savePayment,
} from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature if configured
    if (webhookSecret) {
      if (!signature) {
        return NextResponse.json({ message: "Missing webhook signature" }, { status: 400 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (expectedSignature !== signature) {
        console.error("[SECURITY] Invalid webhook signature from Razorpay");
        return NextResponse.json({ message: "Invalid webhook signature" }, { status: 400 });
      }
    }

    const event = JSON.parse(rawBody);
    const eventType = event.event;

    // Handle payment events: payment.captured or order.paid
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const paymentEntity = event.payload?.payment?.entity;
      const providerOrderId = paymentEntity?.order_id;
      const providerPaymentId = paymentEntity?.id;
      const amountInr = paymentEntity?.amount ? paymentEntity.amount / 100 : 999;

      if (providerPaymentId) {
        // Idempotency check via payments table
        const alreadyProcessed = await getPaymentByProviderPaymentId(providerPaymentId);
        if (alreadyProcessed) {
          console.log(`[WEBHOOK] Payment ${providerPaymentId} already processed. Skipping idempotently.`);
          return NextResponse.json({ success: true, message: "Payment already processed" });
        }
      }

      if (providerOrderId) {
        await updateOrderStatus(providerOrderId, "paid", providerPaymentId);

        const order = await getOrderByProviderOrderId(providerOrderId);
        const invitationSlug = order?.metadata?.invitation_slug;

        if (invitationSlug) {
          await updateInvitation(invitationSlug, {
            status: "paid",
            is_paid: true,
            order_id: providerOrderId,
            payment_id: providerPaymentId,
          });

          await savePayment({
            order_id: order?.id,
            invitation_id: order?.invitation_id,
            invitation_slug: invitationSlug,
            user_id: order?.user_id,
            provider: "razorpay",
            provider_order_id: providerOrderId,
            provider_payment_id: providerPaymentId,
            amount_inr: amountInr,
            currency: paymentEntity?.currency || "INR",
            status: "captured",
            verified_at: new Date().toISOString(),
            metadata: {
              source: "razorpay_webhook",
              event_type: eventType,
            },
          });
        }
      }
    }

    return NextResponse.json({ success: true, message: "Webhook processed successfully" });
  } catch (error: any) {
    console.error("Error processing payment webhook:", error);
    return NextResponse.json(
      { message: error.message || "Failed to process webhook" },
      { status: 500 }
    );
  }
}
