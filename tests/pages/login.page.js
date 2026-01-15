
// Login Page Object for Applitools demo app.
export class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.username = page.getByPlaceholder('Enter your username'); // input#username
    this.password = page.getByPlaceholder('Enter your password'); // input#password
    this.signInBtn = page.getByRole('button', { name: /sign in/i });
    this.usernameError = page.getByText(/username is required/i);
    this.passwordError = page.getByText(/password is required/i);
  }

  async goto() {
    await this.page.goto('/app.html#');
  }

  async login(user, pass) {
    if (user !== undefined) await this.username.fill(user);
    if (pass !== undefined) await this.password.fill(pass);
    await this.signInBtn.click();
  }
}
