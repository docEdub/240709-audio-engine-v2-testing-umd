import { expect, Page, test } from "@playwright/test";
import { initPlaywrightAudioTests } from "../test-tools/audioTestUtils";

let page: Page;

initPlaywrightAudioTests((newPage) => {
    page = newPage;
});

test("Create sound with `autoplay` option set 1", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with `autoplay` and `duration` options set", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 2 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true, duration: 2 });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["01"]);
});

test("Create sound and call `play` on it using `await`", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound and call `play` on it using `then`", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();

        return new Promise<string[]>((resolve) => {
            Test.CreateSound(Test.ThreeCountMp3Url).then(async (sound) => {
                sound.play();
                resolve(await Test.Results(sound));
            });
        });
    });
    expect(result).toEqual(["012"]);
});

test("Create sound and call `play` on it twice", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 4 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound.play();
        Test.CallAt(0.5, () => {
            sound.play();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["001122"]);
});

test("Create sound, call `play` on it twice, and call `stop` on it", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 2 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound.play();
        Test.CallAt(0.5, () => {
            sound.play();
        });
        Test.CallAt(1.2, () => {
            sound.stop();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["00"]);
});

test("Create sound with `loop` option set to true", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 6 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { loop: true });

        sound.play();
        Test.CallAt(4.2, () => {
            sound.stop();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["0120"]);
});

test("Create sound with `loopStart` and `loopEnd` options set", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 5 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { loop: true, loopStart: 1, loopEnd: 2 });

        sound.play();
        Test.CallAt(3.2, () => {
            sound.stop();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["011"]);
});

test("Create sound with `pitch` option set to 200", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { pitch: 200 });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with `playbackRate` option set to 1.2", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { playbackRate: 1.2 });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with `playbackRate` option set to 1.05 and `pitch` option set to 200", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { playbackRate: 1.05, pitch: 200 });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with `startOffset` option set to 1", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { startOffset: 1 });

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["12"]);
});

test("Play two sounds, with the second sound's `waitTime` parameter set to 3", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 6 });

        await Test.CreateAudioEngine();
        const sound1 = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound1.play();
        sound1.play(3);

        return await Test.Results(sound1);
    });
    expect(result).toEqual(["012012"]);
});

test("Play sound with `startOffset` parameter set to 1", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        debugger;
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { startOffset: 1 });

        sound.play(0, 1);

        return await Test.Results(sound);
    });
    expect(result).toEqual(["12"]);
});

test("Create sound with `startOffset` option set to 5 and call `play` on it with `startOffset` parameter set to 1", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 2 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.SixtyCountMp3Url, { startOffset: 5 });

        sound.play(0, 1);
        await Test.CallAt(2, () => {
            sound.stop();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["12"]);
});

test("Create sound with `startOffset` option set to 1 and call `play` on it with `startOffset` parameter set to 5", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 2 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.SixtyCountMp3Url, { startOffset: 1 });

        sound.play(0, 5);
        await Test.CallAt(2, () => {
            sound.stop();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["56"]);
});

test("Play sound with `duration` parameter set to 2.2", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound.play(null, null, 2.2);

        return await Test.Results(sound);
    });
    expect(result).toEqual(["01"]);
});

test("Play sound and call `stop` with `waitTime` parameter set to 2", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound.play();
        sound.stop(2);

        return await Test.Results(sound);
    });
    expect(result).toEqual(["01"]);
});

test("Create sound with sourceBuffer set", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const buffer = await Test.CreateSoundBuffer(Test.ThreeCountMp3Url);
        const sound = await Test.CreateSound(buffer);

        sound.play();

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create 2 sounds using same buffer and play them 500 ms apart", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 4 });

        await Test.CreateAudioEngine();
        const sound1 = await Test.CreateSound(Test.ThreeCountMp3Url);
        const sound2 = await Test.CreateSound(sound1.buffer);

        sound1.play();
        Test.CallAt(0.5, () => {
            sound2.play();
        });

        return await Test.Results(sound1);
    });
    expect(result).toEqual(["001122"]);
});

test("Create sound with sources set to ac3 and mp3 files", async ({ browserName }) => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 3 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound([Test.OggUrl, Test.Mp3Url]);

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

test("Create sound with source array set to ac3 and mp3 files, with skipCodecCheck set to true", async ({ browserName }) => {
    const result = await page.evaluate(
        async ({ browserName }) => {
            Test.Setup({ duration: 3 });

            await Test.CreateAudioEngine();

            try {
                await Test.CreateSound([browserName === "webkit" ? Test.OggUrl : Test.Ac3Url, Test.Mp3Url], { skipCodecCheck: true });
            } catch (e) {
                return true;
            }

            return false;
        },
        { browserName }
    );
    expect(result).toEqual(true);
});

test("Play sound, pause it, and resume it", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 4 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound.play();
        Test.CallAt(1, () => {
            sound.pause();
        });
        Test.CallAt(1.5, () => {
            sound.resume();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Play sound, pause it, and resume it by calling play", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 4 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url);

        sound.play();
        Test.CallAt(1, () => {
            sound.pause();
        });
        Test.CallAt(1.5, () => {
            sound.play();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["012"]);
});

test("Create sound with `maxInstances` set to 1", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 5 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { maxInstances: 1 });

        sound.play();
        Test.CallAt(1, () => {
            sound.play();
        });

        return await Test.Results(sound);
    });
    expect(result).toEqual(["0012"]);
});

test("Create sound with `maxInstances` set to 2", async () => {
    const result = await page.evaluate(async () => {
        Test.Setup({ duration: 6 });

        await Test.CreateAudioEngine();
        const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { maxInstances: 2 });

        sound.play();
        Test.CallAt(0.5, () => {
            sound.play();
        });
        Test.CallAt(2, () => {
            sound.play();
        });

        return await Test.Results(sound);
    });

    // Speech output for each instance:
    //          Instance 1: "0 1    "
    //          Instance 2: " 0 1 2 "
    //          Instance 3: "    0 12"
    expect(result).toEqual(["00110212"]);
});
