import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/webhook/route";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

import { resetDb } from "../helpers/db";

const retrieve = vi.hoisted(() => vi.fn());

// A real Stripe client (for signature checks, which are local HMAC) whose
// only network method is stubbed. No request ever leaves the test.
vi.mock("@/lib/stripe", async () => {
  const { default: Stripe } = await import("stripe");
  const client = new Stripe("sk_test_placeholder");
  Object.assign(client.subscriptions, { retrieve });
  return { getStripe: () => client };
});

const SECRET = "whsec_test_placeholder";
const PERIOD_END = 1_893_456_000;

const subscription = {
  id: "sub_123",
  customer: "cus_123",
  items: { data: [{ price: { id: "price_123" }, current_period_end: PERIOD_END }] },
};

const send = (event: object, { sign = true, secret = SECRET } = {}) => {
  const payload = JSON.stringify(event);
  const headers: Record<string, string> = {};

  if (sign) {
    headers["stripe-signature"] = getStripe().webhooks.generateTestHeaderString({
      payload,
      secret,
    });
  }

  return POST(new Request("http://localhost/api/webhook", { method: "POST", body: payload, headers }));
};

const checkoutCompleted = (metadata: Record<string, string> = { orgId: "org_a" }) => ({
  id: "evt_1",
  object: "event",
  type: "checkout.session.completed",
  data: { object: { id: "cs_1", object: "checkout.session", subscription: "sub_123", metadata } },
});

describe("POST /api/webhook", () => {
  beforeEach(async () => {
    await resetDb();
    retrieve.mockReset().mockResolvedValue(subscription);
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", SECRET);
    vi.stubEnv("STRIPE_API_KEY", "sk_test_placeholder");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("fails closed when no webhook secret is configured", async () => {
    vi.stubEnv("STRIPE_WEBHOOK_SECRET", "");

    expect((await send(checkoutCompleted())).status).toBe(500);
    expect(await db.orgSubscription.count()).toBe(0);
  });

  it("answers a clear 500, not a crash, when the API key is missing", async () => {
    vi.stubEnv("STRIPE_API_KEY", "");

    const response = await send(checkoutCompleted());

    expect(response.status).toBe(500);
    expect(await response.text()).toBe("Stripe is not configured");
  });

  it("rejects requests without a signature", async () => {
    expect((await send(checkoutCompleted(), { sign: false })).status).toBe(400);
  });

  it("rejects a signature made with another secret", async () => {
    const response = await send(checkoutCompleted(), { secret: "whsec_attacker" });

    expect(response.status).toBe(400);
    expect(retrieve).not.toHaveBeenCalled();
    expect(await db.orgSubscription.count()).toBe(0);
  });

  it("records the subscription for a verified checkout", async () => {
    expect((await send(checkoutCompleted())).status).toBe(200);

    expect(retrieve).toHaveBeenCalledWith("sub_123");
    expect(await db.orgSubscription.findUnique({ where: { orgId: "org_a" } })).toMatchObject({
      stripeSubscriptionId: "sub_123",
      stripeCustomerId: "cus_123",
      stripePriceId: "price_123",
      stripeCurrentPeriodEnd: new Date(PERIOD_END * 1000),
    });
  });

  it("updates rather than crashes when an org subscribes again", async () => {
    await send(checkoutCompleted());
    retrieve.mockResolvedValue({ ...subscription, id: "sub_456" });

    expect((await send(checkoutCompleted())).status).toBe(200);
    expect(await db.orgSubscription.count()).toBe(1);
    expect((await db.orgSubscription.findUniqueOrThrow({ where: { orgId: "org_a" } })).stripeSubscriptionId).toBe("sub_456");
  });

  it("requires an org id before touching Stripe", async () => {
    expect((await send(checkoutCompleted({}))).status).toBe(400);
    expect(retrieve).not.toHaveBeenCalled();
  });

  it("extends the period on a paid renewal invoice", async () => {
    await send(checkoutCompleted());
    const renewedEnd = PERIOD_END + 30 * 86_400;
    retrieve.mockResolvedValue({
      ...subscription,
      items: { data: [{ price: { id: "price_123" }, current_period_end: renewedEnd }] },
    });

    const response = await send({
      id: "evt_2",
      object: "event",
      type: "invoice.payment_succeeded",
      data: { object: { id: "in_1", object: "invoice", parent: { subscription_details: { subscription: "sub_123" } } } },
    });

    expect(response.status).toBe(200);
    expect((await db.orgSubscription.findUniqueOrThrow({ where: { orgId: "org_a" } })).stripeCurrentPeriodEnd).toEqual(
      new Date(renewedEnd * 1000)
    );
  });

  it("acknowledges unrelated events without side effects", async () => {
    const response = await send({ id: "evt_3", object: "event", type: "customer.created", data: { object: {} } });

    expect(response.status).toBe(200);
    expect(retrieve).not.toHaveBeenCalled();
  });
});
