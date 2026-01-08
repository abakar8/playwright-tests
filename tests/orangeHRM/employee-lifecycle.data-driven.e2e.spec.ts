import { test, expect, Page, BrowserContext } from "@playwright/test"; 
import { OrangeHRM } from "../pages/orangeHRM"; 
import { Employee, loadJson } from "../Supports/Utils"; 
let orangeHRM: OrangeHRM; 
var context: BrowserContext; 
let page: Page; 
var employees: Employee[] | undefined; 
test.beforeAll(async ({ browser }) => { 
        console.log("Before tests"); 
        employees = await loadJson("./tests/fixtures/employees.json"); 
        context = await browser.newContext(); 
        // Create a new page inside context. 
        page = await context.newPage(); 
        orangeHRM = new OrangeHRM(page); 
        //home 
        await orangeHRM.Home(); 
    }); 
     
    test.describe("Employee lifecycle end-to-end", () => { 
        test("login", async () => { 
        await orangeHRM.logIn('admin','Abandass-2024');
            }); 
        test("add employee & ", async () => {
        
            if (employees) 
                for (const employee of employees) { 
                    await orangeHRM.addEmployee(employee); 
                    //await orangeHRM.modifyEmployeeContact(employee); 
                } 
        }); 
    /*
        test("search employee by name & add employee address information", async () => { 
            if (employees) 
                for (const employee of employees) { 
                    await orangeHRM.searchEmployeeByName(employee); 
                    await orangeHRM.modifyEmployeeAddress(employee); 
                } 
        }); 
     
        test("search & delete employee by id", async () => { 
            if (employees) 
                for (const employee of employees) { 
                    await orangeHRM.searchEmployeeById(employee); 
                    await orangeHRM.deleteEmployee(employee); 
                } 
        }); 
     */
        test("logout", async () => { 
            await orangeHRM.logOut(); 

        }); 
    }); 
     
    test.afterAll(async () => { 
        console.log("After tests"); 
        // Dispose context once it's no longer needed. 
        await context.close(); 
    }); 
    