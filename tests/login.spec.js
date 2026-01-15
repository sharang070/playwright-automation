
import { test, expect } from '@playwright/test';
import { LoginPage } from './pages/login.page.js';
import { DashboardPage } from './pages/dashboard.page.js';

test.describe('Login flow', () => {
  test('successful login navigates to dashboard', async ({ page }) => {
    const login = new LoginPage(page);
    const dashboard = new DashboardPage(page);

    await test.step('Open login page', async () => {
      await login.goto();
      await expect(login.signInBtn).toBeVisible();
    });

    await test.step('Enter valid credentials and sign in', async () => {
      await login.login('applitools_user', 'secret_sauce');
    });

    await test.step('Verify dashboard visible', async () => {
      await dashboard.isLoaded();
      await expect(dashboard.header).toBeVisible();
      await expect(dashboard.transactionsTable).toBeVisible();
    });
  });

  test('empty credentials show validation messages', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('', '');
    // Adjust these expectations if the demo shows a single combined error
    await expect(login.usernameError).toBeVisible();
    await expect(login.passwordError).toBeVisible();
  });

  test('invalid credentials remain on login (negative)', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();

    await login.login('invalid_user', 'wrong_pass');

    // If the app shows a toast/banner for invalid creds, assert it here.
    // Example (update selector as appropriate for the live app):
    const errorBanner = page.getByText(/invalid username or password/i).first();
    await expect(errorBanner).toBeVisible({ timeout: 4000 });
    await expect(page).toHaveURL(/app\.html#/i);
  });
});
