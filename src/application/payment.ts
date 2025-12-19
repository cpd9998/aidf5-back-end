import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

// Get credentials from environment variables
const merchantId = process.env.MERCHANT_ID;
const merchantSecret = process.env.MERCHANT_SECRET;

export const getHash = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { order_id, amount, currency = "LKR" } = req.body;

    // Validate environment variables
    if (!merchantId || !merchantSecret) {
      throw new Error("Merchant credentials not configured");
    }

    // Validate request data
    if (!order_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "order_id and amount are required",
      });
    }

    // CRITICAL: Format amount to 2 decimal places
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Step 1: Hash the merchant secret
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    // Step 2: Create the hash string
    // Format: merchantId + orderId + amount + currency + hashedSecret
    const hashString =
      merchantId + order_id + formattedAmount + currency + hashedSecret;

    console.log("=== Hash Generation Debug ===");
    console.log("Merchant ID:", merchantId);
    console.log("Order ID:", order_id);
    console.log("Amount:", formattedAmount);
    console.log("Currency:", currency);
    console.log("Hashed Secret:", hashedSecret);
    console.log("Hash String:", hashString);

    // Step 3: Generate final hash
    const hash = crypto
      .createHash("md5")
      .update(hashString)
      .digest("hex")
      .toUpperCase();

    console.log("Final Hash:", hash);
    console.log("===========================");

    res.status(200).json({
      success: true,
      merchantId: merchantId,
      hash: hash,
      amount: formattedAmount, // Return formatted amount
    });
  } catch (error: any) {
    console.error("Hash generation error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const notify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id,
      method,
    } = req.body;

    console.log("=== Payment Notification Received ===");
    console.log("Order ID:", order_id);
    console.log("Amount:", payhere_amount);
    console.log("Status Code:", status_code);
    console.log("Payment ID:", payment_id);
    console.log("Method:", method);

    // Validate merchant secret
    if (!merchantSecret) {
      throw new Error("Merchant secret not configured");
    }

    // Step 1: Hash the merchant secret
    const hashedSecret = crypto
      .createHash("md5")
      .update(merchantSecret)
      .digest("hex")
      .toUpperCase();

    // Step 2: Generate local MD5 signature
    const localHashString =
      merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      hashedSecret;

    const local_md5sig = crypto
      .createHash("md5")
      .update(localHashString)
      .digest("hex")
      .toUpperCase();

    console.log("Received MD5:", md5sig);
    console.log("Local MD5:", local_md5sig);
    console.log("Match:", local_md5sig === md5sig);

    // Verify signature
    if (local_md5sig !== md5sig) {
      console.error("❌ Payment verification failed - Hash mismatch");
      return res.status(400).send("Hash verification failed");
    }

    // Handle different status codes
    switch (status_code) {
      case "2": // Success
        console.log("✅ Payment successful for order:", order_id);
        // TODO: Update your database
        // await Booking.updateOne(
        //   { orderId: order_id },
        //   {
        //     paymentStatus: "Paid",
        //     paymentId: payment_id,
        //     paymentMethod: method,
        //     bookingStatus: "Confirmed",
        //   }
        // );
        break;

      case "0": // Pending
        console.log("⏳ Payment pending for order:", order_id);
        break;

      case "-1": // Canceled
        console.log("❌ Payment canceled for order:", order_id);
        break;

      case "-2": // Failed
        console.log("❌ Payment failed for order:", order_id);
        break;

      case "-3": // Chargedback
        console.log("⚠️ Payment chargedback for order:", order_id);
        break;

      default:
        console.log("⚠️ Unknown status code:", status_code);
    }

    console.log("=====================================");
    res.status(200).send("OK");
  } catch (error: any) {
    console.error("Notify error:", error);
    res.status(500).send("Error processing notification");
  }
};
