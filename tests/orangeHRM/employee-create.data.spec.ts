import { test, expect } from "@playwright/test";
import { OrangeHRM } from '../pages/orangeHRM';
import { loadJson } from '../Supports/Utils';

let employees: any[] = [];

test.beforeAll(async () => {
  employees = (await loadJson('./tests/fixtures/employees.json')) ?? [];
});

test.describe("Create employees from JSON using storageState", () => {

  test("Add multiple employees", async ({ browser }) => {
    // 🔹 Créer un contexte réutilisant la session globale
    const context = await browser.newContext({
      storageState: 'tests/fixtures/auth.json',
      ignoreHTTPSErrors: true
    });

    const page = await context.newPage();
    const orangeHRM = new OrangeHRM(page);

    // 🔹 Assurer que nous sommes sur le Dashboard
    await page.goto('https://localhost/orangehrm-5.7/web/index.php/dashboard/index');

    // 🔹 Boucle pour ajouter chaque employé
    for (const employee of employees) {
      await test.step(`Add employee: ${employee.firstName} ${employee.lastName}`, async () => {
        await orangeHRM.addEmployee(employee);
        await expect(page.getByText(`${employee.firstName} ${employee.lastName}`)).toBeVisible();
      });
    }


    await context.close();
  });

});
