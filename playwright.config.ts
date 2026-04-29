import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Tells Playwright to ONLY run tests in this specific folder
  testDir: './tests/e2e',
  
  forbidOnly: !!process.env.CI,
  retries: 1,
  workers: 1,
  
  // THIS IS THE BYPASS: Tells Playwright to use your computer's built-in Chrome
  projects: [
    {
      name: 'Google Chrome',
      use: { 
        ...devices['Desktop Chrome'], 
        channel: 'chrome' 
      },
    },
  ],

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
});