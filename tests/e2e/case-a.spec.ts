import { test, expect } from '@playwright/test';

test('case study A renders with stack and outcome', async ({ page }) => {
  await page.goto('/work/corporate-intelligence-platform');
  await expect(page.locator('h1')).toContainText('Corporate Intelligence Platform');
  await expect(page.getByText(/Neo4j/).first()).toBeVisible();
  await expect(page.getByText(/65,000 companies/)).toBeVisible();
  await expect(page.getByText('What was hard')).toBeVisible();
});
