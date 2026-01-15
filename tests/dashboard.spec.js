
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { DashboardPage } from './pages/dashboard.page.js';

test.describe('Dashboard smoke', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('applitools_user', 'secret_sauce');
  });

  test('summary widgets + transactions table are visible', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.isLoaded();

    await expect(dashboard.balanceCard).toBeVisible();
    await expect(dashboard.transactionsTable).toBeVisible();
    await expect(dashboard.rows).toHaveCountGreaterThan(0);
  });

  test('sort transactions by amount works', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.isLoaded();

    await dashboard.sortByAmount();
    const amounts = await dashboard.getAllAmounts();

    // After two clicks, verify amounts are sorted either ascending or descending.
    const ascending = amounts.every((v, i, a) => !i || a[i - 1] <= v);
    const descending = amounts.every((v, i, a) => !i || a[i - 1] >= v);
    expect(ascending || descending, `Amounts not sorted. Got: ${amounts.join(', ')}`).toBeTruthy();
  });

  test('filter transactions by keyword', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.isLoaded();

    await dashboard.filterBy('shopping'); // adjust based on actual row text (e.g., "Starbucks", "Utilities")
    const rowTexts = await dashboard.rows.allTextContents();
    // Every visible row should include the filter substring (case-insensitive)
    for (const t of rowTexts) {
      expect(t.toLowerCase()).toContain('shopping');
    }
  });

  test('user can logout', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.isLoaded();

    await dashboard.logoutIfVisible();
    // Verify we are back at login page (sign in button visible)
    const loginBtn = page.getByRole('button', { name: /sign in/i });
    await expect(loginBtn).toBeVisible();
  });
});
