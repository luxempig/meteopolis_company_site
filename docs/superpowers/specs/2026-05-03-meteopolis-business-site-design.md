# Meteopolis Business Website — Design Spec

**Date:** 2026-05-03
**Status:** Approved by user (sections 1, 2, 3); ready for implementation plan
**Project root (planned):** `/Users/dd/Projects/meteopolis_dev/`

## 1. Goal

Build a Stripe-acceptable freelance business website at `meteopolis.com` for **Meteopolis LLC** (in formation via Stripe Atlas). The site must satisfy Stripe's account-activation website checklist while serving as the strongest portfolio piece for a custom-web-app freelance practice.

## 2. Business model

Meteopolis LLC offers freelance custom web application development services across three categories:

- **Custom web applications** — full-stack builds with auth, complex data, and integrations
- **Data-heavy platforms** — knowledge graphs, search, ETL pipelines, admin tooling
- **Mobile companions** — iOS apps or Chrome extensions extending an existing web product

Engagements are project-based with milestone billing. Payment via Stripe.

## 3. Domain & infrastructure baseline

**Current state:**

- Domain: `meteopolis.com`, registered at Network Solutions
- Authoritative DNS: `ns1.worldnic.com`, `ns2.worldnic.com` (Network Solutions defaults)
- Email: Google Workspace (MX → `smtp.google.com`; TXT verification record present)
- Public IP `74.91.138.134` serves Network Solutions' default "Web Page Under Construction" placeholder. IP block owned by Newfold Digital, Inc. No user content is hosted there; nothing else uses this IP.
- DNS records currently in place:
  - `A @ → 74.91.138.134` (to be deleted)
  - `A www → 74.91.138.134` (to be deleted)
  - `MX @ → smtp.google.com` (to be preserved exactly)
  - `TXT @ → google-site-verification=0pnB10TpZmL0A_VntROT9piKvpXck37wPEVdiJGcAH8` (to be preserved exactly)

**Target state after implementation:**

- Authoritative DNS: Cloudflare nameservers (free plan)
- Site hosted on Cloudflare Pages (free plan)
- Email continues on Google Workspace (records mirrored exactly during migration; SPF + DMARC added during migration; DKIM added post-migration)
- Network Solutions hosting line item (if any) cancelled

## 4. Brand positioning

**Tagline:** "Web apps for teams that need more than a landing page."

**Tone (whole site):** Confident, plain-spoken, technical when it should be technical. No agency-speak. No emoji. If a sentence sounds like a slide deck when read aloud, rewrite it.

**Whom this attracts:** Founders or CTOs at early-stage companies looking for senior independent engineering on projects too complex for a junior contractor and too short-lived to justify a full-time hire.

**Whom this disqualifies:** Sub-$5K marketing-page leads, generalist freelancer leads, template-assembly leads.

## 5. Site architecture

Four primary pages, three case-study sub-pages under `/work/`, and three legal pages in the footer — ten URLs in total.

### 5.1 Page list

| URL                                     | Purpose                                      |
| --------------------------------------- | -------------------------------------------- |
| `/`                                     | Homepage                                     |
| `/work`                                 | Portfolio listing                            |
| `/work/corporate-intelligence-platform` | Case study A                                 |
| `/work/historical-media-archive`        | Case study B                                 |
| `/work/interactive-ownership-graph`     | Case study C                                 |
| `/about`                                | Founder bio                                  |
| `/contact`                              | Contact form + email                         |
| `/terms`                                | Terms of Service / Master Services Agreement |
| `/privacy`                              | Privacy Policy                               |
| `/engagement`                           | Engagement & Refund Policy                   |

### 5.2 Navigation

- **Top nav:** `Work` · `About` · `Contact` (homepage is the logo)
- **Footer:** `Terms` · `Privacy` · `Engagement Policy` · `© 2026 Meteopolis LLC` · `meteopolis.com`

## 6. Page content strategy

### 6.1 Homepage (`/`)

