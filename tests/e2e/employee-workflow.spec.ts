import { test, expect } from '../../fixtures/test-fixtures';
import { getEnvironment } from '../../config/environments';

test.describe('Workflow complet employé', () => {
  test('Scénario E2E complet', async ({ 
    loginPage, 
    dashboardPage, 
    addEmployeePage,
    employeeListPage,
    employeeDetailsPage
  }) => {
    const timestamp = Date.now();
    const employeeData = {
      firstName: 'E2E',
      lastName: 'Test',
      employeeId: `E2E${timestamp}`,
      username: `e2e.test${timestamp}`,
      password: 'Test@1234'
    };

    // 1. Connexion
    const env = getEnvironment();
    await loginPage.login(env.username!, env.password!);
    await expect(dashboardPage.pimMenu).toBeVisible();

    // 2. Navigation vers PIM
    await dashboardPage.navigateToPIM();

    // 3. Ajouter un employé
    await addEmployeePage.clickAddEmployee();
    await addEmployeePage.fillEmployeeDetails(
      employeeData.firstName,
      employeeData.lastName,
      employeeData.employeeId
    );
    await addEmployeePage.createLoginCredentials(
      employeeData.username,
      employeeData.password
    );
    await addEmployeePage.saveEmployee();
    await expect(addEmployeePage.successMessage).toBeVisible();

    // 4. Modifier les informations
    await employeeDetailsPage.updatePersonalDetails(
      'E2ENick',
      'E2EID',
      'E2ELIC'
    );
    await expect(employeeDetailsPage.successMessage).toBeVisible();

    // 5. Rechercher l'employé
    await dashboardPage.navigateToPIM();
    await employeeListPage.searchByEmployeeId(employeeData.employeeId);
    await expect(employeeListPage.recordsFound).toBeVisible();

    // 6. Supprimer l'employé
    await employeeListPage.deleteFirstEmployee();
    await expect(employeeListPage.page.locator('.oxd-toast-content')).toBeVisible();

    // 7. Déconnexion
    await dashboardPage.logout();
    await expect(loginPage.loginButton).toBeVisible();
  });
});