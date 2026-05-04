import { test, expect } from '@playwright/test';

test('footer links to all three legal pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('footer a[href="/terms"]')).toHaveText(/Terms/);
  await expect(page.locator('footer a[href="/privacy"]')).toHaveText(/Privacy/);
  await expect(page.locator('footer a[href="/engagement"]')).toHaveText(/Engagement/);
});

test('footer shows current year and LLC copyright', async ({ page }) => {
  await page.goto('/');
  const footer = page.locator('footer');
  await expect(footer).toContainText('Meteopolis LLC');
  await expect(footer).toContainText(String(new Date().getFullYear()));
});
