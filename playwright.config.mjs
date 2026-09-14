import {defineConfig} from "@playwright/test";

export default defineConfig({
    testDir: "./tests",
    outputDir: "./test-results/playwright",
    timeout: 60_000,
    expect: {timeout: 8000},
    fullyParallel: false,
    workers: 2,
    retries: 0,
    forbidOnly: !!process.env.CI,
    reporter: [
        ["list"],
        ["html", {outputFolder: "test-results/report", open: "never"}],
        ["junit", {outputFile: "test-results/results.xml"}],
    ],
    projects: [
        {name: "build", testMatch: "**/integration/**/*.spec.mjs", workers: 1},
        {name: "chrome", testMatch: "**/e2e/**/*.spec.mjs", dependencies: ["build"], use: {engine: "chrome"}},
        {name: "firefox", testMatch: "**/e2e/**/*.spec.mjs", dependencies: ["build"], use: {engine: "firefox"}},
    ],
});
