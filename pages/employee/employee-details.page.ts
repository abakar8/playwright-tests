import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../base.page';
import { Employee } from './add-employee.page';

export class EmployeeDetailsPage extends BasePage {
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
  //readonly countryDropdownInput: Locator;

  constructor(page: Page) {
    super(page);
    
    // Contact details
    this.contactDetailsLink = page.getByRole('link', { name: 'Contact Details' });
    this.streetInput = page.getByRole('textbox').nth(1);
    this.cityInput = page.getByRole('textbox').nth(2);
    this.stateInput = page.getByRole('textbox').nth(3);
    this.zipCodeInput = page.getByRole('textbox').nth(4);
    this.countryDropdown = page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow');
    // this.countryDropdownInput = page.getByRole('option', { name: '' });
    this.homePhoneInput = page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first();
    this.mobilePhoneInput = page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input');
    this.workPhoneInput = page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input');
    this.workEmailInput = page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first();
    this.otherEmailInput = page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input');
    this.saveButton = page.getByRole('button', { name: 'Save' });
    this.successMessage = page.getByText('Successfully Updated');
    this.successToast = page.locator('.oxd-toast');
  }


  async updateContactDetails(employee: Employee) 
  {
    await this.contactDetailsLink.waitFor({ state: 'visible' });
    await this.contactDetailsLink.click();
    await this.streetInput.waitFor({ state: 'visible' });
    await this.streetInput.click();
    await this.streetInput.fill(employee.street ?? '');
    await this.cityInput.click();
    await this.cityInput.fill(employee.city ?? '');
    
    await this.stateInput.click();
    await this.stateInput.fill(employee.state ?? '');
    
    await this.zipCodeInput.click();
    await this.zipCodeInput.fill(employee.zipCode ?? '');
    
    await this.page.getByRole('textbox').nth(5).click();
    await this.page.getByRole('textbox').nth(5).fill(employee.postalCode ?? '');
    
    await this.countryDropdown.click();
    await this.page.getByRole('option', { name: employee.country ?? '' }).click();
   // await this.countryDropdownInput.fill(country);
    
    await this.homePhoneInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(employee.homePhone ?? '' );
    
    await this.mobilePhoneInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(employee.mobile ?? '');
    
    await this.workPhoneInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(employee.workPhone ?? '');
    
    await this.workEmailInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(employee.workEmail ?? '');
    
    await this.otherEmailInput.click();
    await this.page.locator('.oxd-input.oxd-input--focus').fill(employee.otherEmail ?? '');
    
    await this.saveButton.click({ timeout: 10000 });
    
    await expect(this.successMessage).toBeVisible();
    await expect(this.successToast).toBeVisible();
    await expect(this.successToast).toHaveText(/Successfully Updated/i);
  }
}