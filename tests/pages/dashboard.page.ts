import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly pimMenu: Locator;
  readonly userDropdown: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.pimMenu = page.locator('a[href*="/pim"]').first();
    this.userDropdown = page.locator('.oxd-userdropdown');
    this.logoutButton = page.locator('a[href*="/logout"]');
  }

  async navigateToPIM() {
    await this.clickElement(this.pimMenu);
  }

  async logout() {
    await this.clickElement(this.userDropdown);
    await this.clickElement(this.logoutButton);
  }
}