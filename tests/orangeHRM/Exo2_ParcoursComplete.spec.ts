import { test, expect } from '@playwright/test';
import type { Page } from "@playwright/test"; 


test('test', async ({ page }) => {
  await page.goto('https://localhost/orangehrm-5.7/web/index.php/auth/login');
  await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
  await page.getByPlaceholder('Nom d\'utilisateur').click();
  await page.getByPlaceholder('Nom d\'utilisateur').fill('admin');
  await page.getByPlaceholder('Mot de passe').click();
  await page.getByPlaceholder('Mot de passe').fill('Abandass-2024');
  await page.getByRole('button', { name: 'Connexion' }).click();
  await page.getByRole('heading', { name: 'Tableau de bord' }).click();
  await page.getByRole('link', { name: 'GIP' }).click();
  await page.getByRole('heading', { name: 'GIP' }).click();

  await page.getByRole('button', { name: ' Ajouter' }).click();
  await page.getByPlaceholder('Prénom', { exact: true }).click();
  await page.getByPlaceholder('Prénom', { exact: true }).fill('rteDDyd');
  await page.getByPlaceholder('Nom de famille').click();
  await page.getByPlaceholder('Nom de famille').fill('csDhjaws');
  await page.locator('form').getByRole('textbox').nth(4).click();
  await page.locator('form').getByRole('textbox').nth(4).fill('1567');
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await page.waitForTimeout(3000)
  await page.locator('form i').nth(1).waitFor({ state: 'visible' });
  await page.locator('form i').nth(1).click();
  await page.getByRole('option', { name: 'Albanian' }).click();
  await page.locator('form i').nth(2).click();
  await page.getByRole('option', { name: 'Single' }).click();
  await page.locator('div').filter({ hasText: /^Date de naissanceSexeMasculinFéminin$/ }).locator('i').click();
  await page.getByText('3', { exact: true }).click();
  await page.locator('label').filter({ hasText: 'Masculin' }).locator('span').click();
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await page.waitForTimeout(3000); 
 // await page.getByRole('link', { name: 'Liste des employés' }).click();
  //await page.getByPlaceholder('Type for hints...').waitFor({ state: 'visible' });
  await page.getByPlaceholder('Type for hints...').first().click();
  await page.getByPlaceholder('Type for hints...').first().fill('rteDDyd');
  await page.getByRole('button', { name: 'Rechercher' }).click(); 
  await page.getByRole('button', { name: '' }).nth(1).click();
  //await page.locator("//i[@class='oxd-icon bi-pencil-fill']").click(); 
  await page.getByRole('heading', { name: 'Informations personnelles' }).click();
  await page.getByRole('link', { name: 'Coordonnées' }).click();
  
  await page.getByRole('heading', { name: 'Coordonnées' }).click();
  await page.locator('div:nth-child(2) > .oxd-input').first().click();
  await page.locator('div:nth-child(2) > .oxd-input').first().fill('f2');
  await page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill('d3');
  await page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill('fdsa');
  await page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('div:nth-child(4) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill('sds');
  await page.locator('div:nth-child(5) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('div:nth-child(5) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill('3423');
  await page.getByText('-- Select --').click();
  await page.getByRole('option', { name: 'Albania' }).click();
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill('45678');
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill('5678');
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill('65432');
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().fill('ghjkFl@ghjk.com');
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').fill('fghjF@hj.com');
  await page.getByRole('button', { name: 'Sauvegarder' }).click();
  await page.waitForTimeout(3000); 
  
  await page.getByRole('link', { name: 'Liste des employés' }).click();
  await page.getByRole('heading', { name: 'Informations sur les employés' }).click();
  await page.getByPlaceholder('Type for hints...').first().click();
  await page.getByPlaceholder('Type for hints...').first().fill('rteDDyd');
  await page.getByRole('button', { name: 'Rechercher' }).click();
  await page.getByRole('columnheader', { name: '' }).locator('i').click();
  await page.getByRole('button', { name: ' Delete Selected' }).click();
  await page.getByRole('button', { name: ' Yes, Delete' }).click();

  await page.getByText('Abakar GARGOUM').click();
  await page.getByRole('menuitem', { name: 'Déconnexion' }).click();
  await page.getByRole('heading', { name: 'Connexion' }).click();
});