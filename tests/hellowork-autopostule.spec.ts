import { test } from '@playwright/test';

test('OrangeHRM Dash Board', async ({ page }) => {
  await page.goto('https://localhost/orangehrm-5.7/web/index.php/auth/login');
 // await page.click('button[type="Mon compte"]');
  //await page.click('button[type="Se connecter"]');
  //await page.fill('input[type="email"]', 'abakargargoum9@gmail.com');
  //await page.fill('input[type="password"]', 'Abandass-4');
  //await page.click('button[type="submit"]');
  //await page.waitForNavigation();

  //await page.fill('input[placeholder*="métier"]', 'ingénieur QA');
  //await page.fill('input[placeholder*="Où"]', 'France');
  //await page.click('button[type="submit"]');
  //await page.waitForTimeout(3000);

  // Par exemple, vérifier qu’on est sur la page de résultats
  // await expect(page).toHaveURL(/resultats/);

  console.log("✅ Test terminé.");
});
