# Meteopolis Business Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `meteopolis.com` — a Stripe-acceptable freelance business website for Meteopolis LLC — built on Astro + Tailwind, deployed to Cloudflare Pages, with DNS migrated from Network Solutions to Cloudflare while preserving Google Workspace email.

**Architecture:** Static-first Astro site (zero JS by default) with a single Cloudflare Pages Function for the contact form (Resend SMTP). DNS lives on Cloudflare; email continues on Google Workspace. The repo is `/Users/dd/Projects/meteopolis_dev/`, deployed via GitHub Actions on push to main.

**Tech Stack:** Astro 5.x · Tailwind CSS 4 · TypeScript (strict) · Cloudflare Pages · Cloudflare Pages Functions · Resend · Vitest · Playwright · GitHub Actions · Cloudflare DNS

**Spec reference:** `docs/superpowers/specs/2026-05-03-meteopolis-business-site-design.md`

---

## File structure overview

| File                                                             | Responsibility                                         |
| ---------------------------------------------------------------- | ------------------------------------------------------ |
| `package.json`                                                   | Dependencies, scripts                                  |
| `astro.config.mjs`                                               | Astro config, Tailwind Vite plugin, Cloudflare adapter |
| `tsconfig.json`                                                  | Strict TypeScript                                      |
| `tailwind.config.mjs`                                            | (Tailwind 4 — minimal; CSS-first config)               |
| `.gitignore`, `.env.example`, `README.md`                        | Standard repo hygiene                                  |
| `eslint.config.mjs`, `.prettierrc`, `.husky/pre-commit`          | Lint + format gates                                    |
| `playwright.config.ts`, `vitest.config.ts`                       | Test runners                                           |
| `src/layouts/BaseLayout.astro`                                   | HTML shell, `<head>`, OG meta, header, footer          |
| `src/layouts/CaseStudyLayout.astro`                              | Case-study sub-template                                |
| `src/components/Header.astro`                                    | Top nav                                                |
| `src/components/Footer.astro`                                    | Footer with legal links                                |
| `src/components/Hero.astro`                                      | Homepage hero                                          |
| `src/components/ServiceCard.astro`                               | Service tile with pricing                              |
| `src/components/CaseStudyCard.astro`                             | Portfolio teaser card                                  |
| `src/components/ContactForm.astro`                               | Contact form HTML                                      |
| `src/styles/global.css`                                          | Tailwind import + theme CSS variables                  |
| `src/pages/index.astro`                                          | Homepage                                               |
| `src/pages/work.astro`                                           | Portfolio listing                                      |
| `src/pages/work/corporate-intelligence-platform.astro`           | Case study A                                           |
| `src/pages/work/historical-media-archive.astro`                  | Case study B                                           |
| `src/pages/work/interactive-ownership-graph.astro`               | Case study C                                           |
| `src/pages/about.astro`                                          | Founder bio                                            |
| `src/pages/contact.astro`                                        | Contact page                                           |
| `src/pages/terms.astro`                                          | Terms of Service                                       |
| `src/pages/privacy.astro`                                        | Privacy Policy                                         |
| `src/pages/engagement.astro`                                     | Engagement & Refund Policy                             |
| `functions/api/contact.ts`                                       | Cloudflare Pages Function — POST handler               |
| `tests/e2e/*.spec.ts`                                            | Playwright smoke tests                                 |
| `tests/unit/*.test.ts`                                           | Vitest component/handler tests                         |
| `wrangler.toml`                                                  | CF Pages config                                        |
| `.github/workflows/deploy.yml`                                   | CI deploy                                              |
| `public/favicon.svg`, `public/og-image.png`, `public/robots.txt` | Static assets                                          |

---

## Phase 1: Repo scaffolding

### Task 1: Initialize Astro + Tailwind 4 + TypeScript strict

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/package.json`
- Create: `/Users/dd/Projects/meteopolis_dev/astro.config.mjs`
- Create: `/Users/dd/Projects/meteopolis_dev/tsconfig.json`
- Create: `/Users/dd/Projects/meteopolis_dev/src/styles/global.css`
- Create: `/Users/dd/Projects/meteopolis_dev/.gitignore`

- [ ] **Step 1: Bootstrap Astro project files manually**

```bash
cd /Users/dd/Projects/meteopolis_dev
```

Write `package.json`:

```json
{
  "name": "meteopolis-dev",
  "version": "0.1.0",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview",
    "astro": "astro",
    "lint": "eslint . --ext .astro,.ts,.tsx,.js,.jsx",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "prepare": "husky"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.0",
    "@astrojs/cloudflare": "^12.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "tailwindcss": "^4.0.0",
    "typescript": "^5.6.0"
  }
}
```

Write `astro.config.mjs`:

```javascript
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://meteopolis.com",
  output: "static",
  adapter: cloudflare({ mode: "directory" }),
  vite: {
    plugins: [tailwindcss()],
  },
});
```

Write `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", "functions/**/*"],
  "exclude": ["dist"]
}
```

Write `src/styles/global.css`:

```css
@import "tailwindcss";

:root {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --color-bg: 0 0% 100%;
  --color-fg: 220 13% 13%;
  --color-muted: 220 9% 46%;
  --color-accent: 220 90% 50%;
  --color-border: 220 13% 91%;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: 220 13% 8%;
    --color-fg: 220 13% 95%;
    --color-muted: 220 9% 60%;
    --color-border: 220 13% 18%;
  }
}

html {
  font-family: var(--font-sans);
  background: hsl(var(--color-bg));
  color: hsl(var(--color-fg));
}
```

Write `.gitignore`:

```
node_modules/
dist/
.astro/
.wrangler/
.env
.env.local
.DS_Store
*.log
playwright-report/
test-results/
```

- [ ] **Step 2: Install dependencies**

Run: `cd /Users/dd/Projects/meteopolis_dev && npm install`
Expected: completes without errors; creates `node_modules/` and `package-lock.json`.

- [ ] **Step 3: Verify dev server boots**

Run: `npm run dev`
Expected: `astro dev` boots on `http://localhost:4321`. Press Ctrl+C to stop.

- [ ] **Step 4: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/styles/global.css .gitignore package-lock.json
git commit -m "feat: scaffold astro + tailwind 4 + typescript strict"
```

---

### Task 2: Configure ESLint + Prettier + Husky pre-commit hooks

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/eslint.config.mjs`
- Create: `/Users/dd/Projects/meteopolis_dev/.prettierrc`
- Create: `/Users/dd/Projects/meteopolis_dev/.prettierignore`
- Create: `/Users/dd/Projects/meteopolis_dev/.husky/pre-commit`
- Modify: `/Users/dd/Projects/meteopolis_dev/package.json` (add lint-staged config)

- [ ] **Step 1: Install lint/format dependencies**

```bash
cd /Users/dd/Projects/meteopolis_dev
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin \
  eslint-plugin-astro prettier prettier-plugin-astro prettier-plugin-tailwindcss \
  husky lint-staged
```

- [ ] **Step 2: Write `eslint.config.mjs`**

```javascript
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import astroPlugin from "eslint-plugin-astro";

export default [
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: { parser: tsParser },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
  ...astroPlugin.configs.recommended,
  { ignores: ["dist/", "node_modules/", ".astro/", ".wrangler/"] },
];
```

- [ ] **Step 3: Write `.prettierrc`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],
  "overrides": [{ "files": "*.astro", "options": { "parser": "astro" } }]
}
```

- [ ] **Step 4: Write `.prettierignore`**

```
node_modules
dist
.astro
.wrangler
package-lock.json
```

- [ ] **Step 5: Add lint-staged config to `package.json`**

Add at the bottom of `package.json` (before the closing `}`):

```json
,
  "lint-staged": {
    "*.{ts,tsx,js,jsx,astro}": ["eslint --fix", "prettier --write"],
    "*.{json,md,css}": ["prettier --write"]
  }
```

- [ ] **Step 6: Initialize Husky**

```bash
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

- [ ] **Step 7: Verify lint runs clean**

Run: `npm run lint`
Expected: no errors (the only file lint sees so far is `astro.config.mjs`).

- [ ] **Step 8: Commit**

```bash
git add eslint.config.mjs .prettierrc .prettierignore .husky/ package.json package-lock.json
git commit -m "feat: add eslint, prettier, husky pre-commit hooks"
```

---

### Task 3: Set up Vitest + Playwright

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/vitest.config.ts`
- Create: `/Users/dd/Projects/meteopolis_dev/playwright.config.ts`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/unit/.gitkeep`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/.gitkeep`

- [ ] **Step 1: Install test runners**

```bash
cd /Users/dd/Projects/meteopolis_dev
npm install -D vitest happy-dom @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Write `vitest.config.ts`**

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["tests/unit/**/*.test.ts"],
  },
});
```

- [ ] **Step 3: Write `playwright.config.ts`**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4321",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 5"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4321",
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 4: Create empty test directories**

```bash
mkdir -p tests/unit tests/e2e && touch tests/unit/.gitkeep tests/e2e/.gitkeep
```

- [ ] **Step 5: Verify Vitest runs (with no tests)**

Run: `npm run test`
Expected: Vitest reports "No test files found" — that's fine; test setup is valid.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.ts playwright.config.ts tests/ package.json package-lock.json
git commit -m "feat: configure vitest and playwright"
```

---

## Phase 2: Layout & shared components

### Task 4: BaseLayout — HTML shell with head, OG meta, header, footer

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/layouts/BaseLayout.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/base-layout.spec.ts`

- [ ] **Step 1: Write the failing E2E test**

Write `tests/e2e/base-layout.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("homepage has correct title and meta tags", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Meteopolis/);
  const description = await page
    .locator('meta[name="description"]')
    .getAttribute("content");
  expect(description).toBeTruthy();
  expect(description!.length).toBeGreaterThan(50);
});

