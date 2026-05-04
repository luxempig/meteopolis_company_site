import { test, expect } from '@playwright/test';

test('case study C renders graph viz details', async ({ page }) => {
  await page.goto('/work/interactive-ownership-graph');
  await expect(page.locator('h1')).toContainText('Interactive Corporate Ownership Graph');
  await expect(page.getByText(/react-force-graph/)).toBeVisible();
  await expect(page.getByText(/65K-node graph/)).toBeVisible();
});
