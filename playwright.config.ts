import { defineConfig, Project } from "@playwright/test";

import { populateEnvironment } from "./src/test-tools/audioTestUtils";
populateEnvironment();

const args = process.env.PLAYWRIGHT_ARGS ? process.env.PLAYWRIGHT_ARGS.split(" ") : [];

// prettier-ignore
const browsers = [
    "chromium",
    "webkit"
];

const projects: Project[] = [];

for (const browser of browsers) {
    projects.push({
        name: browser,
        testDir: "./src/tests",
        testMatch: "**/*.test.ts",

        fullyParallel: true,
        use: {
            browserName: browser,
            ignoreHTTPSErrors: true,
            launchOptions: {
                args,
            },
        },
    });
}

export default defineConfig({
    projects: projects,
    reporter: [["list"]],
    workers: 9,
});
