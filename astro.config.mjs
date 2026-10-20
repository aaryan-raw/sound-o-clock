import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
// Set SITE_URL (e.g. https://soundoclock.in) once the production domain is confirmed.
// Without it, canonical URLs, og:url and the sitemap are intentionally omitted.
const site = process.env.SITE_URL || undefined;
export default defineConfig({ site, trailingSlash: "always", devToolbar: { enabled: false }, integrations: site ? [sitemap()] : [] });
