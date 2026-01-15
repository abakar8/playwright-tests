import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class EmployeeListPage extends BasePage {
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly recordsFound: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeNameInput = page.locator('input[placeholder*="Type"]').first();
    this.employeeIdInput = page.locator('input.oxd-input').nth(1);
    this.searchButton = page.locator('button[type="submit"]');
    this.resetButton = page.locator('button:has-text("Reset")');
    this.deleteButton = page.locator('button i.bi-trash').first();
    this.confirmDeleteButton = page.locator('button:has-text("Yes, Delete")');
    this.recordsFound = page.locator('.orangehrm-horizontal-padding span');
  }

  async searchByEmployeeName(name: string) {
    await this.fillInput(this.employeeNameInput, name);
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press('ArrowDown');
    await this.page.keyboard.press('Enter');
    await this.clickElement(this.searchButton);
  }

  async searchByEmployeeId(id: string) {
    await this.fillInput(this.employeeIdInput, id);
    await this.clickElement(this.searchButton);
  }

  async deleteFirstEmployee() {
    await this.clickElement(this.deleteButton);
    await this.clickElement(this.confirmDeleteButton);
  }

  async getRecordsCount(): Promise<string> {
    return await this.getText(this.recordsFound);
  }
}