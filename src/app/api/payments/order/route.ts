import { NextRequest, NextResponse } from "next/server";
import { razorpay } from "@/lib/razorpay";
import { getTemplateBySlug } from "@/lib/templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { templateSlug, amount } = body;

    if (!templateSlug) {
      return NextResponse.json({ message: "Template slug is required" }, { status: 400 });
    }

    const template = getTemplateBySlug(templateSlug);
    if (!template) {
      return NextResponse.json({ message: "Invalid template slug" }, { status: 400 });
    }

    // Verify price to avoid client-side tampering
    if (Math.round(template.price) !== Math.round(amount)) {
      return NextResponse.json({ message: "Price mismatch" }, { status: 400 });
    }

    const amountInPaise = Math.round(template.price * 100);

    // If Razorpay keys are configured, create order
    if (razorpay) {
      const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
        payment_capture: true, // capture payment immediately
      });

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      });
    }

    // Mock Mode Fallback (if credentials are empty)
    console.log("[MOCK MODE] Generating mock Razorpay order.");
    return NextResponse.json({
      id: `order_mock_${Math.random().toString(36).substring(2, 11)}`,
      amount: amountInPaise,
      currency: "INR",
    });
  } catch (error: any) {
    console.error("Error creating payment order:", error);
    return NextResponse.json(
      { message: error.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
