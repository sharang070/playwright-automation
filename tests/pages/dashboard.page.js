
// Dashboard Page Object for Applitools demo app.
export class DashboardPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.header = page.getByRole('heading', { name: /recent transactions/i });
    this.userMenu = page.getByRole('button', { name: /your account|john|menu/i });
    this.logout = page.getByRole('menuitem', { name: /logout/i }).or(page.getByRole('button', { name: /logout/i }));
    this.balanceCard = page.locator('[data-test="total-balance"]');
    this.transactionsTable = page.locator('table[role="table"], table.table');
    this.amountHeader = page.getByRole('columnheader', { name: /amount/i });
    this.searchInput = page.getByPlaceholder(/search by/i).or(this.page.locator('input[type="search"]'));
    this.rows = page.locator('tbody tr');
    this.amountCells = page.locator('tbody tr td').filter({ hasText: /[$€£]/ });
  }

  async isLoaded() {
    await this.header.waitFor({ state: 'visible' });
  }

  async sortByAmount() {
    // Click twice to cover both sort directions
    await this.amountHeader.click();
    await this.amountHeader.click();
  }

  async getAllAmounts() {
    const texts = await this.amountCells.allTextContents();
    // Normalize currency to numbers (e.g., "$1,250.99" -> 1250.99)
    return texts
      .map(t => t.replace(/[^\d\-.]/g, ''))
      .map(Number)
      .filter(n => !Number.isNaN(n));
  }

  async filterBy(text) {
    if (await this.searchInput.count()) {
      await this.searchInput.fill(text);
    }
  }

  async logoutIfVisible() {
    if (await this.userMenu.count()) {
      await this.userMenu.click();
      if (await this.logout.count()) {
        await this.logout.click();
      }
    }
  }
}
