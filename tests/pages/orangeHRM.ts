import type { Page } from "@playwright/test"; 
import { Employee } from "../Supports/Utils"; 

import { expect } from "@playwright/test"; 
import { stat } from "fs";
export class OrangeHRM { 
 constructor(public readonly page: Page) {} 
 async Home() { 
    await this.page.goto('https://localhost/orangehrm-5.7/web/index.php/auth/login');
 } 
async logIn(username: string, password: string) { 
  await this.page.getByRole('textbox', { name: 'Username' }).click();
  await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
  await this.page.getByRole('textbox', { name: 'Password' }).click();
  await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
  await this.page.getByRole('button', { name: 'Login' }).click();
} 
 
async addEmployee(employee: Employee) {
 // await this.page.getByRole('link', { name: 'Dashboard' }).waitFor({state:'visible'});
  await this.page.getByRole('link', { name: 'PIM' }).waitFor({state:'visible'});
  await this.page.getByRole('link', { name: 'PIM' }).click({ timeout: 10_000 });
  await this.page.getByRole('button', { name: ' Add' }).waitFor({state:'visible'});
  await this.page.getByRole('button', { name: ' Add' }).click();
  await this.page.getByRole('textbox', { name: 'First Name' }).click();
  await this.page.getByRole('textbox', { name: 'First Name' }).fill(employee.firstName);
  await this.page.getByRole('textbox', { name: 'Last Name' }).click();
  await this.page.getByRole('textbox', { name: 'Last Name' }).fill(employee.lastName);
  await this.page.getByRole('textbox').nth(4).click();
  await this.page.getByRole('textbox').nth(4).fill(employee.employeeId);
  await this.page.getByRole('button', { name: 'Save' }).click();

} 
async modifyEmployeeContact(employee: Employee) {
  await this.page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().waitFor({ state: 'visible' });
  await this.page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().click();
  await this.page.getByRole('option', { name: employee.nationality }).click();
  await this.page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
  await this.page.getByText(employee.matrialstaut).click();
  await this.page.locator('div:nth-child(5) > div:nth-child(2) > div > .oxd-input-group > div:nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-icon').click();
  await this.page.getByText(employee.sexe).click();
  await this.page.locator('.oxd-radio-input').first().click();
  await this.page.getByRole('button', { name: 'Save' }).click();
} 
async searchEmployeeByName(employee: Employee) {
  await this.page.getByRole('link', { name: 'PIM' }).click();
  await this.page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await this.page.getByRole('textbox', { name: 'Type for hints...' }).first().fill(employee.firstName);
  await this.page.getByRole('button', { name: 'Search' }).click();
  //await this.page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();

} 
async modifyEmployeeAddress() {
  await this.page.getByRole('link', { name: 'Contact Details' }).waitFor({state:'visible'});
  await this.page.getByRole('link', { name: 'Contact Details' }).click();
  await this.page.getByRole('textbox').nth(1).click();
  await this.page.getByRole('textbox').nth(1).fill('GREZD');
  await this.page.getByRole('textbox').nth(2).click();
  await this.page.getByRole('textbox').nth(2).fill('CESQ');
  await this.page.getByRole('textbox').nth(3).click();
  await this.page.getByRole('textbox').nth(3).fill('EZS');
  await this.page.getByRole('textbox').nth(4).click();
  await this.page.getByRole('textbox').nth(4).fill('DZQ');
  await this.page.getByRole('textbox').nth(5).click();
  await this.page.getByRole('textbox').nth(5).fill('5432');
  await this.page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').click();
  await this.page.getByRole('option', { name: 'Albania' }).click();
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await this.page.locator('.oxd-input.oxd-input--focus').fill('5342');
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('.oxd-input.oxd-input--focus').fill('53423');
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('.oxd-input.oxd-input--focus').fill('42312');
  await this.page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await this.page.locator('.oxd-input.oxd-input--focus').fill('afihxcho@jhk.com');
  await this.page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('.oxd-input.oxd-input--focus').fill('dfefgtgij@gjk.com');

  await this.page.getByRole('button', { name: 'Save' }).click({ timeout: 10_000 });
  await expect(this.page.getByText('Successfully Updated')).toBeVisible();
  const successToast = this.page.locator('.oxd-toast'); // exemple OrangeHRM
  //await expect(successToast).toBeVisible();
  await expect(successToast).toHaveText(/Successfully Updated/i);
  
} 
async searchEmployeeById(employee:Employee) {
  await this.page.getByRole('link', { name: 'GIP' }).click();
  await this.page.getByRole('heading', { name: 'GIP' }).click();
  await this.page.getByRole('link', { name: 'Liste des employés' }).waitFor({state:'visible'});
  await this.page.getByRole('link', { name: 'Liste des employés' }).click();
  await this.page.locator('form').getByRole('textbox').nth(1).click();
  await this.page.locator('form').getByRole('textbox').nth(1).fill(employee.employeeId);
  await this.page.getByRole('button', { name: 'Rechercher' }).click();
 } 
async deleteEmployee(employee:Employee) {
  await this.page.getByRole('link', { name: 'PIM' }).click();
  await this.page.getByRole('link', { name: 'Employee List' }).click();
  await this.page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await this.page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await this.page.getByRole('textbox', { name: 'Type for hints...' }).first().fill(employee.firstName);
  await this.page.getByRole('button', { name: 'Search' }).click();
  
  await this.page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  await this.page.getByRole('button', { name: ' Yes, Delete' }).click();
  const successToast = this.page.locator('.oxd-toast'); 
  await expect(successToast).toBeVisible();
  await expect(successToast).toHaveText(/Successfully Deleted/i);
  


} 
 
async logOut() { 
  await this.page.getByRole('listitem').filter({ hasText: 'ABAKAR GARGOUM' }).locator('i').click();
  await this.page.getByRole('menuitem', { name: 'Logout' }).waitFor({state:'visible'});
  await this.page.getByRole('menuitem', { name: 'Logout' }).click({ timeout: 10_000 });
  await this.page.getByRole('img', { name: 'company-branding' }).waitFor({state:'visible'});
  await this.page.getByRole('img', { name: 'company-branding' }).click();
}
} 
