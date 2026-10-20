# Sound O'Clock website

Static marketing site for Sound O'Clock, a recording studio in Jagathy, Thiruvananthapuram.
Stack: Astro (static output), plain CSS, about 1 KB of vanilla JS, self-hosted fonts. Hosting target: Netlify via GitHub.

## Setup
Requires Node 22.22.0 or newer (`.nvmrc` is provided).
```
npm ci            # install exact locked dependencies
npm run dev       # local dev server
npm run verify    # type check + production build + dist checks
npm run preview   # serve the built site locally
```
Scripts: `check` (astro check), `build`, `test` (runs `scripts/verify-dist.mjs` against `dist/`), `verify` (all three).
`npm test` checks: internal links and anchors, exact phone/WhatsApp numbers, verified address, unique titles and descriptions,
one H1 per page, image alt text, form labels, no placeholder or draft text, structured data limited to verified fields, robots/sitemap consistency.
Set `SITE_URL` when running it against a domain build.

## Where things are
- `src/data/site.js`: ALL editable content (contact details, services, review themes, testimonials, portfolio, gallery alt text).
- `src/components/`: one component per section. `src/pages/`: home, services, contact, privacy, 404, robots.txt.
- `src/assets/studio/`: studio photos. `src/assets/work/`: portfolio artwork. `src/assets/engineer.jpg`: optional portrait.
- `public/`: favicon, `og.png` (generated wordmark card, replace with a real image if wanted), audio files go in `public/audio/`.
- `netlify.toml`: build settings, security headers, preview behaviour.

## Updating content
- **Contact details / services text:** edit `src/data/site.js`. Mark a service `confirmed: true` once the owner approves it.
- **Studio photos:** put the file in `src/assets/studio/` and add `"filename.jpg": { alt: "what the photo shows", focus: "50% 40%" }` to `gallery`. A photo without alt text is never shown. The Studio section and nav link appear automatically once `gallery` has entries.
- **Portfolio:** add entries to `work` (title, kind, optional artist, description, `src` for audio in `public/audio/`, optional `artwork` + `artworkAlt`). The section stays hidden while `work` is empty. Only add material the owner has permission to publish.
  A video embed also needs `frame-src` allowed in the CSP in `netlify.toml` (currently `'none'`).
- **Testimonials:** add `{ quote, author, url? }` to `testimonials`, only with the reviewer's permission and the exact original wording.
- **Rating:** update `site.rating` after re-checking Google.

## Preview vs production behaviour
`PUBLIC_OWNER_REVIEW=1` (set automatically on Netlify deploy previews and branch deploys) shows owner-review markers: Provisional tags, photo placeholders, draft notes, and all six candidate services.
Production builds never show them. Public builds list a service only if `confirmed` is true or customer reviews mention it (vocal recording, dubbing, mixing, mastering).
To publish only owner-confirmed services, change the `publicServices` filter at the bottom of `src/data/site.js` to `s.confirmed`.

## Enquiry form
The form validates in the browser and then opens WhatsApp with an editable prefilled message. Nothing is sent until the visitor presses send in WhatsApp. There is no server-side delivery and no email. This is deliberate; see `docs/DEPLOYMENT.md` for the optional Netlify Forms upgrade (needs approval).

## SEO behaviour
Until `SITE_URL` is set, pages carry `noindex`, and there is no canonical URL, `og:url`, `og:image` or sitemap. Setting `SITE_URL` (for example `https://yourdomain`) enables canonical, Open Graph image, sitemap and robots sitemap line, and removes `noindex`.

## Known limitations
- No photos, audio, portrait or review quotes yet, so those sections are hidden or text-only.
- No opening hours, prices, social links or analytics are shown, because none are verified.
- Contact options are phone, WhatsApp and the WhatsApp-composed form only. No email address is published.
- The Google Maps link uses the Plus Code FXW9+G5. It has not been opened in a live browser by the developer.
- English only.
- CSP allows inline scripts and styles (Astro emits small inline blocks). There are no third-party scripts.
- See `docs/OWNER_APPROVALS.md` for everything that needs sign-off.
