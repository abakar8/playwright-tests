import { test, expect } from '../../fixtures/test-fixtures';
import { getEnvironment } from '../../config/environments';

test.describe('Authentification OrangeHRM', () => {
  test('Connexion réussie avec des identifiants valides', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    const env = getEnvironment();
    await loginPage.login(env.username!, env.password!);
    await expect(dashboardPage.pimMenu).toBeVisible();
  });

  test('Échec de connexion avec des identifiants invalides', async ({ loginPage }) => {
    await loginPage.navigate();
    await loginPage.login('InvalidUser', 'wrongpass');
    
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('Déconnexion réussie', async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    const env = getEnvironment();
    await loginPage.login(env.username!, env.password!);
    
    await dashboardPage.logout();
    
    await expect(loginPage.companyLogo).toBeVisible();
  });
});