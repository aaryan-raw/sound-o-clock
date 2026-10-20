export const GET = ({ site }: { site?: URL }) =>
  new Response(`User-agent: *\nAllow: /\n${site ? `\nSitemap: ${new URL("sitemap-index.xml", site)}\n` : ""}`, { headers: { "Content-Type": "text/plain" } });