| #   | Section         | Content                                                                                                                                                    |
| --- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero            | H1 tagline + 1-line subhead + primary CTA (`See the work →` to `/work`) + secondary CTA (`Get in touch` to `/contact`). Clean typography, no illustration. |
| 2   | Services trio   | Three cards (Custom web applications · Data-heavy platforms · Mobile companions). Each card: headline + 2–3 sentence body + "Typical engagement: $X–$Y"    |
| 3   | Featured work   | Two of three case studies, screenshot-led, 2-up grid, links to full case study pages                                                                       |
| 4   | About teaser    | One-paragraph bio + small headshot + `More about me →` link to `/about`                                                                                    |
| 5   | Final CTA strip | "Working on something hard? Let's talk." + email link. (Calendly link rendered only if §6.5's optional Calendly is enabled.)                               |

### 6.2 Pricing tiers shown on service cards

| Service                 | Range      |
| ----------------------- | ---------- |
| Custom web applications | $15K–$80K  |
| Data-heavy platforms    | $20K–$100K |
| Mobile companions       | $5K–$25K   |

### 6.3 Portfolio template (applied to each case study)

Every case study page follows this structure:

1. Title (anonymized — see naming below)
2. One-line problem framing
3. Hero screenshot (full-width)
4. "What was built" — 5–8 bullet points
5. "Stack" — comma-separated tech list
6. "Outcome" — one factual line where available (latency, scale, user numbers — only stated where verifiable)
7. "What was hard" — 1–2 sentences (the credibility hook)

#### 6.3.1 Case Study A: "Corporate Intelligence Platform"

- **Source repo (private):** Boyk (`/Users/dd/Projects/boyk_dev/`). Presented anonymously; no client name on the public site because Meteopolis is the operator, not the client.
- **Problem framing:** Map corporate ownership across 65,000 companies for consumers making boycott decisions.
- **Stack:** React 19, Vite, Tailwind CSS 4, Supabase (Postgres + RLS), Neo4j AuraDB, AWS App Runner, AWS Lambda (Python ETL), Cloudflare Pages, Cloudflare R2, Cloudflare Workers KV.
- **Outcome:** P95 company-detail latency ≈40ms via four-tier caching (edge → KV → in-memory → R2 fallback).
- **What was hard:** Reconciling conflicting corporate ownership data across five public registries (GLEIF, Wikidata, SEC EDGAR, FEC, OpenCorporates), each with different ID schemes and naming conventions, and keeping every relationship stamped with source + confidence + last-confirmed metadata.

#### 6.3.2 Case Study B: "Historical Media Archive"

- **Source repo (private):** `sequoia_dev` (`/Users/dd/Projects/sequoia_dev/`). Presented as "an archival platform for a private historical research collection." No institution or specific subject named on the public site.
- **Problem framing:** Ingest, organize, and present 3,749 historical media items (photos, PDFs, video — ~12 GB total) for a curated research archive.
- **Stack:** Next.js, Cloudflare R2, Cloudflare Workers, Drizzle ORM, PostgreSQL.
- **Outcome:** 12 GB media pipeline streaming through memory (no local disk), resumable uploads, role-based curator access.
- **What was hard:** Building a streaming Dropbox/Drive → image processing → R2 upload pipeline that processes thousands of large files (TIF, HEIC, 50 MB+ photos) without exceeding memory or local disk on any worker.

#### 6.3.3 Case Study C: "Interactive Corporate Ownership Graph"

- **Source repo (private):** Boyk's force-graph component, presented as a standalone data-visualization commission (separate frame from Case Study A).
- **Problem framing:** Visualize tens of thousands of corporate ownership relationships in a way that lets users explore subgraphs at human scale.
- **Stack:** React, react-force-graph-2d, Three.js for custom node rendering, Neo4j Cypher queries, on-demand subgraph expansion.
- **Outcome:** Renders a 65K-node graph with progressive subgraph expansion; depth controls keep UI responsive at >2K visible nodes.
- **What was hard:** Performance optimization for a force-directed graph at this scale — defaults thrash; required custom node rendering, depth budgets, and a hybrid pre-computed/runtime layout.

### 6.4 About (`/about`)

| Section    | Content                                                                                                                                   |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Header     | Headshot (small, professional) + name + 1-line title (`Independent web developer · founder of Meteopolis LLC`)                            |
| Bio        | 2–3 paragraphs covering background, projects shipped, and reasoning for going independent                                                 |
| How I work | 4–5 bullets — concrete behaviors (e.g., "I work in 2-week milestones with weekly demos," "I write tests," "I deploy to staging on day 3") |
| Values     | Up to 3 bullets — included only if they read as substantive rather than cheesy                                                            |

### 6.5 Contact (`/contact`)

- Email displayed: `hello@meteopolis.com`
- Form fields: name · email · company (optional) · project description (textarea) · budget range (`< $5K` / `$5K–$15K` / `$15K–$50K` / `$50K+`) · timeline (`ASAP` / `within 1 month` / `1–3 months` / `flexible`)
- Optional: Calendly embed for 30-minute intro calls (defaults to off — added only if user requests)
- Single-line note: _"I respond within 24 hours, weekdays."_

### 6.6 Legal pages — content sources

| Page          | Source                                                                                                                 | Variables to set                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/terms`      | Adapt a Bonsai/AND.CO freelance MSA template via the `legal-advisor` agent                                             | LLC name (Meteopolis LLC), governing law (Delaware, per Stripe Atlas incorporation), services description, IP transfer trigger ("on payment in full"), liability cap ("fees paid in last 12 months"), dispute resolution (Delaware courts)                                                                                                                                                       |
| `/privacy`    | Termly privacy-policy generator configured for: contact-form data only, no user accounts, privacy-respecting analytics | LLC name, contact email (`hello@meteopolis.com`), data retention (12 months for inquiry submissions), third-party processors (Cloudflare, Google Workspace, Resend)                                                                                                                                                                                                                              |
| `/engagement` | Custom-written                                                                                                         | Deposit (50% on signing for projects ≤$15K, milestone-based above); cancellation by client (deposit non-refundable, work since deposit refundable pro-rata); cancellation by Meteopolis (pro-rata refund of work not delivered); revisions (per-SOW); payment terms (net-14, late fee after 30 days, work paused after 60 days non-payment); currency (USD via Stripe); governing law (Delaware) |

`/engagement` is the page that satisfies Stripe's required refund policy.

## 7. Tech architecture

### 7.1 Stack

| Layer           | Choice                                                                       |
| --------------- | ---------------------------------------------------------------------------- |
| Framework       | Astro 5.x (HTML-first; ships zero JS by default)                             |
| Styling         | Tailwind CSS 4 (matches Boyk's patterns and theme variables)                 |
| TypeScript      | Strict mode                                                                  |
| Tooling         | ESLint + Prettier + Husky + lint-staged (matches Boyk's pre-commit pipeline) |
| Package manager | npm                                                                          |

### 7.2 Repo

- Project root: `/Users/dd/Projects/meteopolis_dev/`
- Git host: GitHub, private repo `meteopolis-dev`. Make public after Stripe approves the LLC.

### 7.3 Directory layout

```
meteopolis_dev/
├── public/
│   ├── favicon.svg
│   ├── og-image.png
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── ServiceCard.astro
│   │   ├── CaseStudyCard.astro
│   │   └── ContactForm.astro
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── CaseStudyLayout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── work.astro
│   │   ├── work/
│   │   │   ├── corporate-intelligence-platform.astro
│   │   │   ├── historical-media-archive.astro
│   │   │   └── interactive-ownership-graph.astro
│   │   ├── about.astro
│   │   ├── contact.astro
│   │   ├── terms.astro
│   │   ├── privacy.astro
│   │   └── engagement.astro
│   ├── content/
│   └── styles/
│       └── global.css
├── functions/
│   └── api/
│       └── contact.ts
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
├── package.json
├── wrangler.toml
├── .github/workflows/deploy.yml
├── .env.example
└── README.md
```

### 7.4 Contact form backend

- **Cloudflare Pages Function** at `functions/api/contact.ts`
- Receives POST, validates inputs, sends email via **Resend** API to `hello@meteopolis.com`
- Honeypot field for bot filtering
- One env var: `RESEND_API_KEY` (set in CF Pages dashboard, never committed)
- Rate limiting handled by Cloudflare's edge WAF (no custom code)

### 7.5 Deployment pipeline

| Step            | Tool                                                                            |
| --------------- | ------------------------------------------------------------------------------- |
| Source of truth | GitHub `meteopolis-dev` repo                                                    |
| CI              | GitHub Actions: ESLint + Prettier check + Astro build + `wrangler pages deploy` |
| Hosting         | Cloudflare Pages (project name: `meteopolis`)                                   |
| Custom domain   | `meteopolis.com` (apex) + `www.meteopolis.com` (301 redirect to apex)           |
| HTTPS           | Cloudflare Universal SSL, auto-provisioned                                      |

### 7.6 Analytics

- **Cloudflare Web Analytics** — privacy-respecting, no cookies, no consent banner needed. Embedded via the snippet from CF dashboard.
- Google Analytics is explicitly rejected (forces a cookie banner under GDPR/CCPA, slows the site).

### 7.7 Performance budget

| Metric                                 | Target   |
| -------------------------------------- | -------- |
| Lighthouse Performance (mobile)        | 100/100  |
| Largest Contentful Paint               | < 1.5s   |
| Total JavaScript shipped               | < 10 KB  |
| Total CSS (Tailwind purged)            | < 30 KB  |
| Total page weight including hero image | < 250 KB |

## 8. DNS migration sequencing

Order matters because nameserver propagation takes 1–24 hours and we must not break Google Workspace email.

### 8.1 Phase A — Cloudflare-side preparation (zero risk, fully reversible)

1. Add `meteopolis.com` as a new site in Cloudflare on the Free plan. CF auto-scans existing DNS.
2. Audit imported records:
   - **Delete:** `A @ → 74.91.138.134`
   - **Delete:** `A www → 74.91.138.134`
   - **Keep exactly:** `MX @ → smtp.google.com` (priority 1)
   - **Keep exactly:** `TXT @ → google-site-verification=0pnB10TpZmL0A_VntROT9piKvpXck37wPEVdiJGcAH8`
3. Add hardening records (do not change behavior; improve email deliverability):
   - `TXT @ → "v=spf1 include:_spf.google.com ~all"` (SPF)
   - `TXT _dmarc → "v=DMARC1; p=none; rua=mailto:hello@meteopolis.com"` (DMARC monitor mode)
4. Note the two assigned Cloudflare nameservers (e.g., `someword.ns.cloudflare.com`).

Up to this point, nothing has changed for the live site or email. Network Solutions is still authoritative.

### 8.2 Phase B — The flip (the only risky moment)

5. In Network Solutions: Domain Settings → Nameservers → change from `ns1.worldnic.com`/`ns2.worldnic.com` to the two Cloudflare nameserver values from step 4. Save.
6. Propagation: 1–24 hours; most resolvers within 1–4 hours.

### 8.3 Phase C — Verification (~1 hour after the flip)

7. Run:
   ```
   dig meteopolis.com NS +short        # should show CF nameservers
   dig meteopolis.com MX +short        # should still return smtp.google.com
   dig meteopolis.com TXT +short       # should show google-site-verification + spf
   ```
8. Send a test email from a Gmail account _to_ `hello@meteopolis.com`. Verify delivery within 60 seconds. Reply _from_ `hello@meteopolis.com`; verify outbound also flows. Email is the only thing that can break in this migration; if it works after the flip, the migration is safe.

### 8.4 Phase D — Site cutover

9. Build site (handled by the implementation plan, not this design).
10. Deploy to Cloudflare Pages → produces `meteopolis.pages.dev` URL.
11. In CF Pages project settings → Custom domains → add `meteopolis.com` and `www.meteopolis.com`. Cloudflare auto-creates the CNAME records inside the zone.
12. Site is live at `https://meteopolis.com`.

### 8.5 Phase E — Cleanup & extras

13. Cancel Network Solutions hosting line item (if present). Keep just the domain registration.
14. Add DKIM (recommended for email deliverability): Google Admin → Apps → Google Workspace → Gmail → Authenticate email → Generate. Copy the resulting TXT record into Cloudflare DNS.
15. Submit Stripe Atlas activation. Domain matches the application; all required pages present; "active site" check passes.

## 9. Out of scope

The following are explicitly NOT part of this spec or implementation plan:

- Blog or content marketing system
- Client portal / authenticated areas
- E-commerce / cart / checkout
- Multi-language support
- Live chat
- Newsletter signup or mailing list integration
- A/B testing infrastructure
- A separate staging environment (preview deploys via Cloudflare Pages branch deploys are sufficient)

## 10. Success criteria

The implementation is complete when ALL of the following are true:

1. `https://meteopolis.com` resolves and serves the Astro-built site (no Network Solutions placeholder)
2. All ten pages listed in §5.1 render correctly and pass Lighthouse mobile 100/100
3. Contact form submits successfully and delivers email to `hello@meteopolis.com` via Resend
4. Google Workspace email continues to work without interruption (verified by sending and receiving test emails after migration)
5. SPF + DMARC records are in place; DKIM is verified in Google Admin
6. Network Solutions hosting (if any line item existed) is cancelled
7. Stripe Atlas activation is submitted with `meteopolis.com` as the business website, and Stripe's automated site check passes (or Stripe support confirms approval)

## 11. Open variables — resolved during implementation, not before

These are intentional placeholders to be filled in during the build, not gaps in the design:

- Founder photo: placeholder during build, real photo swapped in before launch
- Exact bio copy: drafted during implementation, reviewed before launch
- Calendly link: defaults to disabled; enabled only if requested
- Specific hero image (if any): selected during build with Lighthouse impact in mind
- GitHub repo visibility: stays private until Stripe approves activation
