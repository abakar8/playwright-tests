import { test, expect } from '../../fixtures/test-fixtures';
import { getEnvironment } from '../../config/environments';

test.describe('Authentification OrangeHRM', () => {
  test('CT-OR-8_US-OR-1: Connexion réussie avec des identifiants valides', async ({ loginPage, dashboardPage }) => {
    test.info().annotations.push({ type: 'xray', description: 'OR-8' });
    await loginPage.navigate();
    const env = getEnvironment();
    await loginPage.login(env.username!, env.password!);
    await expect(dashboardPage.pimMenu).toBeVisible();
  });

  test('CT-OR-9_US-OR-1: Échec de connexion avec des identifiants invalides', async ({ loginPage }) => {
    test.info().annotations.push({ type: 'xray', description: 'OR-9' });
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