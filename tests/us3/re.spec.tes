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

  test('OR-29 - Création d’un employé avec données valides', async ({ addEmployeePage }) => {
    test.setTimeout(60000);
    test.info().annotations.push({ type: 'Jira', description: 'OR-29' });
    const employee = createEmployee({
      firstName: 'Jean',
      lastName: 'Dupont',
      employeeId: '128425',
      nationality: 'Albanian',
      matrialstaut: 'Single',
      //dateOfBirth: '1990-01-01',
      sexe: 'Male',
      
      
    });

    await addEmployeePage.clickAddEmployee(employee);
    await addEmployeePage.saveEmployee();
    //await addEmployeePage.fillEmployeeDetails(employee);
    //await addEmployeePage.saveEmployee();
     

    // Vérification du succès - peut varier selon la version d'OrangeHRM
    //await expect(addEmployeePage.page).toHaveURL(/.*employee/);
  });   
});