/// <reference path="../../Babylon.js/packages/tools/babylonServer/declarations/core.d.ts" />

import type { Test as TestClass } from "./test-tools/evaluatedAudioTestUtils";

declare global {
    const Test: typeof TestClass;

    interface Window {
        BABYLON: typeof BABYLON;
    }
}
