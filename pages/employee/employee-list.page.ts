import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { Employee } from './add-employee.page';

export class EmployeeListPage extends BasePage {
  readonly employeeNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;
  readonly recordsFound: Locator;
  readonly successToast: Locator;
  readonly employeeListLink: Locator;

  constructor(page: Page) {
    super(page);
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' }).first();
    this.employeeIdInput = page.locator('form').getByRole('textbox').nth(1);
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.resetButton = page.locator('button:has-text("Reset")');
    this.deleteButton = page.getByRole('button').filter({ hasText: /^$/ }).nth(4);
    this.confirmDeleteButton = page.getByRole('button', { name: ' Yes, Delete' });
    this.recordsFound = page.locator('.orangehrm-horizontal-padding span');
    this.successToast = page.locator('.oxd-toast');
    this.employeeListLink = page.getByRole('link', { name: 'Employee List' });
  }

  async searchByEmployeeName(employee: Employee) {
    await this.employeeNameInput.click();
    await this.employeeNameInput.fill(employee.firstName);
    await this.searchButton.click();
  }

  async searchByEmployeeId(employee: Employee) {
    await this.employeeIdInput.click();
    await this.employeeIdInput.fill(employee.employeeId);
    await this.page.getByRole('button', { name: 'Rechercher' }).click();
  }

  async deleteEmployee(employee: Employee) {
    await this.employeeListLink.click();
    await this.employeeNameInput.click();
    await this.employeeNameInput.press('CapsLock');
    await this.employeeNameInput.fill(employee.firstName);
    await this.searchButton.click();
    
    await this.deleteButton.click();
    await this.confirmDeleteButton.click();
    
    await expect(this.successToast).toBeVisible();
    await expect(this.successToast).toHaveText(/Successfully Deleted/i);
  }

  //async getRecordsCount(): Promise {
    //return await this.getText(this.recordsFound);
  //}
}