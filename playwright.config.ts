import { defineConfig } from "@playwright/test";

export default defineConfig({
    projects: [
        {
            name: "audio",
            testDir: "./src/tests",
            testMatch: "**/audio.test.ts",

            fullyParallel: true,
            retries: 0,
            use: {
                ignoreHTTPSErrors: true,
                launchOptions: {
                    args: ["--auto-open-devtools-for-tabs"],
                },
            },
        },
    ],
    reporter: [["list"]],
    workers: 9,
});
