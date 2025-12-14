import { chromium, Browser, Page } from 'playwright';

async function loginToHellowork(page: Page) {
  await page.goto('https://www.hellowork.com/');

  await page.click('text=Connexion'); // à adapter selon le bouton exact
  await page.fill('input[type="email"]', 'ton.email@gmail.com');
  await page.fill('input[type="password"]', 'ton_mot_de_passe');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();

  console.log("✅ Connexion réussie.");
}

async function searchJob(page: Page) {
  await page.fill('input[placeholder="Quel métier recherchez-vous ?"]', 'ingénieur QA');
  await page.fill('input[placeholder="Où ?"]', 'France');

  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  console.log("🔍 Résultats affichés.");
}

async function main() {
  const browser: Browser = await chromium.launch({ headless: false });
  const page: Page = await browser.newPage();

  try {
    await loginToHellowork(page);
    await searchJob(page);

    // Ajouter ici : clic sur les filtres, sélection d’une offre, bouton "Postuler"...

    console.log("✅ Script terminé.");
  } catch (error) {
    console.error("❌ Une erreur est survenue :", error);
  } finally {
    await browser.close();
  }
}

main();
