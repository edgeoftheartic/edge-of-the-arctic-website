/**
 * Worker entry: routes /api/* to server code, everything else to the
 * static site in ./site (uploaded as Workers static assets).
 *
 * The Stripe logic lives in site/functions/api/create-checkout-session.js
 * (written as a Cloudflare Pages Function) and is reused here unchanged,
 * so the repo deploys identically via Workers OR classic Pages.
 */
import { onRequestPost as createCheckoutSession } from "../site/functions/api/create-checkout-session.js";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/create-checkout-session") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }
      return createCheckoutSession({ request, env });
    }

    return env.ASSETS.fetch(request);
  },
};
