import Razorpay from "razorpay";

const keyId = process.env.RAZORPAY_KEY_ID || "";
const keySecret = process.env.RAZORPAY_KEY_SECRET || "";

if (!keyId || !keySecret) {
  console.warn(
    "Razorpay credentials are not set. Payments will operate in mock mode. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your environment."
  );
}

export const razorpay =
  keyId && keySecret
    ? new Razorpay({
        key_id: keyId,
        key_secret: keySecret,
      })
    : null;
