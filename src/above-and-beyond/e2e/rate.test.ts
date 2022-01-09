import {expect, test} from '@playwright/test';
import path from "path";

test('rate', async ({page}) => {

    await page.addInitScript({
        path: path.join(__dirname, 'firebase-login.js')
    })
    // Go to http://localhost:3000/rate
    await page.goto('http://localhost:3000/rate');

    await expect(page.locator(`text=Powered by Typesense`)).toBeVisible()

});
