import Stripe from "stripe";

let client: Stripe | undefined;

// Created on first use so that builds and pages that never touch billing
// do not need STRIPE_API_KEY.
export const getStripe = () => {
  if (!client) {
    const apiKey = process.env.STRIPE_API_KEY;

    if (!apiKey) {
      throw new Error("STRIPE_API_KEY is not set");
    }

    client = new Stripe(apiKey);
  }

  return client;
};
