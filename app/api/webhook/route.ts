import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

// Since Stripe API 2025-03-31 the billing period lives on subscription items.
const periodEnd = (subscription: Stripe.Subscription) =>
  new Date(subscription.items.data[0].current_period_end * 1000);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("Stripe-Signature") as string;
  const stripe = getStripe();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return new NextResponse("Webhook error", { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    if (!session?.metadata?.orgId) {
      return new NextResponse("Org ID is required", { status: 400 });
    }

    await db.orgSubscription.create({
      data: {
        orgId: session.metadata.orgId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: periodEnd(subscription),
      },
    });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoice = event.data.object;
    const subscription = await stripe.subscriptions.retrieve(
      invoice.parent?.subscription_details?.subscription as string
    );

    await db.orgSubscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: periodEnd(subscription),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
