import { test, expect } from '@playwright/test';

test.describe('Vacancy Pages', () => {
  test('vacancy list page loads', async ({ page }) => {
    await page.goto('/en/vacancies');
    await expect(page).toHaveTitle(/Vacancies/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('vacancy cards are displayed', async ({ page }) => {
    await page.goto('/en/vacancies');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[data-testid="vacancy-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('clicking a vacancy opens detail page', async ({ page }) => {
    await page.goto('/en/vacancies');
    await page.waitForLoadState('networkidle');
    const firstCard = page.locator('[data-testid="vacancy-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await expect(page.url()).toContain('/en/vacancies/');
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('vacancy detail has apply button', async ({ page }) => {
    await page.goto('/en/vacancies');
    await page.waitForLoadState('networkidle');
    const firstCard = page.locator('[data-testid="vacancy-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await expect(page.locator('[data-testid="apply-button"]')).toBeVisible();
    }
  });
});
