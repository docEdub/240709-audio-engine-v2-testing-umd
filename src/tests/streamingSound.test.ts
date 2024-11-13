import { expect, Page, test } from "@playwright/test";
import { initPlaywrightAudioTests } from "../test-tools/audioTestUtils";

let page: Page;

initPlaywrightAudioTests((newPage) => {
    page = newPage;
});

test("Create sound with `autoplay` option set 1", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { autoplay: true });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound and call `play` on it using `await`", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        await sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound and call `play` on it using `then`", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();

        return new Promise<string[]>((resolve) => {
            Test.CreateStreamingSound(Test.ThreeCountMp3Url).then(async (sound) => {
                sound.play();
                resolve(await Test.Results(sound));
            });
        });
    });
    expect(result).toEqual(["012"]);
});

test("Create sound and call `play` on it twice", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 4, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        await sound.play();
        await Test.Delay(0.5);
        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["001122"]);
});

test("Create sound, call `play` on it twice, and call `stop` on it", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 2, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        await sound.play();
        await Test.Delay(0.5);
        await sound.play();
        await Test.Delay(0.75);
        sound.stop();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["00"]);
});
