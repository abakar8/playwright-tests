import { test, expect } from "@playwright/test"; 
import { Employee, loadCsv, loadJson } from "../supports/Utils"; 
 
test.describe ("read data file", async () => { 
    test("read json file", async () => { 
        const employees = await loadJson("./tests/fixtures/employees.json"); 
        if (employees) 
            for (const employee of employees) { 
                console.log(employee); 
                console.log(employee.employeeId); 
            } 
    }); 
    test("read csv file", async () => { 
        const employees: Employee[] = await loadCsv("./tests/fixtures/employees.csv"); 
        for (const employee of employees) { 
            console.log(employee); 
            console.log(employee.employeeId); 
        } 
    }); 
});
