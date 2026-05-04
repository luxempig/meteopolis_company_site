import { test, expect } from '@playwright/test';

test('engagement page covers deposit, cancellation, and refund terms', async ({ page }) => {
  await page.goto('/engagement');
  await expect(page.locator('h1')).toContainText('Engagement');
  await expect(page.getByText(/deposit/i).first()).toBeVisible();
  await expect(page.getByText(/cancellation/i).first()).toBeVisible();
  await expect(page.getByText(/refund/i).first()).toBeVisible();
});
