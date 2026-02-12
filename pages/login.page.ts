import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly companyLogo: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByRole('textbox', { name: 'Username' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.errorMessage = page.locator('.oxd-alert-content');
    this.companyLogo = page.getByRole('img', { name: 'company-branding' });
  }

  async navigate() {
     await this.page.goto('/orangehrm-5.7/web/index.php/auth/login');
  }

  async login(username: string, password: string) {
    await this.usernameInput.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async isErrorDisplayed(): Promise {
    return await this.errorMessage.isVisible();
  }

  async isLogoVisible(): Promise {
    await this.companyLogo.waitFor({ state: 'visible' });
    return await this.companyLogo.isVisible();
  }
    
}
