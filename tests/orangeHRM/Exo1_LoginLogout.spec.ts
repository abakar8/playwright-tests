import { test, expect } from "@playwright/test"; 
test("LoginLogout", async ({ page }) => { 
//login 
await page.goto('http://localhost/orangehrm-5.7/web/index.php/auth/login');
//await expect(page.getByRole('heading', { name: 'Connexion' })).toBeVisible();
await page.getByPlaceholder('Nom d\'utilisateur').click();
await page.getByPlaceholder('Nom d\'utilisateur').fill('admin');
await page.getByPlaceholder('Mot de passe').click();
await page.getByPlaceholder('Mot de passe').fill('Abandass-2024');
await page.getByRole('button', { name: 'Connexion' }).click();
await page.getByRole('heading', { name: 'Tableau de bord' }).click();
//logout 
await page.locator("//p[@class='oxd-userdropdown-name']").click();  
 await page.getByRole("menuitem", { name: "Déconnexion" }).click();}); 