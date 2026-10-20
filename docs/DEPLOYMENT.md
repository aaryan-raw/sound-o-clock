# Deployment (Netlify via GitHub)

Nothing has been deployed. These are the steps for the person with GitHub and Netlify access.

## Settings
- Build command: `npm run build`
- Publish directory: `dist`
- Node: 22 (`NODE_VERSION=22` in `netlify.toml`; Astro 7 needs 22.22.0 or newer, so if a build fails on engines, set `NODE_VERSION=22.22.2` in the Netlify UI)
- Environment variables: none required. Optional: `SITE_URL` (production domain, set only after approval). `PUBLIC_OWNER_REVIEW` is set by `netlify.toml` for previews only.
- External services: GitHub repo, Netlify account. Nothing else is needed.

## Steps, in order
1. Create a GitHub repository and push this project (`node_modules`, `dist` and `.astro` are git-ignored).
2. In Netlify: Add new site > Import from Git > pick the repo. Confirm build command and publish directory above. Deploy.
3. Open the Netlify preview URL and run the smoke test below. The first deploy will be on a `*.netlify.app` URL, not indexed (`noindex`).
4. Send the owner the deploy preview to review: it shows owner-review markers by design.
5. Collect owner approvals (`docs/OWNER_APPROVALS.md`), add photos, audio and quotes, confirm services in `src/data/site.js`, merge to the main branch.
6. Only after the owner approves a domain, follow "Custom domain".
7. Re-run the smoke test on the live domain.

## Custom domain (after the owner approves one)
1. Netlify: Domain management > Add a domain. Follow the DNS instructions (Netlify DNS, or an A/ALIAS plus CNAME at the registrar). The owner should own the registrar account.
2. Wait for DNS and the automatic HTTPS certificate. Enable "Force HTTPS".
3. Netlify > Site configuration > Environment variables: add `SITE_URL=https://<approved-domain>` (no trailing slash). Redeploy.
4. Confirm: canonical tags and sitemap exist, `noindex` is gone, `/robots.txt` lists the sitemap.
5. Submit `https://<domain>/sitemap-index.xml` in Google Search Console. Add the website to the Google Business Profile and make sure its name, address and phone match the site exactly.

## Optional: Netlify Forms (needs owner approval, an inbox address and Netlify setup)
Not enabled. Enabling it requires: a form with `data-netlify="true"` and a honeypot, a `form-action` that fits the CSP, a Netlify notification email set in the Netlify UI, and a decision on spam protection. Do not describe the form as delivering enquiries until this is built and tested with a real submission.

## Post-deployment smoke test
- [ ] Home, /services/, /contact/, /privacy/ load over HTTPS; a bad URL shows the 404 page.
- [ ] Production site shows no "Provisional", "Photo needed", "Draft" or "Owner review" text.
- [ ] On a phone: tapping Call dials +91 97469 23339.
- [ ] WhatsApp button opens a chat with 919746923339 and the prefilled message.
- [ ] Enquiry form: empty submit shows errors and sends nothing; a valid one opens WhatsApp with the typed details.
- [ ] Get directions opens the correct place for Plus Code FXW9+G5 and matches the real entrance.
- [ ] Address on the site: TC 16/951-2, Mythri Nagar, Jagathy, Thiruvananthapuram, Kerala 695014.
- [ ] Menu works by touch and keyboard (Esc closes).
- [ ] No horizontal scroll at 320px; no console errors.
- [ ] Response headers include Content-Security-Policy and X-Frame-Options; no CSP errors in the console.
- [ ] With a domain set: view-source shows the right canonical, `/sitemap-index.xml` loads, a link preview (WhatsApp/Facebook debugger) shows the image.
- [ ] Rating on the site matches the live Google listing.
