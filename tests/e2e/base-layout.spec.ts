import { test, expect } from '@playwright/test';

test('homepage has correct title and meta tags', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Meteopolis/);
  const description = await page.locator('meta[name="description"]').getAttribute('content');
  expect(description).toBeTruthy();
  expect(description!.length).toBeGreaterThan(50);
});

test('homepage has Open Graph meta tags', async ({ page }) => {
  await page.goto('/');
  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
  expect(ogTitle).toContain('Meteopolis');
  expect(ogImage).toMatch(/og-image\.png/);
});
