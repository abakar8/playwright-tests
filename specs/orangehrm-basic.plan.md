# OrangeHRM Basic Operation Test Plan

## Application Overview

OrangeHRM web application basic operations test plan. Covers core user flows: authentication, employee creation, search, modification, deletion, and logout. Assumptions: each scenario uses a fresh browser session unless stated; valid admin credentials are available; test data (employees) can be created/deleted without external dependencies.

## Test Scenarios

### 1. OrangeHRM Basic Operations

**Seed:** `tests/seed.spec.ts`

#### 1.1. Login - Happy Path

**File:** `specs/orangehrm-login.spec.md`

**Steps:**
  1. Open the application home page at https://localhost/orangehrm-5.7/web/index.php/auth/login.
  2. Enter valid username in the Username field.
  3. Enter valid password in the Password field.
  4. Click the Login button.
  5. Wait for the dashboard to load (visible dashboard heading or main navigation).

**Expected Results:**
  - User is authenticated and redirected to the dashboard/main page.
  - Main navigation (e.g., PIM, Admin) is visible and interactive.
  - No authentication error message is shown.

#### 1.2. Login - Invalid Credentials

**File:** `specs/orangehrm-login-negative.spec.md`

**Steps:**
  1. Open the application home page.
  2. Enter invalid username or password.
  3. Click the Login button.
  4. Observe the authentication response.

**Expected Results:**
  - Login is rejected and the user remains on the login page.
  - A visible error message appears indicating invalid credentials.

#### 1.3. Add Employee

**File:** `specs/orangehrm-add-employee.spec.md`

**Steps:**
  1. Log in as a valid user.
  2. Navigate to the PIM section.
  3. Click the Add button to open the Add Employee form.
  4. Fill First Name, Last Name and Employee ID as required.
  5. Click Save and wait for the employee details page or success indication.

**Expected Results:**
  - Employee is created and the employee details page is displayed.
  - A success toast or confirmation is visible.
  - Employee appears in the Employee List when searched by name or ID.

#### 1.4. Search Employee by Name

**File:** `specs/orangehrm-search-by-name.spec.md`

**Steps:**
  1. Log in as a valid user.
  2. Navigate to the PIM or Employee List section.
  3. Enter the employee's first name into the "Type for hints..." textbox.
  4. Click the Search button.
  5. Verify results in the employee list.

**Expected Results:**
  - Employee list contains at least one row matching the entered name.
  - Displayed row shows correct employee name and ID.

#### 1.5. Modify Employee Contact Details

**File:** `specs/orangehrm-modify-contact.spec.md`

**Steps:**
  1. Log in as a valid user.
  2. Open the target employee record (via search/list).
  3. Go to Contact Details section.
  4. Edit address, phone, and email fields and click Save.
  5. Wait for success confirmation.

**Expected Results:**
  - A success toast 'Successfully Updated' is visible.
  - Changes persist when reopening Contact Details.

#### 1.6. Delete Employee

**File:** `specs/orangehrm-delete-employee.spec.md`

**Steps:**
  1. Log in as a valid user.
  2. Navigate to Employee List under PIM.
  3. Search for the employee by name or ID.
  4. Trigger delete on the employee and confirm by clicking 'Yes, Delete'.
  5. Wait for deletion confirmation.

**Expected Results:**
  - A success toast 'Successfully Deleted' is visible.
  - Searching for the employee afterwards returns no results.

#### 1.7. Logout

**File:** `specs/orangehrm-logout.spec.md`

**Steps:**
  1. Log in as a valid user.
  2. Open the user menu where the username is shown.
  3. Click Logout.
  4. Wait for redirection to the login page.

**Expected Results:**
  - User is returned to the login page.
  - Authenticated pages require re-login to access.
