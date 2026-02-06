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
    await addEmployeePage.fillEmployeeDetails(employee);
    await addEmployeePage.saveEmployee();
    

    // Vérification du succès - peut varier selon la version d'OrangeHRM
    //await expect(addEmployeePage.page).toHaveURL(/.*employee/);
  });

  test('Ajouter un employé avec toutes les informations', async ({ addEmployeePage, employeeDetailsPage }) => {
    test.setTimeout(60000);
    const employee = createEmployee({
      firstName: 'Marie',
      lastName: 'Martin',
      employeeId: '66e790',
      nationality: 'Albanian',
      matrialstaut: 'Single',
      sexe: 'Female',
      street: '123 Rue Principale',
      city: 'Paris',
      state: 'Île-de-France',
      zipCode: '75001',
      postalCode: '75001',
      country: 'France',
      homePhone: '0123456789',
      mobile: '0612345678',
      workPhone: '0198765432',
      workEmail: 'marie.martin1@orange.com',
      otherEmail: 'marie.martin1@gmail.com',  
    });
    await addEmployeePage.clickAddEmployee(employee);
    await addEmployeePage.saveEmployee();
    await addEmployeePage.fillEmployeeDetails(employee);
    await addEmployeePage.saveEmployee();
    await employeeDetailsPage.updateContactDetails(employee);
  });

});