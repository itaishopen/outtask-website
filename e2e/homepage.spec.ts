import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads with correct title', async ({ page }) => {
    await page.goto('/en/');
    await expect(page).toHaveTitle(/Outtask/);
  });

  test('displays hero section', async ({ page }) => {
    await page.goto('/en/');
    const hero = page.locator('app-hero-section, [data-testid="hero-section"]').first();
    await expect(hero).toBeVisible({ timeout: 10000 });
  });

  test('navigation links are visible', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator('a[href="/en/vacancies"]').first()).toBeVisible();
  });

  test('footer is rendered', async ({ page }) => {
    await page.goto('/en/');
    await expect(page.locator('footer')).toBeVisible();
  });

  test('meta description is set', async ({ page }) => {
    await page.goto('/en/');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.+/);
  });

  test('is mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/en/');
    await expect(page.locator('header')).toBeVisible();
    const hamburger = page.locator('[data-testid="mobile-menu-toggle"]');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
  });
});
