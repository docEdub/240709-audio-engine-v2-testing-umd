/* eslint-disable no-console */
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

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
