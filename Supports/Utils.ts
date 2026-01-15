
export type Employee = { 
    firstName: string; 
    middleName: string; 
    lastName: string; 
    employeeId: string; 
    nationality: string;
    matrialstaut: string;
    sexe: string;
    dob: string; 
    street: string; 
    city: string; 
    province: string; 
    postal_code: string; 
    mobile: string; 
    email: string; 
    anotheremail:string;
    }; 
    
    import * as fs from "fs"; 
    import { parse } from "csv-parse"; 
    import { finished } from "stream/promises"; 
     
    // read csv file 
    // npm install csv-parse 
    export async function loadCsv(path: string): Promise<Employee[]> { 
        const records: Employee[] = []; 
        const parser = fs.createReadStream(path).pipe(parse({ delimiter: ";" })); 
        parser.on("readable", function () { 
            let employee: Employee; 
            const properties = parser.read(); 
            let record: any[]; 
            while ((record = parser.read()) !== null) { 
            employee = record.reduce((acc, value, index) => { 
                    acc[properties[index]] = value; 
                    return acc; 
                }, {} as Employee); 
                records.push(employee); 
            } 
        }); 
        await finished(parser); 
        return records; 
    } 
    //read json 
export async function loadJson(path: string): Promise<Employee[] | undefined> { 
        try { 
            const jsonString = await fs.promises.readFile(path, "utf8"); 
            const employees: Employee[] = await JSON.parse(jsonString); 
            return employees; 
        } catch (error) { 
             console.log(error.message); 
         } 
    } 
    