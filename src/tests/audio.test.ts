import * as fs from "fs";
import * as path from "path";

import { Page, test } from "@playwright/test";
import "babylonjs";
import type { Test as TestClass } from "../test-tools/evaluatedAudioTestUtils";

import StaticSoundTests from "./staticSoundTests";

declare global {
    const Test: typeof TestClass;

    interface Global {
        page: Page;
    }
}

const evaluatePlaywrightAudioTests = async (engineType = "webaudio", testFileName = "config", debug = false, debugWait = false, logToConsole = true, logToFile = false) => {
    debug = process.env.DEBUG === "true" || debug;

    if (process.env.TEST_FILENAME) {
        testFileName = process.env.TEST_FILENAME;
    }

    if (process.env.LOG_TO_CONSOLE) {
        logToConsole = process.env.LOG_TO_CONSOLE === "true";
    }

    const logPath = path.resolve(__dirname, `${testFileName}_${engineType}_log.txt`);

    function log(msg: any, title?: string) {
        const titleToLog = title ? `[${title}]` : "";
        if (logToConsole) {
            if (msg.type === "error") {
                console.error(titleToLog, msg);
            } else {
                console.log(titleToLog, msg);
            }
        }
        if (logToFile) {
            fs.appendFileSync(logPath, titleToLog + " " + msg + "\n", "utf8");
        }
    }

    test.beforeAll(async ({ browser }) => {
        const page = await browser.newPage();

        await page.goto(`https://localhost`, {
            // waitUntil: "load", // for chrome should be "networkidle0"
            timeout: 0,
        });

        await page.evaluate(async () => {
            Test.BeforeAll();
        });

        await page.waitForFunction(() => {
            return window.BABYLON !== undefined;
        });

        page.setDefaultTimeout(0);

        global.page = page;
    });

    test.afterAll(async () => {
        await global.page.close();
    });

    test.beforeEach(async () => {
        global.page.on("console", log);
    });

    test.afterEach(async () => {
        await global.page.evaluate(() => {
            Test.AfterEach();
        });
        global.page.off("console", log);
    });

    test.setTimeout(0);

    StaticSoundTests();
};

evaluatePlaywrightAudioTests();
