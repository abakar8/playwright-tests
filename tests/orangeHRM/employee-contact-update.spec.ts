import { test } from "@playwright/test";
import { OrangeHRM } from "../pages/orangeHRM";
import { Employee, loadJson } from "../Supports/Utils";

test("Update employee contact details", async ({ page }) => {
  const orangeHRM = new OrangeHRM(page);
  const employees: Employee[] = await loadJson("./tests/fixtures/employees.json");

  await orangeHRM.Home();
  await orangeHRM.logIn("admin", "Abandass-2024");

  for (const employee of employees) {
    await orangeHRM.modifyEmployeeContact(employee);
  }

  await orangeHRM.logOut();
});
