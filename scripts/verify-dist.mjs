// Post-build verification of dist/. Run: npm run build && npm test
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
const DIST = "dist"; const fails = []; const fail = (m) => fails.push(m);
const TEL = "tel:+919746923339", WA = "https://wa.me/919746923339";
const walk = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? walk(p) : [p]; });
const pages = walk(DIST).filter((f) => f.endsWith(".html"));
const urlOf = (f) => "/" + f.slice(DIST.length + 1).replace(/index\.html$/, "");
const exists = (u) => { const c = join(DIST, u.replace(/^\//, "")); return existsSync(c) && statSync(c).isFile() || existsSync(join(c, "index.html")); };
const forbidden = [/photo needed/i, /provisional/i, /owner review/i, /draft/i, /lorem/i, /class="ph"/, /aria-label="Placeholder/, /TO CONFIRM/, /example\.(invalid|com)/i, /localhost/i];
const titles = new Map(), descs = new Map();
const hasDomain = !!process.env.SITE_URL;
for (const f of pages) {
  const h = readFileSync(f, "utf8"), u = urlOf(f);
  const is404 = f.endsWith("404.html");
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1], desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  if (!title) fail(`${u}: missing title`); if (!desc) fail(`${u}: missing description`);
  if (titles.has(title)) fail(`${u}: duplicate title`); titles.set(title, u);
  if (descs.has(desc)) fail(`${u}: duplicate description`); descs.set(desc, u);
  if ((h.match(/<h1[ >]/g) || []).length !== 1) fail(`${u}: expected exactly one h1`);
  if (!/<html lang="en"/.test(h)) fail(`${u}: missing html lang`);
  for (const re of forbidden) if (re.test(h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ""))) fail(`${u}: forbidden text ${re}`);
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]+"/.test(m[0])) fail(`${u}: <img> without alt text`);
  for (const m of h.matchAll(/<(input|select|textarea)\b[^>]*\bid="([^"]+)"/g)) if (!h.includes(`for="${m[2]}"`)) fail(`${u}: control #${m[2]} has no label`);
  if (hasDomain) { if (!is404 && !/<link rel="canonical"/.test(h)) fail(`${u}: missing canonical`); if (/name="robots" content="noindex"/.test(h)) fail(`${u}: noindex with domain set`); }
  else if (!/name="robots" content="noindex"/.test(h)) fail(`${u}: expected noindex while no SITE_URL`);
  const ids = new Set([...h.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of h.matchAll(/<a\b[^>]*\shref="([^"]*)"/g)) {
    const href = m[1].replace(/&amp;/g, "&");
    if (href.startsWith("tel:")) { if (href !== TEL) fail(`${u}: wrong tel ${href}`); }
    else if (href.includes("wa.me")) { if (!href.startsWith(WA)) fail(`${u}: wrong WhatsApp ${href}`); }
    else if (/^https?:/.test(href)) { if (!/^https:\/\/www\.google\.com\/maps\//.test(href)) fail(`${u}: unexpected external link ${href}`); }
    else if (href.startsWith("mailto:")) fail(`${u}: unexpected mailto`);
    else { const [p, frag] = href.split("#"); const target = p === "" ? u : p.split("?")[0];
      if (!exists(target)) fail(`${u}: broken link ${href}`);
      else if (frag) { const th = readFileSync(existsSync(join(DIST, target, "index.html")) ? join(DIST, target, "index.html") : join(DIST, target), "utf8"); if (!th.includes(`id="${frag}"`)) fail(`${u}: missing anchor ${href}`); } }
  }
  for (const m of h.matchAll(/(?:src|href)="(\/[^"#?]*\.[a-z0-9]+)"/g)) if (!exists(m[1])) fail(`${u}: missing asset ${m[1]}`);
  if (!h.includes("919746923339") && !is404) { /* contact pages checked via links above */ }
}
const home = readFileSync(join(DIST, "index.html"), "utf8");
for (const t of ["TC 16/951-2, Mythri Nagar", "Jagathy, Thiruvananthapuram", "Kerala 695014", "+91 97469 23339"]) if (!home.includes(t)) fail(`home: missing verified detail "${t}"`);
const ld = JSON.parse(home.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
if (ld.telephone !== "+919746923339" || ld.address.postalCode !== "695014") fail("structured data mismatch");
for (const bad of ["aggregateRating", "openingHours", "priceRange", "geo", "review"]) if (bad in ld) fail(`structured data contains unverified field ${bad}`);
const robots = readFileSync(join(DIST, "robots.txt"), "utf8");
if (hasDomain !== /Sitemap:/.test(robots)) fail("robots.txt sitemap line inconsistent with SITE_URL");
if (hasDomain && !existsSync(join(DIST, "sitemap-index.xml"))) fail("sitemap missing");
if (!existsSync(join(DIST, "404.html"))) fail("404.html missing");
console.log(`Checked ${pages.length} pages (${hasDomain ? "domain set" : "no SITE_URL: noindex mode"}).`);
if (fails.length) { console.error("FAILED:\n - " + fails.join("\n - ")); process.exit(1); } else console.log("verify-dist: all checks passed");
