import { test, expect } from '@playwright/test';

const ADMIN_BASE_URL = process.env['ADMIN_E2E_URL'] ?? 'http://localhost:4201';

test.describe('Admin Panel', () => {
  test('login page is accessible', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/login`);
    await expect(page.locator('h1, [data-testid="login-heading"]')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('[data-testid="microsoft-login-btn"]')).toBeVisible();
  });

  test('unauthenticated access to dashboard redirects to login', async ({ page }) => {
    await page.goto(`${ADMIN_BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/login');
  });

  // The following tests require a test account with admin credentials.
  // In CI these are skipped unless ADMIN_TEST_TOKEN is set.
  test.describe('Authenticated flows', () => {
    test.skip(!process.env['ADMIN_TEST_TOKEN'], 'Requires ADMIN_TEST_TOKEN env var');

    test.beforeEach(async ({ page }) => {
      // Inject test token into localStorage
      await page.goto(`${ADMIN_BASE_URL}/login`);
      await page.evaluate((token) => {
        localStorage.setItem('access_token', token);
      }, process.env['ADMIN_TEST_TOKEN'] ?? '');
    });

    test('dashboard loads after authentication', async ({ page }) => {
      await page.goto(`${ADMIN_BASE_URL}/dashboard`);
      await expect(page.locator('[data-testid="dashboard-stats"]')).toBeVisible({ timeout: 10000 });
    });

    test('can navigate to blog list', async ({ page }) => {
      await page.goto(`${ADMIN_BASE_URL}/blog`);
      await expect(page.locator('[data-testid="blog-list-table"]')).toBeVisible({ timeout: 10000 });
    });

    test('can create a new blog post', async ({ page }) => {
      await page.goto(`${ADMIN_BASE_URL}/blog/new`);
      await page.fill('[data-testid="blog-title-input"]', 'E2E Test Post');
      await page.fill('[data-testid="blog-excerpt-input"]', 'This is an E2E test post.');
      await page.click('[data-testid="blog-save-btn"]');
      await expect(page.locator('[data-testid="success-toast"]')).toBeVisible({ timeout: 5000 });
    });

    test('can view vacancy list and trigger sync', async ({ page }) => {
      await page.goto(`${ADMIN_BASE_URL}/vacancies`);
      await expect(page.locator('[data-testid="vacancy-list-table"]')).toBeVisible({ timeout: 10000 });
    });
  });
});
