export interface Employee {
  firstName: string;
  lastName: string;
  employeeId: string;
  nationality?: string;
  matrialstaut?: string;
  sexe?: string;
  username?: string;
  password?: string;
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
    ...overrides
  };
};