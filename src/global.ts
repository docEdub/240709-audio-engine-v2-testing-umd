import type { Test as TestClass } from "./test-tools/evaluatedAudioTestUtils";

declare global {
    const Test: typeof TestClass;
}