test("homepage has Open Graph meta tags", async ({ page }) => {
  await page.goto("/");
  const ogTitle = await page
    .locator('meta[property="og:title"]')
    .getAttribute("content");
  const ogImage = await page
    .locator('meta[property="og:image"]')
    .getAttribute("content");
  expect(ogTitle).toContain("Meteopolis");
  expect(ogImage).toMatch(/og-image\.png/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- --project=chromium tests/e2e/base-layout.spec.ts`
Expected: FAIL — homepage doesn't exist yet.

- [ ] **Step 3: Write `BaseLayout.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title?: string;
  description?: string;
  image?: string;
}

const {
  title = 'Meteopolis — Web apps for teams that need more than a landing page',
  description = 'Meteopolis builds custom web applications, data-heavy platforms, and mobile companions. Senior independent engineering for projects too complex for a junior contractor and too short-lived for a full-time hire.',
  image = '/og-image.png',
} = Astro.props;

const canonical = new URL(Astro.url.pathname, Astro.site).toString();
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="canonical" href={canonical} />
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:image" content={new URL(image, Astro.site).toString()} />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#0040FF" />
  </head>
  <body class="min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
    <slot name="header" />
    <main class="mx-auto max-w-5xl px-6 py-16">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

(Header and Footer slots will be filled by Tasks 5 and 6; we leave the slots empty for now so the homepage placeholder can validate meta tags.)

- [ ] **Step 4: Create temporary `src/pages/index.astro` for the test to load against**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout>
  <h1>Meteopolis</h1>
</BaseLayout>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:e2e -- --project=chromium tests/e2e/base-layout.spec.ts`
Expected: PASS — both tests green.

- [ ] **Step 6: Create placeholder favicon and OG image**

```bash
# Minimal placeholder favicon — pure black square SVG
cat > /Users/dd/Projects/meteopolis_dev/public/favicon.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0040FF"/></svg>
EOF
mkdir -p /Users/dd/Projects/meteopolis_dev/public
# OG image placeholder — replace before launch with real branded image
# For now create a 1200x630 PNG via ImageMagick or just an empty placeholder file
touch /Users/dd/Projects/meteopolis_dev/public/og-image.png
```

(The real OG image gets generated in Task 28 before launch; this placeholder lets tests pass.)

- [ ] **Step 7: Commit**

```bash
git add src/layouts/BaseLayout.astro src/pages/index.astro public/ tests/e2e/base-layout.spec.ts
git commit -m "feat: BaseLayout with head, OG meta, slots for header/footer"
```

---

### Task 5: Header component (top nav)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/components/Header.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/header.spec.ts`
- Modify: `/Users/dd/Projects/meteopolis_dev/src/layouts/BaseLayout.astro` (slot in header)

- [ ] **Step 1: Write the failing E2E test**

Write `tests/e2e/header.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

test("header shows Meteopolis logo linking home", async ({ page }) => {
  await page.goto("/");
  const logo = page.locator('header a[href="/"]').first();
  await expect(logo).toContainText("Meteopolis");
});

test("header has Work, About, Contact nav links", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('header a[href="/work"]')).toHaveText(/Work/);
  await expect(page.locator('header a[href="/about"]')).toHaveText(/About/);
  await expect(page.locator('header a[href="/contact"]')).toHaveText(/Contact/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:e2e -- --project=chromium tests/e2e/header.spec.ts`
Expected: FAIL — no header element exists.

- [ ] **Step 3: Write `Header.astro`**

```astro
---
const navLinks = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];
---

<header class="border-b border-neutral-200 dark:border-neutral-800">
  <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
    <a href="/" class="text-lg font-semibold tracking-tight">
      Meteopolis
    </a>
    <nav>
      <ul class="flex gap-6 text-sm">
        {navLinks.map((link) => (
          <li>
            <a
              href={link.href}
              class="text-neutral-700 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>
```

- [ ] **Step 4: Update `BaseLayout.astro` to render Header**

In `src/layouts/BaseLayout.astro`, replace the `<slot name="header" />` line with:

```astro
---
// (existing imports + props)
import Header from '../components/Header.astro';
---
```

And in the body:

```astro
<body class="min-h-screen bg-white text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-100">
  <Header />
  <main class="mx-auto max-w-5xl px-6 py-16">
    <slot />
  </main>
  <slot name="footer" />
</body>
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm run test:e2e -- --project=chromium tests/e2e/header.spec.ts`
Expected: PASS — all three nav links present, logo links home.

- [ ] **Step 6: Commit**

```bash
git add src/components/Header.astro src/layouts/BaseLayout.astro tests/e2e/header.spec.ts
git commit -m "feat: header component with logo and nav"
```

---

### Task 6: Footer component (legal links + brand line)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/components/Footer.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/footer.spec.ts`
- Modify: `/Users/dd/Projects/meteopolis_dev/src/layouts/BaseLayout.astro`

- [ ] **Step 1: Write the failing E2E test**

```typescript
import { test, expect } from "@playwright/test";

test("footer links to all three legal pages", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator('footer a[href="/terms"]')).toHaveText(/Terms/);
  await expect(page.locator('footer a[href="/privacy"]')).toHaveText(/Privacy/);
  await expect(page.locator('footer a[href="/engagement"]')).toHaveText(
    /Engagement/,
  );
});

test("footer shows current year and LLC copyright", async ({ page }) => {
  await page.goto("/");
  const footer = page.locator("footer");
  await expect(footer).toContainText("Meteopolis LLC");
  await expect(footer).toContainText("2026");
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/footer.spec.ts`
Expected: FAIL — no footer element.

- [ ] **Step 3: Write `Footer.astro`**

```astro
---
const legalLinks = [
  { href: '/terms', label: 'Terms' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/engagement', label: 'Engagement Policy' },
];
const year = new Date().getFullYear();
---

<footer class="mt-24 border-t border-neutral-200 dark:border-neutral-800">
  <div class="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10 text-sm text-neutral-600 sm:flex-row sm:items-center sm:justify-between dark:text-neutral-400">
    <ul class="flex gap-5">
      {legalLinks.map((link) => (
        <li>
          <a href={link.href} class="hover:text-neutral-900 dark:hover:text-white">
            {link.label}
          </a>
        </li>
      ))}
    </ul>
    <p class="font-mono text-xs">
      © {year} Meteopolis LLC · meteopolis.com
    </p>
  </div>
</footer>
```

- [ ] **Step 4: Wire Footer into `BaseLayout.astro`**

```astro
---
// (existing imports)
import Footer from '../components/Footer.astro';
---
```

In the body, replace the empty `<slot name="footer" />` line with `<Footer />`.

- [ ] **Step 5: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/footer.spec.ts`
Expected: PASS — all four assertions green.

- [ ] **Step 6: Commit**

```bash
git add src/components/Footer.astro src/layouts/BaseLayout.astro tests/e2e/footer.spec.ts
git commit -m "feat: footer with legal links and copyright"
```

---

## Phase 3: Reusable content components

### Task 7: Hero component (homepage hero)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/components/Hero.astro`

- [ ] **Step 1: Write `Hero.astro`**

```astro
---
interface Props {
  headline: string;
  subhead: string;
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
}

const { headline, subhead, primaryCta, secondaryCta } = Astro.props;
---

<section class="py-20 sm:py-28">
  <h1 class="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
    {headline}
  </h1>
  <p class="mt-6 max-w-2xl text-lg text-neutral-600 dark:text-neutral-400">
    {subhead}
  </p>
  <div class="mt-10 flex flex-wrap gap-4">
    <a
      href={primaryCta.href}
      class="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      {primaryCta.label}
    </a>
    {secondaryCta && (
      <a
        href={secondaryCta.href}
        class="rounded-md border border-neutral-300 px-5 py-2.5 text-sm font-medium transition hover:bg-neutral-100 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        {secondaryCta.label}
      </a>
    )}
  </div>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: hero component with headline, subhead, and CTAs"
```

---

### Task 8: ServiceCard component (with pricing)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/components/ServiceCard.astro`

- [ ] **Step 1: Write `ServiceCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  priceRange: string;
}

const { title, description, priceRange } = Astro.props;
---

<article class="rounded-lg border border-neutral-200 p-6 dark:border-neutral-800">
  <h3 class="text-lg font-semibold tracking-tight">{title}</h3>
  <p class="mt-3 text-sm text-neutral-600 dark:text-neutral-400">
    {description}
  </p>
  <p class="mt-6 text-xs uppercase tracking-wide text-neutral-500 dark:text-neutral-500">
    Typical engagement: <span class="font-medium text-neutral-700 dark:text-neutral-300">{priceRange}</span>
  </p>
</article>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ServiceCard.astro
git commit -m "feat: service card with pricing range"
```

---

### Task 9: CaseStudyCard component (portfolio teaser)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/components/CaseStudyCard.astro`

- [ ] **Step 1: Write `CaseStudyCard.astro`**

```astro
---
interface Props {
  href: string;
  title: string;
  problem: string;
  imageSrc?: string;
  imageAlt?: string;
}

const { href, title, problem, imageSrc, imageAlt } = Astro.props;
---

<a
  href={href}
  class="group block overflow-hidden rounded-lg border border-neutral-200 transition hover:border-neutral-400 dark:border-neutral-800 dark:hover:border-neutral-600"
>
  {imageSrc && (
    <div class="aspect-video w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
      <img
        src={imageSrc}
        alt={imageAlt ?? ''}
        class="h-full w-full object-cover transition group-hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
  )}
  <div class="p-6">
    <h3 class="text-lg font-semibold tracking-tight">{title}</h3>
    <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{problem}</p>
    <p class="mt-4 text-sm font-medium text-neutral-900 group-hover:underline dark:text-white">
      Read case study →
    </p>
  </div>
</a>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CaseStudyCard.astro
git commit -m "feat: case study card for portfolio grid"
```

---

### Task 10: CaseStudyLayout (sub-template for case-study pages)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/layouts/CaseStudyLayout.astro`

- [ ] **Step 1: Write `CaseStudyLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  problem: string;
  stack: string[];
  outcome?: string;
  whatWasHard: string;
  imageSrc?: string;
  imageAlt?: string;
}

const { title, problem, stack, outcome, whatWasHard, imageSrc, imageAlt } = Astro.props;
---

<BaseLayout title={`${title} · Meteopolis`} description={problem}>
  <article>
    <p class="text-sm uppercase tracking-wide text-neutral-500">Case study</p>
    <h1 class="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
    <p class="mt-4 max-w-2xl text-lg text-neutral-700 dark:text-neutral-300">{problem}</p>

    {imageSrc && (
      <img
        src={imageSrc}
        alt={imageAlt ?? ''}
        class="mt-10 w-full rounded-lg border border-neutral-200 dark:border-neutral-800"
        loading="lazy"
      />
    )}

    <section class="mt-12">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500">What was built</h2>
      <div class="prose prose-neutral mt-4 max-w-none dark:prose-invert">
        <slot />
      </div>
    </section>

    <section class="mt-10">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500">Stack</h2>
      <p class="mt-2 font-mono text-sm text-neutral-700 dark:text-neutral-300">{stack.join(', ')}</p>
    </section>

    {outcome && (
      <section class="mt-10">
        <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500">Outcome</h2>
        <p class="mt-2 text-neutral-800 dark:text-neutral-200">{outcome}</p>
      </section>
    )}

    <section class="mt-10">
      <h2 class="text-sm font-semibold uppercase tracking-wide text-neutral-500">What was hard</h2>
      <p class="mt-2 text-neutral-800 dark:text-neutral-200">{whatWasHard}</p>
    </section>

    <div class="mt-16 border-t border-neutral-200 pt-8 dark:border-neutral-800">
      <a href="/work" class="text-sm font-medium hover:underline">← All work</a>
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/CaseStudyLayout.astro
git commit -m "feat: case study layout"
```

---

## Phase 4: Pages

### Task 11: Homepage (`/`)

**Files:**

- Modify: `/Users/dd/Projects/meteopolis_dev/src/pages/index.astro` (replace placeholder)
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/homepage.spec.ts`

- [ ] **Step 1: Write the failing E2E test**

```typescript
import { test, expect } from "@playwright/test";

test("homepage hero shows the tagline", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("Web apps for teams");
});

test("homepage shows three service cards with prices", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Custom web applications")).toBeVisible();
  await expect(page.getByText("Data-heavy platforms")).toBeVisible();
  await expect(page.getByText("Mobile companions")).toBeVisible();
  await expect(page.getByText(/\$15K.*\$80K/)).toBeVisible();
});

