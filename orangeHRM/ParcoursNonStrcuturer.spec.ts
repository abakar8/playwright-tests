import { test, expect } from '@playwright/test';

test.use({
  ignoreHTTPSErrors: true
});

test('test', async ({ page }) => {
  await page.goto('https://localhost/orangehrm-5.7/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('Abandass-2024');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByRole('link', { name: 'PIM' }).click();
  
  await page.getByRole('button', { name: ' Add' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).click();
  await page.getByRole('textbox', { name: 'First Name' }).fill('ALI');
  await page.getByRole('textbox', { name: 'Last Name' }).click();
  await page.getByRole('textbox', { name: 'Last Name' }).fill('ABDEL');
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('658912');
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000)
  await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().waitFor({ state: 'visible' });
  await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').first().click();
  await page.getByRole('option', { name: 'Albanian' }).click();
  await page.locator('div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-select-wrapper > .oxd-select-text > .oxd-select-text--after > .oxd-icon').click();
  await page.getByText('Married').click();
  await page.locator('div:nth-child(5) > div:nth-child(2) > div > .oxd-input-group > div:nth-child(2) > .oxd-date-wrapper > .oxd-date-input > .oxd-icon').click();
  await page.getByText('17').click();
  await page.locator('.oxd-radio-input').first().click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.waitForTimeout(3000);
 
  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('ALI');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(3).click();
  await page.getByRole('link', { name: 'Contact Details' }).click();
  await page.getByRole('textbox').nth(1).click();
  await page.getByRole('textbox').nth(1).fill('GREZD');
  await page.getByRole('textbox').nth(2).click();
  await page.getByRole('textbox').nth(2).fill('CESQ');
  await page.getByRole('textbox').nth(3).click();
  await page.getByRole('textbox').nth(3).fill('EZS');
  await page.getByRole('textbox').nth(4).click();
  await page.getByRole('textbox').nth(4).fill('DZQ');
  await page.getByRole('textbox').nth(5).click();
  await page.getByRole('textbox').nth(5).fill('5432');
  await page.locator('.oxd-icon.bi-caret-down-fill.oxd-select-text--arrow').click();
  await page.getByRole('option', { name: 'Albania' }).click();
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('.oxd-input.oxd-input--focus').fill('5342');
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('.oxd-input.oxd-input--focus').fill('53423');
  await page.locator('div:nth-child(6) > .oxd-grid-3 > div:nth-child(3) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('.oxd-input.oxd-input--focus').fill('42312');
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div > .oxd-input-group > div:nth-child(2) > .oxd-input').first().click();
  await page.locator('.oxd-input.oxd-input--focus').fill('aghjudiho@jhk.com');
  await page.locator('div:nth-child(9) > .oxd-grid-3 > div:nth-child(2) > .oxd-input-group > div:nth-child(2) > .oxd-input').click();
  await page.locator('.oxd-input.oxd-input--focus').fill('rbddftgij@gjk.com');

  await page.getByRole('button', { name: 'Save' }).click({ timeout: 10_000 });
  await expect(page.getByText('Successfully Updated')).toBeVisible();
  //await page.waitForTimeout(10000);
  const successToast = page.locator('.oxd-toast'); // exemple OrangeHRM
  await expect(successToast).toBeVisible();
  await expect(successToast).toHaveText(/Successfully Updated/i);

  await page.getByRole('link', { name: 'Employee List' }).click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().click();
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().press('CapsLock');
  await page.getByRole('textbox', { name: 'Type for hints...' }).first().fill('ALI');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button').filter({ hasText: /^$/ }).nth(4).click();
  await page.getByRole('button', { name: ' Yes, Delete' }).click();
 //const successToast = page.locator('.oxd-toast'); 
  await expect(successToast).toBeVisible();
  await expect(successToast).toHaveText(/Successfully Deleted/i);
  
  await page.getByRole('listitem').filter({ hasText: 'ABAKAR GARGOUM' }).locator('i').click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await page.getByRole('img', { name: 'company-branding' }).click();
});