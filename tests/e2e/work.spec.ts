import { test, expect } from '@playwright/test';

test('work page lists all three case studies', async ({ page }) => {
  await page.goto('/work');
  await expect(page.locator('h1')).toContainText('Work');
  await expect(
    page.getByRole('heading', { name: 'Corporate Intelligence Platform' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Historical Media Archive' })).toBeVisible();
  await expect(
    page.getByRole('heading', { name: 'Interactive Corporate Ownership Graph' }),
  ).toBeVisible();
});

test('clicking a case study card navigates to its detail page', async ({ page }) => {
  await page.goto('/work');
  await page.getByRole('heading', { name: 'Corporate Intelligence Platform' }).click();
  await expect(page).toHaveURL(/work\/corporate-intelligence-platform/);
});
