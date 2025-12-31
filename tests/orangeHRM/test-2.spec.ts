import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://localhost/orangehrm-5.7/web/index.php/auth/login');
  await page.getByRole('textbox', { name: 'Username' }).fill('FGHJB');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('345678');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Invalid credentials').click();
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('A');
  await page.getByRole('textbox', { name: 'Username' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Username' }).fill('Admin');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).press('CapsLock');
  await page.getByRole('textbox', { name: 'Password' }).fill('234567');
  await page.getByRole('button', { name: 'Login' }).click();
  await page.getByText('Invalid credentials').click();
});