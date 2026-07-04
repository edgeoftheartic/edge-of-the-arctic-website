/**
 * Cloudflare Pages Function — creates a Stripe Checkout Session
 * for expedition deposits and tour payments.
 *
 * Setup (see README.md):
 *   1. In the Cloudflare Pages project → Settings → Environment variables,
 *      add STRIPE_SECRET_KEY (starts with sk_live_ or sk_test_).
 *   2. Adjust PRODUCTS below as offerings/prices change.
 *
 * No Stripe SDK needed — the REST API is called directly, which keeps
 * this deployable with zero build step.
 */

const PRODUCTS = {
  // Flagship expedition — $1,000 per-person deposit
  "greenland-by-sea": {
    name: "Greenland by Sea & Arctic Iceland — Expedition Deposit",
    description:
      "Refundable deposit to reserve one place. Balance invoiced 120 days before departure.",
    amount: 100000, // cents
    currency: "usd",
  },
  // Example day-tour paid in full — edit/extend freely
  "day-tour": {
    name: "North Iceland Private Day Tour",
    description: "Full payment for a private guided day tour from Akureyri.",
    amount: 39500,
    currency: "usd",
  },
};

export async function onRequestPost({ request, env }) {
  const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  // The key may arrive as a plain Worker secret (string) or as a
  // Secrets Store binding (object with an async .get()).
  let stripeKey = env.STRIPE_SECRET_KEY;
  if (stripeKey && typeof stripeKey.get === "function") {
    try {
      stripeKey = await stripeKey.get();
    } catch {
      stripeKey = null;
    }
  }
  if (!stripeKey) {
    return json({ error: "Stripe is not configured yet" }, 501);
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  const product = PRODUCTS[payload.product];
  if (!product) {
    return json({ error: "Unknown product" }, 400);
  }

  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/book/thank-you.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/book/`,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": product.currency,
    "line_items[0][price_data][unit_amount]": String(product.amount),
    "line_items[0][price_data][product_data][name]": product.name,
    "line_items[0][price_data][product_data][description]": product.description,
    "metadata[product]": payload.product,
    "metadata[departure]": payload.departure || "",
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const session = await res.json();
  if (!res.ok) {
    return json({ error: session.error?.message || "Stripe error" }, 502);
  }
  return json({ url: session.url });
}
