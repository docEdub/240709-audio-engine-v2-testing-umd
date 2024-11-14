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

test("Create sound with `loop` set to true", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 6, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { loop: true });

        sound.play();
        await Test.Delay(4.2);
        sound.stop();

        debugger;
        return await Test.Results(sound);
    });
    expect(result).toEqual(["0120"]);
});

test("Create sound with pitch set to 200", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { pitch: 200 });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with playbackRate set to 1.2", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { playbackRate: 1.2 });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with playbackRate set to 1.05 and pitch set to 200", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { playbackRate: 1.05, pitch: 200 });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with playbackRate set to 1.5 and preservesPitch set to true", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { playbackRate: 1.5, preservesPitch: true });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Play two sounds, with the second sound's play waitTime set to 3", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 6, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound1 = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        sound1.play();
        sound1.play(3);

        return await Test.Results(sound1);
    });
    expect(result).toEqual(["012012"]);
});
test("Play sound with startOffset set to 1.0", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        sound.play(null, 1);

        return await Test.Results(sound);
    });
    expect(result).toEqual(["12"]);
});

test("Play sound and call stop with waitTime set to 2", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        await sound.play();
        sound.stop(2);

        return await Test.Results(sound);
    });
    expect(result).toEqual(["01"]);
});

test("Create sound with sources set to ogg and mp3 files", async ({ browserName }) => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound([Test.OggUrl, Test.Mp3Url]);

        sound.play();

        return await Test.Results(sound);
    });

    // Webkit doesn't support .ogg files, so the .mp3 file 2nd in the list should play.
    if (browserName === "webkit") {
        expect(result).toEqual(["mp3"]);
    } else {
        // Everything else should support .ogg files, so the .ogg file 1st in the list should play.
        expect(result).toEqual(["ohgeegee"]);
    }
});

test("Create sound with source set to HTMLMediaElement", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const audio = new Audio(Test.ThreeCountMp3Url);
        const sound = await Test.CreateStreamingSound(audio);

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Play sound, pause it, and resume it", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 4, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        await sound.play();
        await Test.Delay(1);
        sound.pause();
        await Test.Delay(0.5);
        sound.resume();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Play sound, pause it, and resume it by calling play", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 4, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

        await sound.play();
        await Test.Delay(1);
        sound.pause();
        await Test.Delay(0.5);
        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with `maxInstances` set to 1", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 6, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { maxInstances: 1 });

        await sound.play();
        await Test.Delay(1);
        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["0012"]);
});

test("Create sound with `maxInstances` set to 2", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 6, ...Test.CommonStreamingTestOptions });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url, { maxInstances: 2 });

        await sound.play();
        await Test.Delay(0.5);
        await sound.play();
        await Test.Delay(1.5);
        sound.play();

        return await Test.Results(sound);
    });

    // Speech output for each instance:
    //          Instance 1: "0 1    "
    //          Instance 2: " 0 1 2 "
    //          Instance 3: "    0 12"
    expect(result).toEqual(["00110212"]);
});
