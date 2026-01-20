import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { AddEmployeePage } from '../pages/employee/add-employee.page';
import { EmployeeListPage } from '../pages/employee/employee-list.page';
import { EmployeeDetailsPage } from '../pages/employee/employee-details.page';

type OrangeHRMFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  addEmployeePage: AddEmployeePage;
  employeeListPage: EmployeeListPage;
  employeeDetailsPage: EmployeeDetailsPage;
};

export const test = base.extend<OrangeHRMFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  addEmployeePage: async ({ page }, use) => {
    await use(new AddEmployeePage(page));
  },

  employeeListPage: async ({ page }, use) => {
    await use(new EmployeeListPage(page));
  },

  employeeDetailsPage: async ({ page }, use) => {
    await use(new EmployeeDetailsPage(page));
  }
});

export { expect } from '@playwright/test';