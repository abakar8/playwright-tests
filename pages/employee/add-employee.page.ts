import { Page, Locator } from '@playwright/test';
import { BasePage } from '../base.page';

export interface Employee {
  firstName: string;
  lastName: string;
  employeeId: string;
  nationality?: string;
  matrialstaut?: string;
  sexe?: string;
  username?: string;
  password?: string;
}

export class AddEmployeePage extends BasePage {
  readonly addButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly employeeIdInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly successToast: Locator;
  readonly nationalityMenu: Locator;
  readonly nationalityInput: Locator;
  readonly maritalStatusMenu: Locator;
  readonly maritalStatusInput: Locator;
  readonly genderMale: Locator

  constructor(page: Page) {
    super(page);
    this.addButton = page.getByRole('button', { name: ' Add' });
    this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
    this.employeeIdInput = page.getByRole('textbox').nth(4);
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.getByText('Successfully Updated');
    this.successToast = page.locator('.oxd-toast');
    this.nationalityMenu = page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first(); 
    this.nationalityInput = page.getByRole('option', { name:'' }); 
    this.maritalStatusMenu = page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon'); 
    this.maritalStatusInput = page.locator(''); 
    this.genderMale = page.locator(''); 
  }

  async clickAddEmployee(employee: Employee) {
    await this.addButton.waitFor({ state: 'visible' });
    await this.addButton.click();
    await this.firstNameInput.click();
    await this.firstNameInput.fill(employee.firstName);
    await this.lastNameInput.click();
    await this.lastNameInput.fill(employee.lastName);
    await this.employeeIdInput.click();
    await this.employeeIdInput.fill(employee.employeeId);
  }

  async fillEmployeeDetails(employee: Employee) {
    await this.nationalityMenu.waitFor({ state: 'visible' });
    await this.nationalityMenu.click();
    await this.page.getByRole('option', { name: employee.nationality! }).click();
    await this.maritalStatusMenu.click();
    await this.page.getByText(employee.matrialstaut!).click();
    await this.firstNameInput.click();
    await this.firstNameInput.fill(employee.firstName);
    await this.lastNameInput.click();
    await this.lastNameInput.fill(employee.lastName);
    await this.employeeIdInput.click();
    await this.employeeIdInput.fill(employee.employeeId);
  }

  async saveEmployee() {
    await this.saveButton.click();
  }
}