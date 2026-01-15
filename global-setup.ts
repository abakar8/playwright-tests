import { chromium } from "@playwright/test";
import { OrangeHRM } from "./tests/pages/orangeHRM";

export default async () => {
  // Lancer Chromium
  const browser = await chromium.launch({
    headless: false, // mettre à true pour CI
  });

  // Créer un contexte avec ignoreHTTPS pour certificat auto-signé
  const context = await browser.newContext({
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  // Instancier OrangeHRM
  const orangeHRM = new OrangeHRM(page);

  // Accéder à la page login et se connecter
  await orangeHRM.Home();
  await orangeHRM.logIn("admin", "Abandass-2024");

  // Sauvegarder la session dans auth.json pour tous les tests
  await context.storageState({ path: "tests/fixtures/auth.json" });

  await browser.close();
  console.log("Auth JSON généré avec succès !");
};
