import {expect, test} from '@playwright/test';
import path from "path";

test.beforeEach(async ({page}) => {
    await page.addInitScript({
        path: path.join(__dirname, 'firebase-login.js')
    })
    // Go to http://localhost:3000/rate
    await page.goto('http://localhost:3000/rate');
});

test('rate', async ({page}) => {
    await expect(page.locator(`text=Powered by Typesense`)).toBeVisible()
});

test('filtering issues', async ({page}) =>
{

    // Fill input[type="radio"]
    await page.fill('input[type="radio"]', '');

});

test('filtering success', async ({page}) =>
{

    // Fill input[type="radio"]
    await page.fill('input[type="radio"]', '');

});
