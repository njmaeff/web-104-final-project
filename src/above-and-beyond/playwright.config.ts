// playwright.config.ts
import { PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
    // Look for test files in the "tests" directory, relative to this
    // configuration file
    testDir: "e2e",
    globalSetup: require.resolve("./playwright-setup"),
    // Each test is given 30 seconds
    timeout: 30000,

    // Forbid test.only on CI
    forbidOnly: !!process.env.CI,

    // Two retries for each test
    retries: 0,

    // Limit the number of workers on CI, use default locally
    workers: process.env.CI ? 2 : undefined,

    use: {
        // trace: "on",
        // video: "on",
        // screenshot: "on"
        // Configure browser and context here
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
        // {
        //   name: 'Desktop Safari',
        //   use: {
        //     browserName: 'webkit',
        //     viewport: { width: 1200, height: 750 },
        //   }
        // },
        // // Test against mobile viewports.
        // {
        //   name: 'Mobile Chrome',
        //   use: devices['Pixel 5'],
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: devices['iPhone 12'],
        // },
        // {
        //   name: 'Desktop Firefox',
        //   use: {
        //     browserName: 'firefox',
        //     viewport: { width: 800, height: 600 },
        //   }
        // },
    ],
};
export default config;
