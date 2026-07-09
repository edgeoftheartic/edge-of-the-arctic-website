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

/**
 * 301 redirects: old WordPress URLs → the closest new page.
 * The DOMAIN is unchanged (edgeofthearctic.travel), so Google keeps the site's
 * authority; these redirects transfer each old page's ranking to its new home
 * and stop old indexed URLs 404-ing after launch. Add any stragglers Google
 * Search Console reports post-launch.
 */
const REDIRECTS = {
  "/discover-iceland": "/destinations/iceland.html",
  "/discover-greenland": "/destinations/greenland.html",
  "/greenland-adventure-tours": "/destinations/greenland.html",
  "/faroe-islands": "/destinations/faroe-islands.html",
  "/discover-faroe-islands": "/destinations/faroe-islands.html",
  "/discover-croatia": "/destinations/croatia.html",
  "/slovenia": "/destinations/slovenia.html",
  "/bosnia": "/destinations/bosnia.html",
  "/discover-greece": "/destinations/greece.html",
  "/greece-food-and-wine-tours": "/destinations/greece.html",
  "/discover-bulgaria": "/destinations/bulgaria.html",
  "/upcoming-tours": "/tours/",
  "/tailor-made-tours-iceland": "/ways-to-travel/private-and-tailor-made.html",
  "/adventures-for-women-only-groups": "/ways-to-travel/women-only.html",
  "/lgbtq-friendly-tours-in-iceland": "/ways-to-travel/lgbtq-friendly.html",
  "/off-road-and-highland-adventures": "/ways-to-travel/off-road-and-highlands.html",
  "/food-and-wine-tours": "/ways-to-travel/food-and-wine.html",
  "/the-mediterranean-our-beyond-trips": "/destinations/",
  "/contact-us": "/contact/",
  "/privacy-policy": "/privacy/",
  "/fly-fishing-for-arctic-char-in-greenland": "/journal/fly-fishing-arctic-char-greenland.html",
  "/greece-local-tours": "/journal/greece-local-tours.html",
  "/hidden-gems-of-bulgaria": "/journal/hidden-gems-of-bulgaria.html",
  "/greenland-inuit-culture-tours": "/journal/greenland-inuit-culture.html",
  "/truffle-hunting-croatia": "/journal/truffle-hunting-croatia.html",
  "/spring-in-iceland": "/journal/spring-in-iceland.html",
  // accommodation/restaurant/area moved to the .is site
  "/stay": "https://edgeofthearctic.is/stay/",
  "/dine": "https://edgeofthearctic.is/eat/",
  "/explore": "https://edgeofthearctic.is/explore/",
};

const SITEMAP_PATHS = [
  "/",
  "/tours/",
  "/tours/greenland-by-sea.html",
  "/tours/reset-croatia.html",
  "/about/",
  "/contact/",
  "/book/",
  "/destinations/",
  "/destinations/iceland.html",
  "/destinations/greenland.html",
  "/destinations/faroe-islands.html",
  "/destinations/croatia.html",
  "/destinations/slovenia.html",
  "/destinations/bosnia.html",
  "/destinations/greece.html",
  "/destinations/bulgaria.html",
  "/journal/",
  "/journal/fly-fishing-arctic-char-greenland.html",
  "/journal/greece-local-tours.html",
  "/journal/hidden-gems-of-bulgaria.html",
  "/journal/greenland-inuit-culture.html",
  "/journal/truffle-hunting-croatia.html",
  "/journal/spring-in-iceland.html",
  "/how-we-travel/",
  "/ways-to-travel/",
  "/ways-to-travel/women-only.html",
  "/ways-to-travel/food-and-wine.html",
  "/ways-to-travel/private-and-tailor-made.html",
  "/ways-to-travel/off-road-and-highlands.html",
  "/ways-to-travel/lgbtq-friendly.html",
  "/privacy/",
  "/terms/",
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const isTempHost = url.hostname.endsWith(".workers.dev");

    // 301 old URLs → new pages (match with or without a trailing slash).
    const cleanPath = url.pathname.replace(/\/$/, "") || "/";
    const redirectTo = REDIRECTS[cleanPath];
    if (redirectTo) {
      const dest = redirectTo.startsWith("http") ? redirectTo : url.origin + redirectTo;
      return Response.redirect(dest, 301);
    }

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
