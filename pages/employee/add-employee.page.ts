import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export class AddEmployeePage extends BasePage {
  readonly addButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly createLoginCheckbox: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.addButton = page.locator('button:has-text("Add")');
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.employeeIdInput = page.locator('input.oxd-input').nth(4);
    this.createLoginCheckbox = page.locator('input[type="checkbox"]');
    this.usernameInput = page.locator('input[autocomplete="off"]').nth(0);
    this.passwordInput = page.locator('input[type="password"]').nth(0);
    this.confirmPasswordInput = page.locator('input[type="password"]').nth(1);
    this.saveButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('.oxd-toast-content');
  }

  async clickAddEmployee() {
    await this.clickElement(this.addButton);
  }

  async fillEmployeeDetails(firstName: string, lastName: string, employeeId: string) {
    await this.fillInput(this.firstNameInput, firstName);
    await this.fillInput(this.lastNameInput, lastName);
    await this.employeeIdInput.clear();
    await this.fillInput(this.employeeIdInput, employeeId);
  }

  async createLoginCredentials(username: string, password: string) {
    await this.clickElement(this.createLoginCheckbox);
    await this.fillInput(this.usernameInput, username);
    await this.fillInput(this.passwordInput, password);
    await this.fillInput(this.confirmPasswordInput, password);
  }

  async saveEmployee() {
    await this.clickElement(this.saveButton);
    await this.page.waitForLoadState('networkidle');
  }
}