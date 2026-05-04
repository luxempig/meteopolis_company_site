import { test, expect } from '@playwright/test';

test('case study B renders archive details', async ({ page }) => {
  await page.goto('/work/historical-media-archive');
  await expect(page.locator('h1')).toContainText('Historical Media Archive');
  await expect(page.getByText(/3,749/).first()).toBeVisible();
  await expect(page.getByText(/Cloudflare R2/)).toBeVisible();
});
