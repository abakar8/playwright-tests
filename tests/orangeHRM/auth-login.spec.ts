import { test } from "@playwright/test";
import { OrangeHRM } from "../pages/orangeHRM";

test("Admin login", async ({ page }) => {
  const orangeHRM = new OrangeHRM(page);
  await orangeHRM.Home();
  await orangeHRM.logIn("admin", "Abandass-2024");
});
