"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import Stripe from "stripe";
import { auth, requireSession } from "@/lib/auth";

const PREMIUM_PRICE = 1900; // $19.00 / month

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "Stripe is not configured yet. Add STRIPE_SECRET_KEY to your environment.",
    );
  }
  return new Stripe(key);
}

function appUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.BETTER_AUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

/**
 * Create a Stripe Checkout session for the vendor Premium plan.
 */
export async function createCheckoutSession({ plan = "premium" } = {}) {
  try {
    const session = await requireSession(["vendor"]);
    if (plan !== "premium") {
      return { success: false, error: "Unknown plan selected." };
    }
    if (session.user.plan === "premium") {
      return { success: false, error: "You are already on the Premium plan." };
    }

    const stripe = getStripe();
    const checkout = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: PREMIUM_PRICE,
            recurring: { interval: "month" },
            product_data: {
              name: "PizzaHub Vendor Premium",
              description:
                "Priority placement, premium badges, unlimited menu items and analytics.",
            },
          },
        },
      ],
      metadata: {
        type: "subscription",
        plan: "premium",
        userId: session.user.id,
      },
      subscription_data: {
        metadata: {
          type: "subscription",
          plan: "premium",
          userId: session.user.id,
        },
      },
      success_url: `${appUrl()}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl()}/payment/cancel?plan=premium`,
    });

    if (!checkout.url) {
      return { success: false, error: "Stripe did not return a checkout URL." };
    }

    return { success: true, url: checkout.url };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Confirm a completed checkout and flip the signed-in vendor to Premium.
 * In production a webhook should do this too; this keeps the success page
 * useful when running locally without webhook forwarding.
 */
export async function activatePremium(sessionId) {
  try {
    if (!sessionId) {
      return { success: false, error: "Missing checkout session id." };
    }
    const session = await requireSession(["vendor"]);
    const stripe = getStripe();
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);

    if (checkout.metadata?.userId !== session.user.id) {
      return { success: false, error: "This checkout belongs to another user." };
    }

    const paid =
      checkout.payment_status === "paid" ||
      checkout.payment_status === "no_payment_required" ||
      checkout.status === "complete";
    if (!paid) {
      return { success: false, error: "Payment has not been completed yet." };
    }

    await auth.api.updateUser({
      headers: await headers(),
      body: { plan: "premium" },
    });

    revalidatePath("/", "layout");
    revalidatePath("/dashboard", "layout");
    revalidatePath("/dashboard/vendor/subscription");
    revalidatePath("/dashboard/vendor");

    return { success: true, plan: "premium" };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
