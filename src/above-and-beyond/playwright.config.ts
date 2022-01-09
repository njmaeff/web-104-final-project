// playwright.config.ts
import {PlaywrightTestConfig} from "@playwright/test";

const config: PlaywrightTestConfig = {
    // Look for test files in the "tests" directory, relative to this
    // configuration file
    testDir: "e2e",
    // Each test is given 30 seconds
    timeout: 30000,

    // Forbid test.only on CI
    forbidOnly: !!process.env.CI,

    // Two retries for each test
    retries: 0,

    // Limit the number of workers on CI, use default locally
    workers: process.env.CI ? 2 : undefined,

    use: {
        baseURL: 'http://localhost:3000/',
        storageState: './e2e/storage.json',
        // trace: "on",
        // video: "on",
        // screenshot: "on"
        // Configure browser and context here
    },
    webServer: {
        command: `yarn start`,
        port: 3000,
        reuseExistingServer: !process.env.CI,
    },
    projects: [
        {
            name: "Chrome Stable",
            use: {
                browserName: "chromium",
                // Test against Chrome Stable channel.
                channel: "chrome",
            },
        },
    ],
};
export default config;
