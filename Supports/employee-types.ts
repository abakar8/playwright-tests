export interface Employee {
  firstName: string;
  lastName: string;
  employeeId: string;
  nationality?: string;
  matrialstaut?: string;
  sexe?: string;
  username?: string;
  password?: string;
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  postalCode?: string;
  country?: string;
  homePhone?: string;
  mobile?: string;
  workPhone?: string;
  workEmail?: string;
  otherEmail?: string;
}

export const createEmployee = (overrides?: Partial<Employee>): Employee => {
  const timestamp = Date.now();
  return {
    firstName: 'Test',
    lastName: 'Employee',
    employeeId: `EMP${timestamp}`,
    nationality: 'Albanian',
    matrialstaut: 'Single',
    sexe: 'Male',
    username: `test.user${timestamp}`,
    password: 'Test@1234',
    street: '123 Rue Principale',
    city: 'Paris',
    state: 'Île-de-France',
    zipCode: '75001',
    postalCode: '75001',
    country: 'France',
    homePhone: '0123456789',
    mobile: '0612345678',
    workPhone: '0198765432',
    workEmail: 'test.employee@orange.com',
    otherEmail: 'test.employee@gmail.com',
    ...overrides
  };
};