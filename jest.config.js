const testFiles = ["scratch"].join("|");
const esModules = [].join("|");

module.exports = {
    testMatch: [
        // `src/(?!${testFiles})/**/__tests__/**/*.test.[jt]s?(x)`,
        `**/__tests__/**/*.test.ts`,
    ],

    modulePathIgnorePatterns: [".tmp", "out"],
    transformIgnorePatterns: [
        `/node_modules/(?!${esModules})`,
        "\\.pnp\\.[^\\/]+$",
    ],
    collectCoverageFrom: [
        // "!src/**/*.test.ts?(x)",
        "!src/**/*.e2e.ts?(x)",
        "!src/**/*.mock.ts?(x)",
        "!src/**/webpack.config.ts?(x)",
        "!src/**/__datashots__/**",
        "!src/**/out/**",
        "!src/**/__mocks__/**",
        "src/**/*.ts?(x)",
    ],
    testEnvironment: "jsdom",
};
