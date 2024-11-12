import { defineConfig } from "@playwright/test";

import { populateEnvironment } from "./src/test-tools/audioTestUtils";
populateEnvironment();

const args = process.env.PLAYWRIGHT_ARGS ? process.env.PLAYWRIGHT_ARGS.split(" ") : [];

export default defineConfig({
    projects: [
        {
            name: "audio",
            testDir: "./src/tests",
            testMatch: "**/*.test.ts",

            fullyParallel: true,
            retries: 0,
            use: {
                ignoreHTTPSErrors: true,
                launchOptions: {
                    args,
                },
            },
        },
    ],
    reporter: [["list"]],
    workers: 9,
});
