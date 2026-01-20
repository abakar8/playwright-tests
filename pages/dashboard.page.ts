import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly pimMenu: Locator;
  readonly dashboardLink: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pimMenu = page.getByRole('link', { name: 'PIM' });
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
    this.userDropdown = page.getByRole('listitem').filter({ hasText: 'ABAKAR GARGOUM' }).locator('i');
    this.logoutButton = page.getByRole('menuitem', { name: 'Logout' });
  }

  async navigateToPIM() {
    await this.pimMenu.waitFor({ state: 'visible' });
    await this.pimMenu.click({ timeout: 10000 });
  }

  async logout() {
    await this.userDropdown.click();
    await this.logoutButton.waitFor({ state: 'visible' });
    await this.logoutButton.click({ timeout: 10000 });
  }
}