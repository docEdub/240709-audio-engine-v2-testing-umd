import { expect, test } from "@playwright/test";

export default () => {
    test("Create sound with `autoplay` option set 1", async ({}, testInfo) => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
    test("Create sound with `autoplay` option set 2", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.Mp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["mp3"]);
    });
    test("Create sound with `autoplay` option set 3", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
    test("Create sound with `autoplay` option set 4", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
    test("Create sound with `autoplay` option set 5", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
    test("Create sound with `autoplay` option set 6", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
    test("Create sound with `autoplay` option set 7", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
    test("Create sound with `autoplay` option set 8", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
    test("Create sound with `autoplay` option set 9", async () => {
        const result = await global.page.evaluate(async () => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();
            const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

            return await Test.Results(sound);
        });
        expect(result).toEqual(["012"]);
    });
};