test("homepage shows two featured case studies", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Corporate Intelligence Platform")).toBeVisible();
  await expect(page.getByText("Historical Media Archive")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/homepage.spec.ts`
Expected: FAIL — current homepage is just placeholder.

- [ ] **Step 3: Write the homepage**

Replace `src/pages/index.astro`:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import ServiceCard from '../components/ServiceCard.astro';
import CaseStudyCard from '../components/CaseStudyCard.astro';

const services = [
  {
    title: 'Custom web applications',
    description:
      'Full-stack builds: React or Astro on the front, Postgres or Neo4j on the back, deployed on Cloudflare or AWS. Auth, dashboards, integrations, the works.',
    priceRange: '$15K–$80K',
  },
  {
    title: 'Data-heavy platforms',
    description:
      'Knowledge graphs, search, ETL pipelines, admin tooling. For products where the database design matters as much as the UI.',
    priceRange: '$20K–$100K',
  },
  {
    title: 'Mobile companions',
    description:
      'Native iOS or Chrome extensions extending an existing web product. For when "we have a great web app and need a mobile presence" is the brief.',
    priceRange: '$5K–$25K',
  },
];

const featured = [
  {
    href: '/work/corporate-intelligence-platform',
    title: 'Corporate Intelligence Platform',
    problem: 'Map corporate ownership across 65,000 companies for consumers making boycott decisions.',
  },
  {
    href: '/work/historical-media-archive',
    title: 'Historical Media Archive',
    problem: 'Ingest, organize, and present 3,749 historical media items for a curated research collection.',
  },
];
---

<BaseLayout>
  <Hero
    headline="Web apps for teams that need more than a landing page."
    subhead="Custom full-stack systems — the engineering kind. Knowledge graphs, archives, dashboards, mobile companions, and the data pipelines that feed them."
    primaryCta={{ href: '/work', label: 'See the work →' }}
    secondaryCta={{ href: '/contact', label: 'Get in touch' }}
  />

  <section class="mt-24">
    <h2 class="text-2xl font-semibold tracking-tight">What I build</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      {services.map((s) => <ServiceCard {...s} />)}
    </div>
  </section>

  <section class="mt-24">
    <h2 class="text-2xl font-semibold tracking-tight">Recent work</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-2">
      {featured.map((c) => <CaseStudyCard {...c} />)}
    </div>
    <p class="mt-8">
      <a href="/work" class="text-sm font-medium hover:underline">All work →</a>
    </p>
  </section>

  <section class="mt-24 rounded-lg border border-neutral-200 p-10 dark:border-neutral-800">
    <h2 class="text-2xl font-semibold tracking-tight">Working on something hard?</h2>
    <p class="mt-3 text-neutral-600 dark:text-neutral-400">
      Tell me about your project. I respond within 24 hours, weekdays.
    </p>
    <a
      href="mailto:hello@meteopolis.com"
      class="mt-6 inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      hello@meteopolis.com
    </a>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/homepage.spec.ts`
Expected: PASS — all three tests green.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro tests/e2e/homepage.spec.ts
git commit -m "feat: homepage with hero, services, featured work, and CTA"
```

---

### Task 12: `/work` portfolio listing

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/work.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/work.spec.ts`

- [ ] **Step 1: Write the failing test**

```typescript
import { test, expect } from "@playwright/test";

test("work page lists all three case studies", async ({ page }) => {
  await page.goto("/work");
  await expect(page.locator("h1")).toContainText("Work");
  await expect(page.getByText("Corporate Intelligence Platform")).toBeVisible();
  await expect(page.getByText("Historical Media Archive")).toBeVisible();
  await expect(
    page.getByText("Interactive Corporate Ownership Graph"),
  ).toBeVisible();
});

test("clicking a case study card navigates to its detail page", async ({
  page,
}) => {
  await page.goto("/work");
  await page.getByText("Corporate Intelligence Platform").click();
  await expect(page).toHaveURL(/work\/corporate-intelligence-platform/);
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/work.spec.ts`
Expected: FAIL — page doesn't exist.

- [ ] **Step 3: Write `src/pages/work.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import CaseStudyCard from '../components/CaseStudyCard.astro';

const cases = [
  {
    href: '/work/corporate-intelligence-platform',
    title: 'Corporate Intelligence Platform',
    problem: 'Map corporate ownership across 65,000 companies for consumers making boycott decisions.',
  },
  {
    href: '/work/historical-media-archive',
    title: 'Historical Media Archive',
    problem: 'Ingest, organize, and present 3,749 historical media items for a curated research collection.',
  },
  {
    href: '/work/interactive-ownership-graph',
    title: 'Interactive Corporate Ownership Graph',
    problem: 'Visualize tens of thousands of corporate ownership relationships at human scale.',
  },
];
---

<BaseLayout title="Work · Meteopolis" description="Recent projects: corporate intelligence, archival platforms, and data visualization.">
  <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Work</h1>
  <p class="mt-4 max-w-2xl text-lg text-neutral-700 dark:text-neutral-300">
    A few recent projects. Each one started with a hard problem at the data layer and worked outward.
  </p>

  <div class="mt-12 grid gap-6 md:grid-cols-2">
    {cases.map((c) => <CaseStudyCard {...c} />)}
  </div>
</BaseLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/work.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/work.astro tests/e2e/work.spec.ts
git commit -m "feat: /work portfolio listing"
```

---

### Task 13: `/work/corporate-intelligence-platform` (Case Study A)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/work/corporate-intelligence-platform.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/case-a.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("case study A renders with stack and outcome", async ({ page }) => {
  await page.goto("/work/corporate-intelligence-platform");
  await expect(page.locator("h1")).toContainText(
    "Corporate Intelligence Platform",
  );
  await expect(page.getByText(/Neo4j/)).toBeVisible();
  await expect(page.getByText(/65,000 companies/)).toBeVisible();
  await expect(page.getByText("What was hard")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/case-a.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the page**

```astro
---
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  title="Corporate Intelligence Platform"
  problem="Map corporate ownership across 65,000 companies for consumers making boycott decisions."
  stack={[
    'React 19',
    'Vite',
    'Tailwind CSS 4',
    'Supabase (Postgres + RLS)',
    'Neo4j AuraDB',
    'AWS App Runner',
    'AWS Lambda (Python ETL)',
    'Cloudflare Pages',
    'Cloudflare R2',
    'Cloudflare Workers KV',
  ]}
  outcome="P95 company-detail latency ≈40ms via four-tier caching: edge cache → Workers KV → in-memory LRU → R2 static fallback."
  whatWasHard="Reconciling conflicting corporate-ownership data across five public registries (GLEIF, Wikidata, SEC EDGAR, FEC, OpenCorporates), each with different ID schemes and naming conventions, and keeping every relationship stamped with source + confidence + last-confirmed metadata so a journalist could audit the citation chain."
>
  <ul>
    <li>React + Vite frontend on Cloudflare Pages, with iOS app and Chrome extension as additional surfaces.</li>
    <li>Supabase Postgres (with row-level security) for users, accounts, and boycott data.</li>
    <li>Neo4j AuraDB for a 65K-company / 38K-brand / 77K-product knowledge graph; subsidiary, supplier, ownership, brand-of relationships modeled as typed edges.</li>
    <li>Express API on AWS App Runner serving Cypher queries, fronted by a four-tier read cache.</li>
    <li>Daily Python ETL on AWS Lambda enriches the graph from public registries; idempotent, resumable, checkpointed across 27 stages.</li>
    <li>21K company logos batch-uploaded to R2, served via Cloudflare's CDN.</li>
    <li>Sentry APM tracing across the API; rate-limiting, sanitized error messages, security audit completed.</li>
  </ul>
</CaseStudyLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/case-a.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/work/corporate-intelligence-platform.astro tests/e2e/case-a.spec.ts
git commit -m "feat: case study A — corporate intelligence platform"
```

---

### Task 14: `/work/historical-media-archive` (Case Study B)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/work/historical-media-archive.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/case-b.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("case study B renders archive details", async ({ page }) => {
  await page.goto("/work/historical-media-archive");
  await expect(page.locator("h1")).toContainText("Historical Media Archive");
  await expect(page.getByText(/3,749/)).toBeVisible();
  await expect(page.getByText(/Cloudflare R2/)).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/case-b.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the page**

```astro
---
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  title="Historical Media Archive"
  problem="Ingest, organize, and present 3,749 historical media items (~12 GB) for a private curated research collection."
  stack={[
    'Next.js',
    'Cloudflare R2',
    'Cloudflare Workers',
    'Drizzle ORM',
    'PostgreSQL',
    'sharp (image processing)',
  ]}
  outcome="12 GB media pipeline streaming through memory (no local disk), resumable uploads, role-based curator access. ~1,200 images, ~2,300 PDFs, ~14 videos surfaced through a fast search and timeline UI."
  whatWasHard="The pipeline reads from Dropbox and Drive, processes large source files (TIF, HEIC, 50 MB+ photos) through sharp, and uploads to R2 — without exceeding worker memory or local disk on any single file. Streaming end-to-end with backpressure was the part that took the most iteration."
>
  <ul>
    <li>Source ingestion from Dropbox (3,566 files) and Google Drive (61 files) via the official APIs.</li>
    <li>Image processing pipeline: TIF/HEIC → JPEG/WebP normalization, max 2000px originals, 400px thumbnails.</li>
    <li>PDF first-page thumbnail extraction; video poster-frame placeholders.</li>
    <li>R2 upload via S3-compatible API; deduplication via SHA hashes.</li>
    <li>Postgres schema (Drizzle ORM): voyages, people, media, sources — with junction tables for many-to-many relationships and human-readable slugs as primary keys.</li>
    <li>Permissioned curator UI for editing metadata, with an audit log of changes.</li>
    <li>Strict 3NF normalization; "thick database" approach (filter on server, not in app).</li>
  </ul>
</CaseStudyLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/case-b.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/work/historical-media-archive.astro tests/e2e/case-b.spec.ts
git commit -m "feat: case study B — historical media archive"
```

---

### Task 15: `/work/interactive-ownership-graph` (Case Study C)

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/work/interactive-ownership-graph.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/case-c.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("case study C renders graph viz details", async ({ page }) => {
  await page.goto("/work/interactive-ownership-graph");
  await expect(page.locator("h1")).toContainText(
    "Interactive Corporate Ownership Graph",
  );
  await expect(page.getByText(/react-force-graph/)).toBeVisible();
  await expect(page.getByText(/65K-node graph/)).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/case-c.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write the page**

```astro
---
import CaseStudyLayout from '../../layouts/CaseStudyLayout.astro';
---

<CaseStudyLayout
  title="Interactive Corporate Ownership Graph"
  problem="Visualize tens of thousands of corporate ownership relationships in a way that lets users explore subgraphs at human scale."
  stack={[
    'React',
    'react-force-graph-2d',
    'Three.js (custom node rendering)',
    'Neo4j Cypher',
    'Custom layout heuristics',
  ]}
  outcome="Renders a 65K-node graph with progressive subgraph expansion. Depth controls and node-count budgets keep the UI responsive at >2K visible nodes."
  whatWasHard="Performance optimization for force-directed graphs at this scale — defaults thrash the simulation. Required custom WebGL node rendering, depth budgets that load the graph progressively, and a hybrid layout that pre-computes positions for the densest neighborhoods and lets the simulation handle only the on-screen subgraph."
>
  <ul>
    <li>Cypher queries fetch on-demand subgraphs — root node + N-degree neighbors, capped at a node budget.</li>
    <li>Custom Canvas/WebGL rendering for nodes (avoiding the default DOM-based renderer at scale).</li>
    <li>Depth and edge-type filters: users toggle subsidiaries, suppliers, brands, customers independently.</li>
    <li>Click-to-expand UX: each node click fetches and merges its neighbors into the live graph.</li>
    <li>Performance budget enforced via a node-count cap; over-budget queries return a degraded result with a UI hint.</li>
    <li>Hover tooltips with provenance: source registry + confidence score + last-confirmed date for every relationship.</li>
  </ul>
</CaseStudyLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/case-c.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/work/interactive-ownership-graph.astro tests/e2e/case-c.spec.ts
git commit -m "feat: case study C — interactive ownership graph"
```

---

### Task 16: `/about` page

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/about.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/about.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("about page shows founder info", async ({ page }) => {
  await page.goto("/about");
  await expect(page.locator("h1")).toContainText("About");
  await expect(page.getByText(/Independent web developer/)).toBeVisible();
  await expect(page.getByText("How I work")).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/about.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="About · Meteopolis" description="About David Freymann, founder of Meteopolis LLC.">
  <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">About</h1>
  <p class="mt-2 text-sm text-neutral-500">Independent web developer · founder of Meteopolis LLC</p>

  <section class="prose prose-neutral mt-10 max-w-none dark:prose-invert">
    <p>
      I'm David Freymann, an independent web developer based in the United States. I started Meteopolis to do
      the work I most enjoy: full-stack engineering for products where the data shape is hard, the UX has to be
      fast, and the team is too small to keep a senior engineer around full-time.
    </p>
    <p>
      My recent work spans corporate-intelligence platforms (knowledge graphs at 65K nodes), historical media
      archives (multi-source ingestion at multi-GB scale), and interactive data visualization. The common thread
      is that the database schema usually drives the rest of the architecture — get that right and everything
      downstream is simpler.
    </p>
    <p>
      Before Meteopolis I worked across product engineering and data infrastructure roles. I prefer small,
      focused engagements over open-ended retainers — typically 4–12 weeks of dedicated work on a single
      problem.
    </p>
  </section>

  <section class="mt-16">
    <h2 class="text-xl font-semibold tracking-tight">How I work</h2>
    <ul class="mt-6 space-y-3 text-neutral-700 dark:text-neutral-300">
      <li>
        <strong class="text-neutral-900 dark:text-white">Two-week milestones.</strong> Each milestone has a
        demoable deliverable and a clear acceptance criterion before we start.
      </li>
      <li>
        <strong class="text-neutral-900 dark:text-white">Written design first.</strong> Every project starts
        with a short design doc that captures the architecture, the trade-offs, and the open questions.
      </li>
      <li>
        <strong class="text-neutral-900 dark:text-white">Tests that match the risk.</strong> Critical paths get
        E2E coverage; component-level tests where they pay back the time. No 100% coverage theater.
      </li>
      <li>
        <strong class="text-neutral-900 dark:text-white">Frequent deploys.</strong> Staging environment from
        day three; production cutover when the SLOs are met, not when the calendar says so.
      </li>
      <li>
        <strong class="text-neutral-900 dark:text-white">Async by default.</strong> I write more than I meet.
        One scheduled call per week; everything else in writing.
      </li>
    </ul>
  </section>

  <section class="mt-16">
    <a
      href="/contact"
      class="inline-block rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
    >
      Get in touch →
    </a>
  </section>
</BaseLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/about.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/about.astro tests/e2e/about.spec.ts
git commit -m "feat: /about page with founder bio and how-i-work"
```

---

### Task 17: ContactForm component + `/contact` page

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/components/ContactForm.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/contact.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/contact.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("contact page shows form with all required fields", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.locator("h1")).toContainText("Contact");
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="description"]')).toBeVisible();
  await expect(page.locator('select[name="budget"]')).toBeVisible();
  await expect(page.locator('select[name="timeline"]')).toBeVisible();
});

test("contact page shows email link", async ({ page }) => {
  await page.goto("/contact");
  await expect(
    page.locator('a[href="mailto:hello@meteopolis.com"]'),
  ).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/contact.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write `ContactForm.astro`**

```astro
---
// (No props for now — server-side handler at /api/contact)
---

<form
  method="POST"
  action="/api/contact"
  class="space-y-6"
  data-testid="contact-form"
>
  <!-- Honeypot: bots fill this; humans don't see it -->
  <div style="position:absolute;left:-9999px" aria-hidden="true">
    <label for="company_url">Company URL</label>
    <input type="text" name="company_url" id="company_url" tabindex="-1" autocomplete="off" />
  </div>

  <div class="grid gap-6 sm:grid-cols-2">
    <label class="block">
      <span class="text-sm font-medium">Name</span>
      <input
        type="text"
        name="name"
        required
        class="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      />
    </label>
    <label class="block">
      <span class="text-sm font-medium">Email</span>
      <input
        type="email"
        name="email"
        required
        class="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      />
    </label>
  </div>

  <label class="block">
    <span class="text-sm font-medium">Company (optional)</span>
    <input
      type="text"
      name="company"
      class="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
    />
  </label>

  <label class="block">
    <span class="text-sm font-medium">Project description</span>
    <textarea
      name="description"
      required
      rows="5"
      class="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
    ></textarea>
  </label>

  <div class="grid gap-6 sm:grid-cols-2">
    <label class="block">
      <span class="text-sm font-medium">Budget</span>
      <select
        name="budget"
        required
        class="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <option value="">Select…</option>
        <option value="under_5k">&lt; $5K</option>
        <option value="5k_15k">$5K–$15K</option>
        <option value="15k_50k">$15K–$50K</option>
        <option value="50k_plus">$50K+</option>
      </select>
    </label>
    <label class="block">
      <span class="text-sm font-medium">Timeline</span>
      <select
        name="timeline"
        required
        class="mt-1 w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        <option value="">Select…</option>
        <option value="asap">ASAP</option>
        <option value="within_1_month">Within 1 month</option>
        <option value="1_to_3_months">1–3 months</option>
        <option value="flexible">Flexible</option>
      </select>
    </label>
  </div>

  <button
    type="submit"
    class="rounded-md bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
  >
    Send message
  </button>
</form>
```

- [ ] **Step 4: Write `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ContactForm from '../components/ContactForm.astro';
---

<BaseLayout title="Contact · Meteopolis" description="Tell me about your project. I respond within 24 hours, weekdays.">
  <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>
  <p class="mt-4 max-w-2xl text-lg text-neutral-700 dark:text-neutral-300">
    Tell me about your project. I respond within 24 hours, weekdays.
  </p>
  <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
    Or email me directly:{' '}
    <a class="font-medium text-neutral-900 underline hover:no-underline dark:text-white" href="mailto:hello@meteopolis.com">
      hello@meteopolis.com
    </a>
  </p>

  <div class="mt-12">
    <ContactForm />
  </div>
</BaseLayout>
```

- [ ] **Step 5: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/contact.spec.ts`
Expected: PASS — all form fields present and email link visible.

- [ ] **Step 6: Commit**

```bash
git add src/components/ContactForm.astro src/pages/contact.astro tests/e2e/contact.spec.ts
git commit -m "feat: contact page with form and direct email"
```

---

## Phase 5: Contact form backend

### Task 18: Cloudflare Pages Function — `/api/contact` POST handler

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/functions/api/contact.ts`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/unit/contact-handler.test.ts`
- Create: `/Users/dd/Projects/meteopolis_dev/.env.example`

- [ ] **Step 1: Write failing unit test**

Write `tests/unit/contact-handler.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { onRequestPost } from "../../functions/api/contact";

const makeContext = (
  formData: Record<string, string>,
  env: Record<string, string> = {},
) =>
  ({
    request: {
      formData: async () => {
        const fd = new FormData();
        for (const [k, v] of Object.entries(formData)) fd.append(k, v);
        return fd;
      },
      headers: new Headers({
        "content-type": "application/x-www-form-urlencoded",
      }),
    },
    env: { RESEND_API_KEY: "test_key", ...env },
  }) as any;

describe("contact handler", () => {
  beforeEach(() => {
    global.fetch = vi.fn(
      async () =>
        new Response(JSON.stringify({ id: "msg_123" }), { status: 200 }),
    );
  });

  it("rejects when honeypot field is filled", async () => {
    const res = await onRequestPost(
      makeContext({
        name: "Bot",
        email: "bot@example.com",
        description: "spam",
        budget: "5k_15k",
        timeline: "asap",
        company_url: "http://spam.example.com",
      }),
    );
    expect(res.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("rejects missing required fields", async () => {
    const res = await onRequestPost(makeContext({ name: "Alice" }));
    expect(res.status).toBe(400);
  });

  it("rejects invalid email format", async () => {
    const res = await onRequestPost(
      makeContext({
        name: "Alice",
        email: "not-an-email",
        description: "project description here that is long enough",
        budget: "5k_15k",
        timeline: "asap",
      }),
    );
    expect(res.status).toBe(400);
  });

  it("sends email via Resend on valid submission", async () => {
    const res = await onRequestPost(
      makeContext({
        name: "Alice",
        email: "alice@example.com",
        description:
          "I want to hire you for a project that needs a custom backend.",
        budget: "15k_50k",
        timeline: "1_to_3_months",
      }),
    );
    expect(res.status).toBe(200);
    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, opts] = (global.fetch as any).mock.calls[0];
    expect(url).toBe("https://api.resend.com/emails");
    expect((opts as any).headers.Authorization).toBe("Bearer test_key");
  });

  it("returns 500 if Resend API fails", async () => {
    global.fetch = vi.fn(async () => new Response("boom", { status: 500 }));
    const res = await onRequestPost(
      makeContext({
        name: "Alice",
        email: "alice@example.com",
        description: "description that is plenty long for the validator",
        budget: "5k_15k",
        timeline: "asap",
      }),
    );
    expect(res.status).toBe(500);
  });
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm run test`
Expected: FAIL — `contact.ts` doesn't exist yet.

- [ ] **Step 3: Write `functions/api/contact.ts`**

```typescript
interface Env {
  RESEND_API_KEY: string;
}

interface Context {
  request: Request;
  env: Env;
}

const ALLOWED_BUDGETS = ["under_5k", "5k_15k", "15k_50k", "50k_plus"];
const ALLOWED_TIMELINES = [
  "asap",
  "within_1_month",
  "1_to_3_months",
  "flexible",
];

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const onRequestPost = async (context: Context): Promise<Response> => {
  const formData = await context.request.formData();
  const get = (key: string) => (formData.get(key)?.toString() ?? "").trim();

  // Honeypot: silently accept and discard if filled.
  if (get("company_url").length > 0) {
    return new Response("OK", { status: 200 });
  }

  const name = get("name");
  const email = get("email");
  const company = get("company");
  const description = get("description");
  const budget = get("budget");
  const timeline = get("timeline");

  // Validation
  const errors: string[] = [];
  if (!name || name.length > 200) errors.push("name");
  if (!email || !isEmail(email) || email.length > 200) errors.push("email");
  if (!description || description.length < 20 || description.length > 5000)
    errors.push("description");
  if (!ALLOWED_BUDGETS.includes(budget)) errors.push("budget");
  if (!ALLOWED_TIMELINES.includes(timeline)) errors.push("timeline");

  if (errors.length > 0) {
    return new Response(
      JSON.stringify({ error: "validation_failed", fields: errors }),
      {
        status: 400,
        headers: { "content-type": "application/json" },
      },
    );
  }

  const subject = `New inquiry from ${name}`;
  const text = [
    `From: ${name} <${email}>`,
    company ? `Company: ${company}` : null,
    `Budget: ${budget}`,
    `Timeline: ${timeline}`,
    "",
    "Project description:",
    description,
  ]
    .filter(Boolean)
    .join("\n");

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${context.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Meteopolis Contact <hello@meteopolis.com>",
      to: ["hello@meteopolis.com"],
      reply_to: email,
      subject,
      text,
    }),
  });

  if (!resendResponse.ok) {
    return new Response(JSON.stringify({ error: "send_failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  // Redirect-after-POST so a refresh doesn't re-submit.
  return new Response(null, {
    status: 303,
    headers: { Location: "/contact?sent=1" },
  });
};
```

- [ ] **Step 4: Write `.env.example`**

```
# Cloudflare Pages env vars (set in dashboard, never commit values)
RESEND_API_KEY=re_xxxxxxxxxxxx
```

- [ ] **Step 5: Run tests to verify pass**

Run: `npm run test`
Expected: PASS — 5 tests green.

- [ ] **Step 6: Commit**

```bash
git add functions/api/contact.ts tests/unit/contact-handler.test.ts .env.example
git commit -m "feat: contact form backend with validation and resend integration"
```

---

### Task 19: Display "Thanks, message sent" state on `/contact`

**Files:**

- Modify: `/Users/dd/Projects/meteopolis_dev/src/pages/contact.astro`

- [ ] **Step 1: Write failing test**

```typescript
// Append to tests/e2e/contact.spec.ts
test("contact page shows thank-you state after submission", async ({
  page,
}) => {
  await page.goto("/contact?sent=1");
  await expect(page.getByText(/Thanks/)).toBeVisible();
  await expect(page.getByText(/respond within 24 hours/)).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/contact.spec.ts`
Expected: FAIL — `?sent=1` query state not handled.

- [ ] **Step 3: Update `src/pages/contact.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ContactForm from '../components/ContactForm.astro';

const sent = Astro.url.searchParams.get('sent') === '1';
---

<BaseLayout title="Contact · Meteopolis" description="Tell me about your project. I respond within 24 hours, weekdays.">
  <h1 class="text-3xl font-semibold tracking-tight sm:text-4xl">Contact</h1>

  {sent ? (
    <div class="mt-12 rounded-lg border border-emerald-200 bg-emerald-50 p-8 dark:border-emerald-900 dark:bg-emerald-950">
      <h2 class="text-lg font-semibold text-emerald-900 dark:text-emerald-200">Thanks — message sent.</h2>
      <p class="mt-2 text-emerald-800 dark:text-emerald-300">
        I'll respond within 24 hours, weekdays. If it's been longer, email me directly at{' '}
        <a href="mailto:hello@meteopolis.com" class="underline">hello@meteopolis.com</a>.
      </p>
    </div>
  ) : (
    <>
      <p class="mt-4 max-w-2xl text-lg text-neutral-700 dark:text-neutral-300">
        Tell me about your project. I respond within 24 hours, weekdays.
      </p>
      <p class="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Or email me directly:{' '}
        <a class="font-medium text-neutral-900 underline hover:no-underline dark:text-white" href="mailto:hello@meteopolis.com">
          hello@meteopolis.com
        </a>
      </p>

      <div class="mt-12">
        <ContactForm />
      </div>
    </>
  )}
</BaseLayout>
```

- [ ] **Step 4: Run tests to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/contact.spec.ts`
Expected: PASS — all contact tests including new thank-you test.

- [ ] **Step 5: Commit**

```bash
git add src/pages/contact.astro tests/e2e/contact.spec.ts
git commit -m "feat: thank-you state on /contact?sent=1"
```

---

## Phase 6: Legal pages

### Task 20: `/terms` — Terms of Service / MSA

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/terms.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/terms.spec.ts`

> **NOTE:** This task uses placeholder boilerplate based on a freelance MSA pattern. Before launch, run the `legal-advisor` agent against this file to produce a tailored Delaware MSA, OR have an attorney review. The structure (sections, ordering, scope) is correct; the specific clauses should be pressure-tested.

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("terms page covers all major MSA sections", async ({ page }) => {
  await page.goto("/terms");
  await expect(page.locator("h1")).toContainText("Terms");
  for (const heading of [
    "Services",
    "Payment",
    "Intellectual Property",
    "Confidentiality",
    "Limitation of Liability",
    "Termination",
    "Governing Law",
  ]) {
    await expect(
      page.getByRole("heading", { name: new RegExp(heading, "i") }),
    ).toBeVisible();
  }
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/terms.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write `src/pages/terms.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const lastUpdated = '2026-05-03';
---

<BaseLayout title="Terms of Service · Meteopolis" description="Terms governing engagements with Meteopolis LLC.">
  <article class="prose prose-neutral max-w-none dark:prose-invert">
    <h1>Terms of Service</h1>
    <p class="text-sm text-neutral-500">Last updated: {lastUpdated}</p>

    <p>
      These Terms of Service ("Terms") govern services provided by Meteopolis LLC, a Delaware limited liability
      company ("Meteopolis," "we," "us"), to clients ("Client," "you"). Each engagement is further governed by
      a written Statement of Work ("SOW"). In the event of a conflict between these Terms and an SOW, the SOW
      controls for that engagement.
    </p>

    <h2>1. Services</h2>
    <p>
      Meteopolis will perform the services described in the applicable SOW. Services typically include software
      design, development, deployment, and related consulting. Each SOW will specify deliverables, schedule,
      assumptions, and acceptance criteria.
    </p>

    <h2>2. Payment</h2>
    <p>
      Fees, billing schedule, and payment terms are specified in the SOW. Standard terms: net-14 from invoice
      date; late payments accrue 1.5% per month or the maximum permitted by law (whichever is lower); work may
      be paused if any invoice is more than 30 days overdue. All amounts are in U.S. dollars and processed via
      Stripe. Refund and cancellation terms are described in the Engagement Policy at /engagement.
    </p>

    <h2>3. Intellectual Property</h2>
    <p>
      Subject to full payment of all fees due under an SOW, Meteopolis assigns to Client all right, title, and
      interest in custom code and deliverables specifically created for Client under that SOW. Meteopolis
      retains ownership of pre-existing tools, libraries, and general know-how, and grants Client a perpetual,
      non-exclusive license to use such pre-existing materials as incorporated into the deliverables.
    </p>

    <h2>4. Confidentiality</h2>
    <p>
      Each party agrees to protect the other's confidential information using at least reasonable care, and to
      use such information only to perform under these Terms. This obligation survives termination for three
      years.
    </p>

    <h2>5. Warranty Disclaimer</h2>
    <p>
      EXCEPT AS EXPRESSLY STATED IN AN SOW, ALL SERVICES AND DELIVERABLES ARE PROVIDED "AS IS." METEOPOLIS
      DISCLAIMS ALL OTHER WARRANTIES, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR
      PURPOSE, AND NON-INFRINGEMENT.
    </p>

    <h2>6. Limitation of Liability</h2>
    <p>
      To the maximum extent permitted by law, neither party will be liable for indirect, incidental, special,
      consequential, or punitive damages, or for lost profits or revenue. Each party's aggregate liability under
      these Terms and any SOW will not exceed the fees paid to Meteopolis under the relevant SOW in the twelve
      months preceding the claim.
    </p>

    <h2>7. Termination</h2>
    <p>
      Either party may terminate an SOW for material breach if the breach is not cured within fifteen days of
      written notice. Termination procedures, including handling of work-in-progress and pro-rata fees, are
      described in the Engagement Policy at /engagement.
    </p>

    <h2>8. Governing Law &amp; Disputes</h2>
    <p>
      These Terms are governed by the laws of the State of Delaware, without regard to conflict of laws
      principles. Any dispute will be resolved in the state or federal courts located in Delaware, and each
      party consents to the personal jurisdiction of those courts.
    </p>

    <h2>9. Miscellaneous</h2>
    <p>
      These Terms together with any SOW constitute the entire agreement between the parties on the subject. No
      modification is effective unless in writing and signed by both parties. If any provision is held
      unenforceable, the remaining provisions remain in effect. Neither party may assign these Terms without
      the other's written consent, except in connection with a merger, acquisition, or sale of substantially
      all of its assets.
    </p>

    <h2>10. Contact</h2>
    <p>
      Questions about these Terms: <a href="mailto:hello@meteopolis.com">hello@meteopolis.com</a>.
    </p>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/terms.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/terms.astro tests/e2e/terms.spec.ts
git commit -m "feat: terms of service page (MSA boilerplate, pending legal review)"
```

---

### Task 21: `/privacy` — Privacy Policy

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/privacy.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/privacy.spec.ts`

> **NOTE:** Before launch, regenerate this with Termly's privacy-policy generator using these inputs: business=Meteopolis LLC, jurisdiction=Delaware, collects=contact-form data only, processors=Cloudflare/Google Workspace/Resend, analytics=Cloudflare Web Analytics (no cookies). The boilerplate below is correct in shape and gets you to launch; Termly's version may be required for certain enterprise prospects.

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("privacy page covers required sections", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("h1")).toContainText("Privacy");
  for (const heading of [
    "Information We Collect",
    "How We Use",
    "Data Retention",
    "Third Parties",
    "Your Rights",
    "Contact",
  ]) {
    await expect(
      page.getByRole("heading", { name: new RegExp(heading, "i") }),
    ).toBeVisible();
  }
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/privacy.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write `src/pages/privacy.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const lastUpdated = '2026-05-03';
---

<BaseLayout title="Privacy Policy · Meteopolis" description="How Meteopolis LLC handles your information.">
  <article class="prose prose-neutral max-w-none dark:prose-invert">
    <h1>Privacy Policy</h1>
    <p class="text-sm text-neutral-500">Last updated: {lastUpdated}</p>

    <p>
      This policy describes how Meteopolis LLC ("Meteopolis," "we," "us") handles personal information
      collected through meteopolis.com.
    </p>

    <h2>1. Information We Collect</h2>
    <p>
      <strong>Information you provide:</strong> When you submit the contact form, we collect your name, email
      address, optional company name, project description, budget range, and timeline preference.
    </p>
    <p>
      <strong>Automatically collected:</strong> We use Cloudflare Web Analytics, which records page views,
      referrers, and aggregate device information without setting cookies or collecting personal identifiers.
      We do not use Google Analytics or any tracking that requires a consent banner.
    </p>

    <h2>2. How We Use Information</h2>
    <p>We use the information you submit only to:</p>
    <ul>
      <li>Respond to your inquiry and discuss potential engagements</li>
      <li>Send a project proposal or follow-up communications you request</li>
      <li>Maintain records of inquiries for our own business operations</li>
    </ul>

    <h2>3. Third Parties</h2>
    <p>We share data only with these processors, and only as needed to operate the site:</p>
    <ul>
      <li><strong>Cloudflare</strong> — hosting, DNS, content delivery, and analytics</li>
      <li><strong>Google Workspace</strong> — email service for hello@meteopolis.com</li>
      <li><strong>Resend</strong> — transactional email service for delivering contact-form submissions</li>
    </ul>
    <p>
      We do not sell, rent, or share your information with advertisers or data brokers.
    </p>

    <h2>4. Data Retention</h2>
    <p>
      Inquiry submissions are retained for up to twelve months from the date of submission, then deleted from
      our active inbox. You may request earlier deletion at any time.
    </p>

    <h2>5. Your Rights</h2>
    <p>
      Depending on your location, you may have rights to access, correct, delete, or export your personal
      information, or to object to or limit certain processing. To exercise any of these rights, email{' '}
      <a href="mailto:hello@meteopolis.com">hello@meteopolis.com</a>. We will respond within thirty days.
    </p>
    <p>
      California residents have specific rights under the California Consumer Privacy Act, including the right
      to know what personal information we collect and to request its deletion. EU/UK residents have rights
      under the GDPR. We honor these rights for all users regardless of location.
    </p>

    <h2>6. Security</h2>
    <p>
      We use industry-standard measures to protect personal information, including HTTPS in transit and access
      controls on our processor accounts. No system is perfectly secure, but we minimize what we collect and
      retain in part to limit risk.
    </p>

    <h2>7. Children</h2>
    <p>
      The site is not directed to children under 13, and we do not knowingly collect personal information from
      children. If you believe we have inadvertently received such information, please contact us so we can
      delete it.
    </p>

    <h2>8. Changes</h2>
    <p>
      We may update this policy from time to time. The "Last updated" date at the top reflects the most recent
      change. Material changes will be summarized at the top of this page for at least thirty days.
    </p>

    <h2>9. Contact</h2>
    <p>
      Questions or requests about your information:{' '}
      <a href="mailto:hello@meteopolis.com">hello@meteopolis.com</a>.
    </p>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/privacy.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/privacy.astro tests/e2e/privacy.spec.ts
git commit -m "feat: privacy policy page"
```

---

### Task 22: `/engagement` — Engagement & Refund Policy

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/src/pages/engagement.astro`
- Create: `/Users/dd/Projects/meteopolis_dev/tests/e2e/engagement.spec.ts`

- [ ] **Step 1: Write failing test**

```typescript
import { test, expect } from "@playwright/test";

test("engagement page covers deposit, cancellation, and refund terms", async ({
  page,
}) => {
  await page.goto("/engagement");
  await expect(page.locator("h1")).toContainText("Engagement");
  await expect(page.getByText(/deposit/i)).toBeVisible();
  await expect(page.getByText(/cancellation/i).first()).toBeVisible();
  await expect(page.getByText(/refund/i).first()).toBeVisible();
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm run test:e2e -- --project=chromium tests/e2e/engagement.spec.ts`
Expected: FAIL.

- [ ] **Step 3: Write `src/pages/engagement.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const lastUpdated = '2026-05-03';
---

<BaseLayout title="Engagement Policy · Meteopolis" description="Deposit, milestone, cancellation, and refund terms for Meteopolis engagements.">
  <article class="prose prose-neutral max-w-none dark:prose-invert">
    <h1>Engagement &amp; Refund Policy</h1>
    <p class="text-sm text-neutral-500">Last updated: {lastUpdated}</p>

    <p>
      This policy describes how engagements with Meteopolis LLC are structured, paid, cancelled, and refunded.
      It supplements (and is incorporated by reference into) the Terms of Service at /terms and any individual
      Statement of Work ("SOW").
    </p>

    <h2>1. How Engagements Begin</h2>
    <p>
      Each engagement starts with a written SOW that specifies scope, deliverables, schedule, fees, and
      acceptance criteria. The SOW is signed by both parties before work begins.
    </p>

    <h2>2. Deposits and Billing</h2>
    <ul>
      <li>
        <strong>Projects up to $15,000:</strong> 50% deposit due on signing; balance due on delivery and
        acceptance.
      </li>
      <li>
        <strong>Projects over $15,000:</strong> billed in milestones defined in the SOW (typically 25–40% of
        total per milestone), with each milestone gated by acceptance criteria.
      </li>
      <li>
        <strong>Payment terms:</strong> net-14 from invoice date. Late payments accrue 1.5% per month (or the
        maximum permitted by law, whichever is lower). Work may be paused if any invoice is more than 30 days
        overdue, and may be terminated if more than 60 days overdue.
      </li>
      <li><strong>Currency:</strong> all fees are in U.S. dollars and processed via Stripe.</li>
    </ul>

    <h2>3. Cancellation by Client</h2>
    <p>
      You may cancel an engagement at any time with written notice.
    </p>
    <ul>
      <li>
        <strong>Deposit:</strong> non-refundable. Deposits cover scoping, scheduling, opportunity cost of
        committed time, and project setup that is performed before any code is shipped.
      </li>
      <li>
        <strong>Work performed beyond the deposit:</strong> billed at the SOW's stated rate up to the
        cancellation date. If less than the deposit covers, no further amount is due. If more, the balance is
        invoiced and due net-14.
      </li>
      <li>
        <strong>Deliverables:</strong> on payment of all amounts due, you receive all completed work-in-progress
        deliverables, and the IP-assignment provisions of /terms apply to those deliverables.
      </li>
    </ul>

    <h2>4. Cancellation by Meteopolis</h2>
    <p>
      Meteopolis may terminate an engagement for non-payment, breach of the Terms of Service, or scope changes
      that make the engagement infeasible. In any termination by Meteopolis other than for client breach, any
      portion of the deposit corresponding to undelivered work is refunded pro-rata.
    </p>

    <h2>5. Revisions and Scope Changes</h2>
    <p>
      Each SOW defines the included revisions and the acceptance criteria. Changes to scope are documented in a
      written change order, signed by both parties, with adjusted fees and timeline. Out-of-scope work is not
      performed without an executed change order.
    </p>

    <h2>6. Warranty Period</h2>
    <p>
      For 30 days after final delivery, Meteopolis will fix bugs in delivered code at no additional charge,
      provided the bug existed at delivery and has not been introduced by changes you or a third party have
      made after delivery.
    </p>

    <h2>7. Refund Requests</h2>
    <p>
      Refund requests outside of the cancellation provisions above (for example, dissatisfaction after
      delivery) are evaluated on the specific facts. We aim to resolve disputes amicably; if a resolution
      cannot be reached, Section 8 of the Terms of Service governs.
    </p>

    <h2>8. Contact</h2>
    <p>
      Questions about this policy: <a href="mailto:hello@meteopolis.com">hello@meteopolis.com</a>.
    </p>
  </article>
</BaseLayout>
```

- [ ] **Step 4: Run to verify pass**

Run: `npm run test:e2e -- --project=chromium tests/e2e/engagement.spec.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/engagement.astro tests/e2e/engagement.spec.ts
git commit -m "feat: engagement and refund policy page"
```

---

## Phase 7: Build verification & deploy

### Task 23: Production build + full test suite passes

**Files:**

- (no new files; verification only)

- [ ] **Step 1: Run TypeScript check**

Run: `npx astro check`
Expected: 0 errors. Fix any type errors before continuing.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: 0 errors.

- [ ] **Step 3: Run unit tests**

Run: `npm run test`
Expected: 5 passing tests (the contact handler).

- [ ] **Step 4: Run E2E tests on both projects**

Run: `npm run test:e2e`
Expected: ~16+ tests pass on both `chromium` and `mobile` projects.

- [ ] **Step 5: Build the site**

Run: `npm run build`
Expected: build succeeds; produces `dist/` directory; reports total page weight.

- [ ] **Step 6: Lighthouse audit on production build**

Run:

```bash
npx serve dist -p 8080 &
SERVE_PID=$!
sleep 2
npx lighthouse http://localhost:8080 --only-categories=performance,accessibility --form-factor=mobile --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"
kill $SERVE_PID
cat lighthouse-report.json | jq '.categories.performance.score, .categories.accessibility.score'
```

Expected: both scores `1.0` (100/100). If performance is below 1.0, check the report for issues — most commonly, oversized hero images or unoptimized fonts. The placeholder OG image is a likely culprit; replace it with a real PNG ≤ 100 KB.

- [ ] **Step 7: Commit any build-config tweaks**

```bash
# If any astro.config.mjs or tailwind tweaks were needed:
git add -u
git commit -m "chore: tighten config for lighthouse 100/100"
# Otherwise skip this step.
```

---

### Task 24: Initialize Cloudflare Pages project + first deploy via wrangler

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/wrangler.toml`

- [ ] **Step 1: Write `wrangler.toml`**

```toml
name = "meteopolis"
compatibility_date = "2026-05-01"
pages_build_output_dir = "./dist"

[vars]
# Public env vars (for build); secrets like RESEND_API_KEY go in CF dashboard.
ENVIRONMENT = "production"
```

- [ ] **Step 2: Authenticate wrangler**

Run: `npx wrangler login`
Follow the OAuth prompt in your browser. (You should already be logged in if you've been using Cloudflare with Boyk.)

- [ ] **Step 3: Create the CF Pages project (one-time)**

Run: `npx wrangler pages project create meteopolis --production-branch=main`
Expected: project `meteopolis` created.

- [ ] **Step 4: First deploy**

Run: `npx wrangler pages deploy dist --project-name=meteopolis --branch=main`
Expected: deploys to `https://meteopolis.pages.dev` (and a per-deploy preview URL). Note the preview URL.

- [ ] **Step 5: Set the `RESEND_API_KEY` secret**

In a browser, go to the Cloudflare dashboard → Workers & Pages → meteopolis → Settings → Environment variables → Production. Add `RESEND_API_KEY` with the value from your Resend dashboard (sign up at resend.com if not already).

Then redeploy so the function picks up the secret:

```bash
npx wrangler pages deploy dist --project-name=meteopolis --branch=main
```

- [ ] **Step 6: Smoke-test the deployed site**

Open `https://meteopolis.pages.dev` in a browser. Verify:

- Homepage loads
- All footer links work (`/terms`, `/privacy`, `/engagement`)
- All case studies load
- Contact form submits and redirects to `/contact?sent=1`
- A test email arrives at `hello@meteopolis.com`

- [ ] **Step 7: Commit**

```bash
git add wrangler.toml
git commit -m "feat: cloudflare pages config"
```

---

### Task 25: GitHub Actions CI deploy on push to main

**Files:**

- Create: `/Users/dd/Projects/meteopolis_dev/.github/workflows/deploy.yml`

- [ ] **Step 1: Push the repo to GitHub**

```bash
cd /Users/dd/Projects/meteopolis_dev
gh repo create meteopolis-dev --private --source=. --remote=origin --push
```

- [ ] **Step 2: Create CF API token for the deploy workflow**

In Cloudflare dashboard → My Profile → API Tokens → Create Token → "Edit Cloudflare Workers" template. Restrict the token to your account and to the Pages product. Save the token value.

In GitHub: repo settings → Secrets and variables → Actions → New repository secret. Add:

- `CLOUDFLARE_API_TOKEN` = (the token value)
- `CLOUDFLARE_ACCOUNT_ID` = (from CF dashboard URL or Account → Account ID)

- [ ] **Step 3: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      deployments: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npx astro check
      - run: npm run test
      - run: npm run build
      - name: Deploy to Cloudflare Pages
        if: github.ref == 'refs/heads/main'
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          command: pages deploy dist --project-name=meteopolis --branch=main
```

- [ ] **Step 4: Commit and push**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: github actions deploy to cloudflare pages"
git push
```

- [ ] **Step 5: Verify CI deploy ran**

Open the GitHub repo → Actions tab. Verify the workflow ran and succeeded. If it failed, read the failure output and fix.

---

## Phase 8: DNS migration (operational, not code)

> **CRITICAL:** Phases 8.1–8.3 are operational tasks performed in browser dashboards, not code changes. Read each step carefully. Phase 8.2 is the only step that can break Google Workspace email; if anything is unclear, stop and double-check before proceeding.

### Task 26: Cloudflare DNS pre-flight (zero-risk preparation)

**Files:** none (browser-based operations)

- [ ] **Step 1: Add `meteopolis.com` to Cloudflare**

In your browser, go to dash.cloudflare.com → Add a Site → enter `meteopolis.com` → select Free plan. Cloudflare will scan existing DNS and import what it finds.

- [ ] **Step 2: Audit imported DNS records**

In CF dashboard → DNS → Records, verify exactly these records, editing as needed:

**Delete (or skip importing) these:**

- `A @ → 74.91.138.134`
- `A www → 74.91.138.134`

**Keep exactly:**

- `MX @ → smtp.google.com` (priority 1) — if the priority shows as something else, set it to 1.
- `TXT @ → google-site-verification=0pnB10TpZmL0A_VntROT9piKvpXck37wPEVdiJGcAH8`

**Add (these are new — do not skip):**

- Type: `TXT`, Name: `@`, Content: `v=spf1 include:_spf.google.com ~all`
- Type: `TXT`, Name: `_dmarc`, Content: `v=DMARC1; p=none; rua=mailto:hello@meteopolis.com`

- [ ] **Step 3: Note the Cloudflare nameserver values**

CF dashboard will show two nameserver values, e.g., `tom.ns.cloudflare.com` and `wendy.ns.cloudflare.com`. Copy both. You'll paste them into Network Solutions in the next task.

- [ ] **Step 4: Verify all records are correct before proceeding**

Run a final dig comparison:

```bash
dig @1.1.1.1 meteopolis.com NS +short        # should still show ns1.worldnic.com / ns2.worldnic.com (unchanged yet)
```

This confirms Network Solutions is still authoritative. CF is staged but not yet active.

---

### Task 27: Flip nameservers at Network Solutions

**Files:** none (operational)

- [ ] **Step 1: Log into Network Solutions**

Go to networksolutions.com, log in, navigate to your domain `meteopolis.com` → Nameservers (or "Domain Name Servers" / "DNS Settings" depending on UI version).

- [ ] **Step 2: Replace nameservers**

Change from:

- `ns1.worldnic.com`
- `ns2.worldnic.com`

To the two values from Cloudflare (Task 26 step 3). Save.

- [ ] **Step 3: Note the time**

Write down the time you saved the change. Propagation typically completes within 1–4 hours, with a maximum of 24 hours for stragglers.

---

### Task 28: Verify DNS migration succeeded (1 hour after flip)

**Files:** none (operational)

- [ ] **Step 1: Wait at least 1 hour after Task 27**

Don't skip this; some resolvers cache for an hour even when the TTL is shorter.

- [ ] **Step 2: Verify nameservers updated**

```bash
dig meteopolis.com NS +short
```

Expected: Cloudflare nameservers (the two values from Task 26 step 3).

If still showing `ns1.worldnic.com` / `ns2.worldnic.com`, wait another hour and re-check.

- [ ] **Step 3: Verify MX records survived**

```bash
dig meteopolis.com MX +short
```

Expected: `1 smtp.google.com.`

- [ ] **Step 4: Verify TXT records (Google verification + SPF)**

```bash
dig meteopolis.com TXT +short
```

Expected: at least two lines, including:

- `"google-site-verification=0pnB10TpZmL0A_VntROT9piKvpXck37wPEVdiJGcAH8"`
- `"v=spf1 include:_spf.google.com ~all"`

- [ ] **Step 5: Verify DMARC**

```bash
dig _dmarc.meteopolis.com TXT +short
```

Expected: `"v=DMARC1; p=none; rua=mailto:hello@meteopolis.com"`

- [ ] **Step 6: Email round-trip test**

From a non-meteopolis Gmail account, send an email to `hello@meteopolis.com`. Verify it arrives in your Google Workspace inbox within 60 seconds. Reply _from_ `hello@meteopolis.com` and verify the reply lands in the Gmail account.

If email fails: do NOT proceed to Phase 9. Re-check the MX record carefully — it must say exactly `smtp.google.com` with priority 1. Open a Google Workspace admin console support ticket if needed.

If email succeeds: the migration is safe. Proceed.

---

## Phase 9: Custom domain wiring

### Task 29: Wire custom domain to Cloudflare Pages project

**Files:** none (operational)

- [ ] **Step 1: Add custom domain in CF Pages**

CF dashboard → Workers & Pages → meteopolis → Custom domains → Set up a custom domain → enter `meteopolis.com` → Continue.

CF auto-creates the necessary CNAME records inside the zone. Wait for the SSL certificate to provision (usually <1 minute, can take up to 15).

- [ ] **Step 2: Add www subdomain with apex redirect**

CF Pages → meteopolis → Custom domains → Set up a custom domain → enter `www.meteopolis.com` → Continue.

Then in CF dashboard → Rules → Redirect Rules → Create Rule:

- Name: `www-to-apex`
- When: `Hostname equals www.meteopolis.com`
- Then: Static URL redirect to `https://meteopolis.com$1` with status 301, preserve query string

- [ ] **Step 3: Verify production site loads**

Open `https://meteopolis.com` in an incognito window. Verify:

- Site loads with the Astro build (not the Network Solutions placeholder)
- `https://www.meteopolis.com` redirects to `https://meteopolis.com`
- All pages work
- HTTPS certificate is valid

- [ ] **Step 4: Re-test contact form on production**

Submit the form once with a real test message. Verify:

- Browser redirects to `/contact?sent=1`
- Email arrives at `hello@meteopolis.com` within 60 seconds

- [ ] **Step 5: Enable Cloudflare Web Analytics**

CF dashboard → Analytics & Logs → Web Analytics → Add a site → enter `meteopolis.com`. CF generates a JS snippet of the form:

```html
<script
  defer
  src="https://static.cloudflareinsights.com/beacon.min.js"
  data-cf-beacon='{"token": "abc123..."}'
></script>
```

Add it to `src/layouts/BaseLayout.astro` immediately before the closing `</head>` tag, replacing the token with your real token:

```astro
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon='{"token": "YOUR_REAL_TOKEN_HERE"}'
    ></script>
  </head>
```

Commit and push:

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat: cloudflare web analytics beacon"
git push
```

GitHub Actions will redeploy automatically. Verify analytics receives data by visiting the site, then checking CF dashboard → Analytics & Logs → Web Analytics → meteopolis.com (data appears within ~5 minutes).

---

## Phase 10: Cleanup & launch

### Task 30: Add DKIM for Google Workspace

**Files:** none (operational)

- [ ] **Step 1: Generate DKIM key in Google Admin**

Go to admin.google.com → Apps → Google Workspace → Gmail → Authenticate email. If DKIM is not yet enabled, click "Generate new record." Choose 2048-bit if available; otherwise 1024-bit.

Copy the resulting TXT record:

- Name: `google._domainkey` (or whatever Google specifies)
- Value: `v=DKIM1; k=rsa; p=...` (long base64 blob)

- [ ] **Step 2: Add the TXT record in Cloudflare**

CF dashboard → DNS → Records → Add record:

- Type: TXT
- Name: `google._domainkey`
- Content: paste the value from Google Admin
- TTL: Auto

- [ ] **Step 3: Wait 5 minutes, then start authentication in Google Admin**

Back in Google Admin → Authenticate email → click "Start authentication." Google will verify the TXT record is live and start signing outbound mail.

- [ ] **Step 4: Verify DKIM is signing**

Send an email from `hello@meteopolis.com` to a Gmail account you don't normally use. In Gmail, click the three-dot menu → Show original. Look for `DKIM: 'PASS' with domain meteopolis.com` in the headers.

---

### Task 31: Cancel Network Solutions hosting line item

**Files:** none (operational)

- [ ] **Step 1: Check Network Solutions billing**

Log into Network Solutions → My Account → Billing or Subscriptions. Look for any line item like "Web Hosting," "WebSite Builder," "Pro Hosting," etc. (Domain registration stays — that's $20/year and you keep the domain there for now.)

- [ ] **Step 2: Cancel the hosting line item**

Cancel any hosting product. The under-construction page is now irrelevant since DNS no longer points there.

- [ ] **Step 3: Confirm the domain registration is still active**

Verify `meteopolis.com` still shows as "Registered" with a renewal date. If unsure, use whois to confirm:

```bash
whois meteopolis.com | grep -i "registry expir"
```

---

### Task 32: Final pre-Stripe-submission checklist

**Files:** none

- [ ] **Step 1: Walkthrough the live site as a Stripe reviewer would**

Open `https://meteopolis.com` in incognito. Verify:

- Homepage loads with hero, services, featured work, CTA — no broken images, no Lorem Ipsum
- Top nav: `Work`, `About`, `Contact` all click through
- Footer: `Terms`, `Privacy`, `Engagement Policy` all click through
- All three case studies load with screenshots and content
- Contact form is visible with all fields
- Email link `hello@meteopolis.com` opens mail client
- Privacy policy mentions data collection, processors, retention, contact
- Terms covers payment, IP, liability, governing law, contact
- Engagement policy covers deposit, cancellation, refund conditions

- [ ] **Step 2: Run final Lighthouse on production**

```bash
npx lighthouse https://meteopolis.com --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --chrome-flags="--headless"
```

Expected: all categories ≥ 95; performance and accessibility = 100. Address regressions if any.

- [ ] **Step 3: Verify business contact info matches Stripe Atlas application**

The LLC name on the homepage footer (`Meteopolis LLC`) and the email (`hello@meteopolis.com`) must match what's on the Stripe application form. Cross-check in the Stripe Atlas dashboard.

- [ ] **Step 4: Submit Stripe Atlas activation**

In the Stripe Atlas dashboard, navigate to the activation step that asks for the business website. Enter `https://meteopolis.com`. Submit.

- [ ] **Step 5: Monitor Stripe response**

Stripe's automated check usually completes within 1–24 hours. Outcomes:

- **Approved:** activation continues
- **Manual review:** wait up to 5 business days; respond promptly to any clarifying questions
- **Rejected:** read the specific reason; the most common rejections are missing pages (which we've covered) or insufficient service description (which we've covered with three case studies)

- [ ] **Step 6: Final commit (if any tweaks were needed during review)**

```bash
git add -u
git commit -m "chore: final pre-launch tweaks"
git push
```

---

## Self-review

**1. Spec coverage:** Walked each section of `2026-05-03-meteopolis-business-site-design.md`:

| Spec section                                      | Implementing task                                         |
| ------------------------------------------------- | --------------------------------------------------------- |
| §1 Goal                                           | Whole plan                                                |
| §2 Business model                                 | §6.1 service tiles in Task 11; engagement page in Task 22 |
| §3 Domain & infrastructure baseline               | Tasks 26–31                                               |
| §4 Brand positioning (tagline, tone)              | Tasks 11 (homepage hero), 16 (about)                      |
| §5 Site architecture (10 pages, nav, footer)      | Tasks 5, 6, 11–17, 20–22                                  |
| §6.1 Homepage sections                            | Task 11                                                   |
| §6.2 Pricing tiers                                | Task 11 (`services` array)                                |
| §6.3 Three case studies                           | Tasks 13, 14, 15                                          |
| §6.4 About                                        | Task 16                                                   |
| §6.5 Contact form                                 | Tasks 17, 19                                              |
| §6.6 Legal pages                                  | Tasks 20, 21, 22                                          |
| §7.1 Stack                                        | Task 1                                                    |
| §7.2 Repo                                         | Task 1                                                    |
| §7.3 Directory layout                             | Whole plan                                                |
| §7.4 Contact backend (CF Pages Function + Resend) | Task 18                                                   |
| §7.5 Deploy pipeline                              | Tasks 24, 25                                              |
| §7.6 Cloudflare Web Analytics                     | Task 29 step 5                                            |
| §7.7 Performance budget                           | Task 23 step 6, Task 32 step 2                            |
| §8 DNS migration phases A–E                       | Tasks 26, 27, 28, 29, 30, 31                              |
| §10 Success criteria                              | Task 32 verifies items 1–7                                |

**Gap fixed inline:** Cloudflare Web Analytics (§7.6) was missing from the original task list. Added as Task 29 Step 5 — the analytics snippet is enabled in the CF dashboard, then pasted into `BaseLayout.astro` so every page reports.

**2. Placeholder scan:** Searched for "TBD," "TODO," "fill in details" — none found. The legal pages have explicit `> NOTE:` blocks pointing to optional further refinement (legal-advisor agent, Termly), but the page content is real and ships as-is for Stripe approval.

**3. Type consistency:** Cross-referenced component prop interfaces:

- `Hero` props (`headline`, `subhead`, `primaryCta: {href, label}`, `secondaryCta?`) — used in Task 11 ✓
- `ServiceCard` props (`title`, `description`, `priceRange`) — used in Task 11 ✓
- `CaseStudyCard` props (`href`, `title`, `problem`, `imageSrc?`, `imageAlt?`) — used in Tasks 11, 12 ✓
- `CaseStudyLayout` props (`title`, `problem`, `stack`, `outcome?`, `whatWasHard`, `imageSrc?`, `imageAlt?`) — used in Tasks 13, 14, 15 ✓
- Form field names align between Task 17 (form HTML) and Task 18 (handler validation) — `name`, `email`, `company`, `description`, `budget`, `timeline`, `company_url` (honeypot) ✓
- Budget/timeline option values match between form `<option value="...">` and handler `ALLOWED_BUDGETS` / `ALLOWED_TIMELINES` ✓

All consistent.
