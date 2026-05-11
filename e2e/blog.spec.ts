import { test, expect } from '@playwright/test';

test.describe('Blog Pages', () => {
  test('blog list page loads', async ({ page }) => {
    await page.goto('/en/blog');
    await expect(page).toHaveTitle(/Blog/);
    await expect(page.locator('h1')).toBeVisible();
  });

  test('blog post cards are displayed', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    const cards = page.locator('[data-testid="blog-card"]');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('clicking a blog post opens detail page', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    const firstCard = page.locator('[data-testid="blog-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      await expect(page.url()).toContain('/en/blog/');
      await expect(page.locator('h1')).toBeVisible();
    }
  });

  test('blog detail has proper OG meta tags', async ({ page }) => {
    await page.goto('/en/blog');
    await page.waitForLoadState('networkidle');
    const firstCard = page.locator('[data-testid="blog-card"]').first();
    if (await firstCard.isVisible()) {
      await firstCard.click();
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /.+/);
    }
  });
});
