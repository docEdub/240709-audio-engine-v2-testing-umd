import { expect, Page, test, TestInfo } from "@playwright/test";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";

export function populateEnvironment() {
    dotenv.config({ path: path.resolve(findRootDirectory(), "./.env") });
}

export function findRootDirectory(): string {
    let localPackageJSON = { name: "" };
    let basePath: string = process.cwd();
    let currentRoot = basePath;
    do {
        try {
            localPackageJSON = JSON.parse(fs.readFileSync(path.join(basePath, "./package.json")).toString());
        } catch (e) {}
        currentRoot = basePath;
        // console.log(localPackageJSON);
        basePath = path.resolve(basePath, "..");
        // process.chdir("..");
        if (basePath === currentRoot) {
            throw new Error("Could not find the root package.json");
        }
    } while (localPackageJSON.name !== "@babylonjs-audio-testing/root");
    return path.resolve(currentRoot);
}

export const initPlaywrightAudioTests = async (
    setPageCallback: (page: Page) => void,
    engineType = "webaudio",
    testFileName = "config",
    debug = false,
    debugWait = false,
    logToConsole = true,
    logToFile = false
) => {
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

    let page: Page;

    test.beforeAll(async ({ browser }) => {
        page = await browser.newPage();

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

        setPageCallback(page);
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.beforeEach(async () => {
        page.on("console", log);
    });

    test.afterEach(async () => {
        await page.evaluate(() => {
            Test.AfterEach();
        });
        page.off("console", log);
    });

    test.setTimeout(0);
};
