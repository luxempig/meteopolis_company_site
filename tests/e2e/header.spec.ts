import { test, expect } from '@playwright/test';

test('header shows Meteopolis logo linking home', async ({ page }) => {
  await page.goto('/');
  const logo = page.locator('header a[href="/"]').first();
  await expect(logo).toContainText('Meteopolis');
});

test('header has Work, About, Contact nav links', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('header a[href="/work"]')).toHaveText(/Work/);
  await expect(page.locator('header a[href="/about"]')).toHaveText(/About/);
  await expect(page.locator('header a[href="/contact"]')).toHaveText(/Contact/);
});
