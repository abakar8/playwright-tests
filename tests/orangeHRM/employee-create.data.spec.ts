import { test, expect } from "@playwright/test"; 
import { OrangeHRM } from "../pages/orangeHRM"; 
import { loadJson } from "../Supports/Utils"; 
 
test("Create employees from Json", async ({ page }) => { 
    const employees = await loadJson("./tests/fixtures/employees.json"); 
    // Instantiate the class 
    const orangeHRM = new OrangeHRM(page); 
    // Home + login 
    await orangeHRM.Home(); 
    await orangeHRM.logIn("admin", "Abandass-2024"); 
    if (employees) { 
        // check if employees exists 
        console.log(employees[0].employeeId); 
        for (const employee of employees) { 
             await orangeHRM.addEmployee(employee); 
             //await orangeHRM.modifyEmployeeContact(employee); 
    } 
    } 
    // logout 
    await orangeHRM.logOut(); 
});

function timeout(arg0: number) {
  throw new Error("Function not implemented.");
}
