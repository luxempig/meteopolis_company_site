import { test, expect } from '@playwright/test';

test('about page shows founder info', async ({ page }) => {
  await page.goto('/about');
  await expect(page.locator('h1')).toContainText('About');
  await expect(page.getByText(/Independent web developer/)).toBeVisible();
  await expect(page.getByRole('heading', { name: 'How I work' })).toBeVisible();
});
