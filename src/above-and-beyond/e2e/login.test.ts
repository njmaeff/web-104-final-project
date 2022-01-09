import {expect, test} from '@playwright/test';

test('test login', async ({page}) => {
    // Go to http://localhost:3000/login
    await page.goto('http://localhost:3000/login');
    // Fill input[name="email"]
    await page.fill('input[name="email"]', process.env.TEST_USER);
    // Press Tab
    await page.press('input[name="email"]', 'Tab');
    // Press Enter
    await page.press('text=Next', 'Enter');
    // Fill input[name="password"]
    await page.fill('input[name="password"]', process.env.TEST_PASSWORD);
    // Click button:has-text("Sign In")
    await Promise.all([
        page.waitForNavigation(/*{ url: 'http://localhost:3000/home' }*/),
        page.click('button:has-text("Sign In")')
    ]);

    await expect(page.locator(`text=$63,507.00`)).toBeVisible()
});


test('test home', async ({page}) => {
    await page.addInitScript({
        path: './e2e/firebase-login.js'
    });
    throw new Error("not implemented yet")
});
