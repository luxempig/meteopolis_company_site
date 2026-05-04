import { test, expect } from '@playwright/test';

test('contact page shows form with all required fields', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('h1')).toContainText('Contact');
  await expect(page.locator('input[name="name"]')).toBeVisible();
  await expect(page.locator('input[name="email"]')).toBeVisible();
  await expect(page.locator('textarea[name="description"]')).toBeVisible();
  await expect(page.locator('select[name="budget"]')).toBeVisible();
  await expect(page.locator('select[name="timeline"]')).toBeVisible();
});

test('contact page shows email link', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('a[href="mailto:hello@meteopolis.com"]').first()).toBeVisible();
});

test('contact page shows thank-you state after submission', async ({ page }) => {
  await page.goto('/contact?sent=1');
  await expect(page.getByText(/Thanks/)).toBeVisible();
  await expect(page.getByText(/respond within 24 hours/)).toBeVisible();
});
