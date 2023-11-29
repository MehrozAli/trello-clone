import Stripe from "stripe";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// Since Stripe API 2025-03-31 the billing period lives on subscription items.
const subscriptionFields = (subscription: Stripe.Subscription) => {
  const item = subscription.items.data[0];

  return {
    stripeSubscriptionId: subscription.id,
    stripeCustomerId:
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer.id,
    stripePriceId: item.price.id,
    stripeCurrentPeriodEnd: new Date(item.current_period_end * 1000),
  };
};

const idOf = (value: string | { id: string } | null | undefined) =>
  typeof value === "string" ? value : value?.id;

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    return new NextResponse("Webhook secret is not configured", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe-Signature header", { status: 400 });
  }

  const stripe = getStripe();
  const body = await req.text();
  let event: Stripe.Event;

  try {
    // Verifies the HMAC over the raw body and rejects stale timestamps.
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch {
    return new NextResponse("Invalid signature", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orgId = session.metadata?.orgId;
    const subscriptionId = idOf(session.subscription);

    if (!orgId || !subscriptionId) {
      return new NextResponse("Org ID and subscription are required", {
        status: 400,
      });
    }

    const fields = subscriptionFields(
      await stripe.subscriptions.retrieve(subscriptionId)
    );

    // Upsert: an org that cancelled and subscribes again already has a row.
    await db.orgSubscription.upsert({
      where: { orgId },
      create: { orgId, ...fields },
      update: fields,
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const subscriptionId = idOf(
      event.data.object.parent?.subscription_details?.subscription
    );

    if (subscriptionId) {
      const { stripePriceId, stripeCurrentPeriodEnd } = subscriptionFields(
        await stripe.subscriptions.retrieve(subscriptionId)
      );

      // Stripe does not order events; if checkout has not landed yet it
      // will write the same period, so a missing row is not an error.
      await db.orgSubscription.updateMany({
        where: { stripeSubscriptionId: subscriptionId },
        data: { stripePriceId, stripeCurrentPeriodEnd },
      });
    }
  }

  return new NextResponse(null, { status: 200 });
}
