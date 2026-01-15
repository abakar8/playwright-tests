import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class EmployeeDetailsPage extends BasePage {
  readonly nicknameInput: Locator;
  readonly otherIdInput: Locator;
  readonly licenseNumberInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.nicknameInput = page.locator('input[name*="nickname"]').first();
    this.otherIdInput = page.locator('input[name*="otherId"]').first();
    this.licenseNumberInput = page.locator('input[name*="licenseNumber"]').first();
    this.saveButton = page.locator('button[type="submit"]').first();
    this.successMessage = page.locator('.oxd-toast-content');
  }

  async updatePersonalDetails(nickname: string, otherId: string, license: string) {
    await this.fillInput(this.nicknameInput, nickname);
    await this.fillInput(this.otherIdInput, otherId);
    await this.fillInput(this.licenseNumberInput, license);
    await this.clickElement(this.saveButton);
  }
}