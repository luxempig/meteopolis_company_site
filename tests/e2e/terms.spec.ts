import { test, expect } from '@playwright/test';

test('terms page covers all major MSA sections', async ({ page }) => {
  await page.goto('/terms');
  await expect(page.locator('h1')).toContainText('Terms');
  for (const heading of [
    'Services',
    'Payment',
    'Intellectual Property',
    'Confidentiality',
    'Limitation of Liability',
    'Termination',
    'Governing Law',
  ]) {
    await expect(page.getByRole('heading', { name: new RegExp(heading, 'i') })).toBeVisible();
  }
});
