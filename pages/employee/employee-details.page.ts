import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { Employee } from './add-employee.page';

export class EmployeeDetailsPage extends BasePage {
  readonly nationalityDropdown: Locator;
  readonly maritalStatusDropdown: Locator;
  readonly genderRadio: Locator;
  readonly datePickerIcon: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly successToast: Locator;
  readonly contactDetailsLink: Locator;

  // Contact Details fields
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipCodeInput: Locator;
  readonly countryDropdown: Locator;
  readonly homePhoneInput: Locator;
  readonly mobilePhoneInput: Locator;
  readonly workPhoneInput: Locator;
  readonly workEmailInput: Locator;
  readonly otherEmailInput: Locator;

  constructor(page: Page) {
    super(page);
    
    // Personal details
    this.nationalityDropdown = page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first();
    this.maritalStatusDropdown = page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon');
    this.genderRadio = page.locator('.oxd-radio-input').first();
    this.datePickerIcon = page.locator('div:nth-child(5) > div:nth-child(2) > div > .oxd-input-group > div:nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-icon');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.getByText('Successfully Updated');
    this.successToast = page.locator('.oxd-toast');
    this.contactDetailsLink = page.getByRole('link', { name: 'Contact Details' });

    // Contact details
    this.streetInput = page.getByRole('textbox').nth(1);
    this.cityInput = page.getByRole('textbox').nth(2);
    this.stateInput = page.getByRole('textbox').nth(3);
    this.zipCodeInput = page.getByRole('textbox').nth(4);
    this.countryDropdown = page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow');
    this.homePhoneInput = page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first();
    this.mobilePhoneInput = page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input');
    this.workPhoneInput = page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input');
    this.workEmailInput = page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first();
    this.otherEmailInput = page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input');
  }

  async updatePersonalDetails(employee: Employee) {
    await this.nationalityDropdown.waitFor({ state: 'visible' });
    await this.nationalityDropdown.click();
    await this.page.getByRole('option', { name: employee.nationality! }).click();
    
    await this.maritalStatusDropdown.click();
    await this.page.getByText(employee.matrialstaut!).click();
    
    await this.datePickerIcon.click();
    await this.page.getByText(employee.sexe!).click();
    
    await this.genderRadio.click();
    await this.saveButton.click();
  }

  async updateContactDetails(
    street: string = 'GREZD',
    city: string = 'CESQ',
    state: string = 'EZS',
    zipCode: string = 'DZQ',
    postalCode: string = '5432',
    country: string = 'Albania',
    homePhone: string = '5342',
    mobile: string = '53423',
    workPhone: string = '42312',
    workEmail: string = 'afihxcho@jhk.com',
    otherEmail: string = 'dfefgtgij@gjk.com'
  ) {
    await this.contactDetailsLink.waitFor({ state: 'visible' });
    await this.contactDetailsLink.click();
    
    await this.streetInput.click();
    await this.streetInput.fill(street);
    
    await this.cityInput.click();
    await this.cityInput.fill(city);
    
    await this.stateInput.click();
    await this.stateInput.fill(state);
    
    await this.zipCodeInput.click();
    await this.zipCodeInput.fill(zipCode);
    
    await this.page.getByRole('textbox').nth(5).click();
    await this.page.getByRole('textbox').nth(5).fill(postalCode);
    
    await this.countryDropdown.click();
    await this.page.getByRole('option', { name: country }).click();
    
    await this.homePhoneInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(homePhone);
    
    await this.mobilePhoneInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(mobile);
    
    await this.workPhoneInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(workPhone);
    
    await this.workEmailInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(workEmail);
    
    await this.otherEmailInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(otherEmail);
    
    await this.saveButton.click({ timeout: 10000 });
    
    await expect(this.successMessage).toBeVisible();
    await expect(this.successToast).toBeVisible();
    await expect(this.successToast).toHaveText(/Successfully Updated/i);
  }
}