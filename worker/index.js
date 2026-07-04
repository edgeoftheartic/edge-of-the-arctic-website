/**
 * Worker entry: routes /api/* to server code, serves dynamic robots.txt
 * and sitemap.xml, and passes everything else to the static site in
 * ./site (uploaded as Workers static assets).
 *
 * The Stripe logic lives in site/functions/api/create-checkout-session.js
 * (written as a Cloudflare Pages Function) and is reused here unchanged,
 * so the repo deploys identically via Workers OR classic Pages.
 *
 * robots.txt is deliberately dynamic: on the temporary *.workers.dev URL
 * it blocks all crawlers (prevents Google indexing the test site), and on
 * the real custom domain it allows everything — so the domain switch needs
 * no code change and nothing can be forgotten on launch day.
 */
import { onRequestPost as createCheckoutSession } from "../site/functions/api/create-checkout-session.js";

const SITEMAP_PATHS = [
  "/",
  "/tours/",
  "/tours/greenland-by-sea.html",
  "/stay/",
  "/dine/",
  "/explore/",
  "/about/",
  "/contact/",
  "/book/",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isTempHost = url.hostname.endsWith(".workers.dev");

    if (url.pathname === "/api/create-checkout-session") {
      if (request.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
      }
      return createCheckoutSession({ request, env });
    }

    if (url.pathname === "/robots.txt") {
      const body = isTempHost
        ? "User-agent: *\nDisallow: /\n"
        : `User-agent: *\nAllow: /\n\nSitemap: ${url.origin}/sitemap.xml\n`;
      return new Response(body, {
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    if (url.pathname === "/sitemap.xml") {
      const urls = SITEMAP_PATHS.map(
        (p) => `  <url><loc>${url.origin}${p}</loc></url>`
      ).join("\n");
      const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
      return new Response(body, {
        headers: { "Content-Type": "application/xml; charset=utf-8" },
      });
    }

    const response = await env.ASSETS.fetch(request);

    // Belt and braces: also tell crawlers not to index the temp host.
    if (isTempHost && (response.headers.get("Content-Type") || "").includes("text/html")) {
      const r = new Response(response.body, response);
      r.headers.set("X-Robots-Tag", "noindex");
      return r;
    }
    return response;
  },
};
