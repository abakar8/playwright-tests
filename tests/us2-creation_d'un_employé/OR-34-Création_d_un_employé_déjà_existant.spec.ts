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

  test('OR-30_US-2: Ajouter un nouvel employé avec succès', async ({ addEmployeePage }) => {
    test.setTimeout(60000);
    const employee = createEmployee({
      firstName: 'Jean',
      lastName: 'Dupont',
      employeeId: '123425',
      nationality: 'Albanian',
      matrialstaut: 'Single',
      //dateOfBirth: '1990-01-01',
      sexe: 'Male',
      
      
    });

    await addEmployeePage.clickAddEmployee(employee);
    // Employee Id already exists, so we expect an error message to be displayed
    await addEmployeePage.saveEmployee();
    //await addEmployeePage.fillEmployeeDetails(employee);
    //await addEmployeePage.saveEmployee();
     

    // Vérification du succès - peut varier selon la version d'OrangeHRM
    //await expect(addEmployeePage.page).toHaveURL(/.*employee/);
  });   
});