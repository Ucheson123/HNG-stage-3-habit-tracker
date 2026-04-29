import { test, expect, type Page, type Browser } from '@playwright/test';

// We force the tests to run in order
test.describe.configure({ mode: 'serial' });

test.describe('Habit Tracker app', () => {
  let page: Page; // This will hold our shared window
  const baseURL = 'http://localhost:3000';

  // Open a single browser window before any tests start
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  // Clean up and close the window when all tests are done
  test.afterAll(async () => {
    await page.close();
  });

  // Notice we removed ({ page }) from the parameters below!
  test('shows the splash screen and redirects unauthenticated users to /login', async () => {
    await page.goto(baseURL);
    await expect(page.getByTestId('splash-screen')).toBeVisible();
    
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('prevents unauthenticated access to /dashboard', async () => {
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('signs up a new user and lands on the dashboard', async () => {
    await page.goto(`${baseURL}/signup`);
    await page.getByTestId('auth-signup-email').fill('test@hng.com');
    await page.getByTestId('auth-signup-password').fill('password123');
    await page.getByTestId('auth-signup-submit').click();
    
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('logs out and redirects to /login', async () => {
    // Because we shared the window, we are still on the dashboard from the previous test!
    await page.goto(`${baseURL}/dashboard`);
    await page.getByTestId('auth-logout-button').click();
    await page.waitForURL('**/login');
    expect(page.url()).toContain('/login');
  });

  test('logs in an existing user and loads only that user\'s habits', async () => {
    await page.goto(`${baseURL}/login`);
    await page.getByTestId('auth-login-email').fill('test@hng.com');
    await page.getByTestId('auth-login-password').fill('password123');
    await page.getByTestId('auth-login-submit').click();
    
    await page.waitForURL('**/dashboard');
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
  });

  test('creates a habit from the dashboard', async () => {
    await page.goto(`${baseURL}/dashboard`);
    await page.getByTestId('create-habit-button').click();
    await page.getByTestId('habit-name-input').fill('Code Daily');
    await page.getByTestId('habit-save-button').click();
    
    await expect(page.getByTestId('habit-card-code-daily')).toBeVisible();
  });

  test('completes a habit for today and updates the streak', async () => {
    await page.goto(`${baseURL}/dashboard`);
    
    const completeBtn = page.getByTestId('habit-complete-code-daily');
    const streakText = page.getByTestId('habit-streak-code-daily');
    
    await expect(streakText).toContainText('0');
    await completeBtn.click();
    await expect(streakText).toContainText('1');
  });

  test('persists session and habits after page reload', async () => {
    await page.goto(`${baseURL}/dashboard`);
    await page.reload();
    
    await expect(page.getByTestId('dashboard-page')).toBeVisible();
    await expect(page.getByTestId('habit-streak-code-daily')).toContainText('1');
  });

  test('redirects authenticated users from / to /dashboard', async () => {
    await page.goto(baseURL);
    await page.waitForURL('**/dashboard');
    expect(page.url()).toContain('/dashboard');
  });

  test('loads the cached app shell when offline after the app has been loaded once', async ({ browser }: { browser: Browser }) => {
    const context = await browser.newContext();
    const offlinePage = await context.newPage();
    
    await offlinePage.goto(`${baseURL}/login`);
    
    await offlinePage.waitForTimeout(2000); 
    
    await context.setOffline(true); // Now pull the ethernet cord
    
    await offlinePage.reload();
    await expect(offlinePage.getByTestId('auth-login-submit')).toBeVisible();
  });
});