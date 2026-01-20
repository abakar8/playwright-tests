import { test, expect } from '../../fixtures/test-fixtures';
import { getEnvironment } from '../../config/environments';
import { createEmployee } from '../../Supports/employee-types';

test.describe('Ajout d\'employé', () => {
  test.beforeEach(async ({ loginPage, dashboardPage }) => {
    await loginPage.navigate();
    const env = getEnvironment();
    await loginPage.login(env.username!, env.password!);
    await dashboardPage.navigateToPIM();
  });

  test('Ajouter un nouvel employé avec succès', async ({ addEmployeePage }) => {
    const employee = createEmployee({
      firstName: 'Jean',
      lastName: 'Dupont',
      employeeId: '123425'
    });

    await addEmployeePage.clickAddEmployee(employee);
   // await addEmployeePage.fillEmployeeDetails(employee);
    await addEmployeePage.saveEmployee();

    // Vérification du succès - peut varier selon la version d'OrangeHRM
    //await expect(addEmployeePage.page).toHaveURL(/.*employee/);
  });

  test('Ajouter un employé avec toutes les informations', async ({ addEmployeePage, employeeDetailsPage }) => {
    const employee = createEmployee({
      firstName: 'Marie',
      lastName: 'Martin',
      employeeId: '67890',
      nationality: 'Albanian',
      matrialstaut: 'Single',
      sexe: 'Female'
    });

    await addEmployeePage.clickAddEmployee(employee);
    //await addEmployeePage.fillEmployeeDetails(employee);
    await addEmployeePage.saveEmployee();
    
    // Ajout des détails personnels
    await employeeDetailsPage.updatePersonalDetails(employee);
  });
});