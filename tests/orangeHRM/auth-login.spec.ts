import { expect, test } from "@playwright/test";
import { OrangeHRM } from "../pages/orangeHRM";

test("@smoke Login success with valid credentials", async ({ page }) => {
  const orangeHRM = new OrangeHRM(page);
  await orangeHRM.Home();
  await orangeHRM.logIn("admin", "Abandass-2024");
  await expect(
    page.getByRole("heading", { name: "Dashboard" })
  ).toBeVisible();
  
});
test("@smoke Login fails with invalid credentials", async ({ page }) => {
  const orangeHRM = new OrangeHRM(page);
  await orangeHRM.Home();
  await orangeHRM.logIn("adm", "Abandas");
 await expect(
    page.getByText("Invalid credentials")
  ).toBeVisible();
  
});
test("@smoke Login fails with invalid Username", async ({ page }) => {
  const orangeHRM = new OrangeHRM(page);
  await orangeHRM.Home();
  await orangeHRM.logIn("adm", "Abandass-2024");
 await expect(
    page.getByText("Invalid credentials")
  ).toBeVisible();
  
});
test("@smoke Login fails with invalid Password", async ({ page }) => {
  const orangeHRM = new OrangeHRM(page);
  await orangeHRM.Home();
  await orangeHRM.logIn("admin", "Abandas");
 await expect(
    page.getByText("Invalid credentials")
  ).toBeVisible();
  
});