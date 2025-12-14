import { test} from "@playwright/test"; 
import { OrangeHRM } from "../pages/orangeHRM"; 
import { Employee } from "../Supports/Utils"; 
var employee: Employee = { 
    firstName: "Henri", 
    middleName: "John", 
    lastName: "Poincaré", 
    employeeId: "8567", 
    dob: "2000-12-15", 
    nationality: "Cameroon",
    matrialstaut: "Single",
    sexe:"Masculin",
    street: "29 Rue des sablons", 
    city: "Paris", 
    province: "Paris", 
    postal_code: "75008", 
    mobile: "06 44 55 66 77", 
    email: "demo.cypress@exemple.com", 
    anotheremail: "demo1.cypress@exemple.com", 

    }; 
    
 
test("Full Journey Factorisation", async ({ page }) => { 
    //Instantiate the class 
    const orangeHRM = new OrangeHRM(page); 
    //Home 
    await orangeHRM.Home(); 
    //Login 
    await orangeHRM.logIn('admin','Abandass-2024');
    
    // add employee 
    await orangeHRM.addEmployee(employee); 
    //add employee information 
        
    await orangeHRM.modifyEmployeeContact(employee); 
    
    // search employee by name 
    
    await orangeHRM.searchEmployeeByName(employee); 
    
    // add employee contact information 
    await orangeHRM.modifyEmployeeAddress(employee); 
    
    //search employee by id 
    await orangeHRM.searchEmployeeById(employee); 
    // delete employee 
    await orangeHRM.deleteEmployee(employee); 
    
    //Logout 
    await orangeHRM.logOut(); 
}); 
