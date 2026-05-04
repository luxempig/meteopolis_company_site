import { test, expect } from '@playwright/test';

test('privacy page covers required sections', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.locator('h1')).toContainText('Privacy');
  for (const heading of [
    'Information We Collect',
    'How We Use',
    'Data Retention',
    'Third Parties',
    'Your Rights',
    'Contact',
  ]) {
    await expect(page.getByRole('heading', { name: new RegExp(heading, 'i') })).toBeVisible();
  }
});
