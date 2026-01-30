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
  dateOfBirth?: string;
  password?: string;
  street?: string ;
  city?: string;
  state?: string ;
  zipCode?: string ;
  postalCode?: string ;
  country?: string ;
  homePhone?: string ;
  mobile?: string ;
  workPhone?: string ;
  workEmail?: string ;
  otherEmail?: string ;
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
  readonly genderMale: Locator;
  readonly dateOfBirthMenu: Locator;
  readonly dateOfBirthInput: Locator;


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
    this.dateOfBirthMenu = page.locator('div:nth-child(5) > div:nth-child(2) > div > .oxd-input-group > div:nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-icon');
    this.dateOfBirthInput = page.locator('option[value=""]');
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
    //await this.dateOfBirthMenu.click();
    //await this.page.getByRole('option', { name: employee.dateOfBirth! }).click();
    //await this.page.getByText(employee.sexe!).click();
    if (employee.sexe === 'Male') {
      await this.page.locator('.oxd-radio-input').first().click();
    } else if (employee.sexe === 'Female') {
      await this.page.locator('.oxd-radio-input').nth(1).click();
    }
  
  }

  async saveEmployee() {
    await this.saveButton.click();
  }
}