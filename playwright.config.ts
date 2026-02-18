import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: "*spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    
    ['html', { 
      open: 'never',
      outputFolder: 'playwright-report' 
    }],
    ['list'],
    ['json', { 
      outputFile: 'test-results/results.json' 
    }],
    ['junit', { 
      outputFile: 'test-results/junit.xml',
      embedAnnotationsAsProperties: true,
      embedAttachmentsAsProperty: 'testrun_evidence',
      includeProjectInTestCaseName: true,
      textContentAnnotations: ['xray']
    }]
  ],

  // ✅ AJOUT ICI
  //webServer: {
    //command: 'php -S localhost:8080 -t orangehrm-5.7/web',
    //url: 'http://localhost:8080',
    //timeout: 60000,
    //reuseExistingServer: !process.env.CI,
  //},

  use: {
    ignoreHTTPSErrors: true,

    // ✅ baseURL propre (sans /auth/login)
    baseURL: process.env.BASE_URL || 'http://localhost/orangehrm-5.7/web/index.php/auth/login',

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 30000,
    navigationTimeout: 60000
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
    webServer: undefined  // Pas besoin de serveur web, XAMPP gère ça

});
