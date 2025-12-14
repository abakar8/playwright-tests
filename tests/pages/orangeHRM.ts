import type { Page } from "@playwright/test"; 
import { Employee } from "../Supports/Utils"; 

import { expect } from "@playwright/test"; 
import { stat } from "fs";
export class OrangeHRM { 
 constructor(public readonly page: Page) {} 
 async Home() { 
    await this.page.goto('http://localhost/orangehrm-5.7/web/index.php/auth/login');
 } 
async logIn(username: string, password: string) { 
  await this.page.getByPlaceholder('Nom d\'utilisateur').click();
  await this.page.getByPlaceholder('Nom d\'utilisateur').fill(username);
  await this.page.getByPlaceholder('Mot de passe').click();
  await this.page.getByPlaceholder('Mot de passe').fill(password);
  await this.page.getByRole('button', { name: 'Connexion' }).click();
  await this.page.getByRole('heading', { name: 'Tableau de bord' }).waitFor({state:"visible"});
} 
 
async addEmployee(employee: Employee) {
  await this.page.getByRole('link', { name: 'GIP' }).click();
  await this.page.getByRole('heading', { name: 'GIP' }).waitFor({state:"visible"});
  await this.page.getByRole('button', { name: ' Ajouter' }).click();
  await this.page.getByPlaceholder('Prénom', { exact: true }).waitFor({state:"visible"});
  await this.page.getByPlaceholder('Prénom', { exact: true }).click();
  await this.page.getByPlaceholder('Prénom', { exact: true }).fill(employee.firstName);
  await this.page.getByPlaceholder('Nom de famille').click();
  await this.page.getByPlaceholder('Nom de famille').fill(employee.lastName);
  await this.page.locator('form').getByRole('textbox').nth(4).click();
  await this.page.locator('form').getByRole('textbox').nth(4).fill(employee.employeeId);
  await this.page.getByRole('button', { name: 'Sauvegarder' }).click();
  await this.page.waitForTimeout(6000)


} 
async modifyEmployeeContact(employee: Employee) {
  await this.page.locator('form i').nth(1).waitFor({ state: 'visible' });
  await this.page.locator('form i').nth(1).click();
  await this.page.getByRole('option', { name: employee.nationality }).waitFor({state:"visible"});
  await this.page.getByRole('option', { name: employee.nationality }).click();
  await this.page.locator('form i').nth(2).waitFor({state:"visible"});
  await this.page.locator('form i').nth(2).click();
  await this.page.getByRole('option', { name: employee.matrialstaut }).waitFor({state:"visible"});
  await this.page.getByRole('option', { name: employee.matrialstaut }).click();
  await this.page.locator('div:below(:text("Date de naissance")) input[placeholder="yyyy-mm-dd"]').waitFor({state:"visible"});
  await this.page.locator('div:below(:text("Date de naissance")) input[placeholder="yyyy-mm-dd"]').fill(employee.dob);
  await this.page.locator('label').filter({ hasText: employee.sexe}).locator('span').waitFor({state:"visible"})
  await this.page.locator('label').filter({ hasText: employee.sexe}).locator('span').click();
  await this.page.getByRole('button', { name: 'Sauvegarder' }).click();
 // await this.page.locator('Informations personnelles") button[type="submit"]').click();
  await this.page.waitForTimeout(6000); 
} 
async searchEmployeeByName(employee:Employee) {
  await this.page.getByRole('link', { name: 'GIP' }).click();
  await this.page.getByRole('heading', { name: 'GIP' }).click();
  await this.page.getByRole('link', { name: 'Liste des employés' }).waitFor({state:'visible'});
  await this.page.getByRole('link', { name: 'Liste des employés' }).click();
  await this.page.getByPlaceholder('Type for hints...').first().click();
  await this.page.getByPlaceholder('Type for hints...').first().fill(employee.firstName);
  await this.page.getByRole('button', { name: 'Rechercher' }).click();
  await this.page.waitForTimeout(3000);  
  await this.page.locator('div.oxd-table-card:nth-child(1) button:nth-child(1) > i.bi-pencil-fill').click();
  await this.page.waitForTimeout(3000); 

} 
async modifyEmployeeAddress(employee:Employee) {
  await this.page.getByRole('heading', { name: 'Informations personnelles' }).click();
  await this.page.getByRole('link', { name: 'Coordonnées' }).click();
  await this.page.getByRole('heading', { name: 'Coordonnées' }).click();
  await this.page.waitForTimeout(3000); 
  await this.page.locator('div:nth-child(2) > .oxd-input').first().click({ force: true });
  await this.page.locator('div:nth-child(2) > .oxd-input').first().fill(employee.street);
  await this.page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click({ force: true });
  await this.page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill(employee.street);
  await this.page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await this.page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill(employee.city);
  await this.page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(employee.province);
  await this.page.locator('div:nth-child(5) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('div:nth-child(5) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(employee.postal_code);
  await this.page.getByText('-- Select --').click();
  await this.page.getByRole('option', { name: employee.nationality }).click();
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill(employee.mobile);
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(employee.mobile);
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(employee.mobile);
  await this.page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await this.page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill(employee.email);
  await this.page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await this.page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill(employee.anotheremail);
  await this.page.getByRole('button', { name: 'Sauvegarder' }).click();
  await this.page.waitForTimeout(3000); 
} 
async searchEmployeeById(employee:Employee) {
  await this.page.getByRole('link', { name: 'GIP' }).click();
  await this.page.getByRole('heading', { name: 'GIP' }).click();
  await this.page.getByRole('link', { name: 'Liste des employés' }).waitFor({state:'visible'});
  await this.page.getByRole('link', { name: 'Liste des employés' }).click();
  await this.page.locator('form').getByRole('textbox').nth(1).click();
  await this.page.locator('form').getByRole('textbox').nth(1).fill(employee.employeeId);
  await this.page.getByRole('button', { name: 'Rechercher' }).click();
  await this.page.waitForTimeout(3000);  
} 
async deleteEmployee(employee: Employee) {
  await this.page.getByRole('heading', { name: 'Informations sur les employés' }).waitFor({state:'visible'});
  await this.page.locator('div.oxd-table-cell-actions button:has(i.bi-trash)').click();
  await this.page.getByRole('button', { name: ' Yes, Delete' }).click();
  await this.page.waitForTimeout(3000);  


} 
 
async logOut() { 
    await this.page.getByText('Abakar GARGOUM').click();
    await this.page.getByRole('menuitem', { name: 'Déconnexion' }).click();
    await this.page.getByRole('heading', { name: 'Connexion' }).click(); 
}
} 
