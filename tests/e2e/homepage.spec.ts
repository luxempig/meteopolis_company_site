import { test, expect } from '@playwright/test';

test('homepage hero shows the tagline', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('Web apps for teams');
});

test('homepage shows three service cards with prices', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Custom web applications' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Data-heavy platforms' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Mobile companions' })).toBeVisible();
  await expect(page.getByText(/\$15K.*\$80K/)).toBeVisible();
});

test('homepage shows two featured case studies', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Corporate Intelligence Platform' }),
  ).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Historical Media Archive' })).toBeVisible();
});
