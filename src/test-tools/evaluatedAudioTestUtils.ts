declare global {
    const Whisper: any;
}

const ForceRealtimeAudioContext = true;
const SilenceRealtimeAudioOutput = true;

export interface ITestOptions {
    channels?: number;
    duration: number;
    requiresRealtimeAudioContext?: boolean;
}

export class Test {
    static readonly SoundUrlPrefix = "https://amf-ms.github.io/AudioAssets/testing/";

    static readonly Ac3Url = Test.SoundUrlPrefix + "ac3.ac3";
    static readonly Mp3Url = Test.SoundUrlPrefix + "mp3-enunciated.mp3";
    static readonly OggUrl = Test.SoundUrlPrefix + "ogg-enunciated.ogg";
    static readonly ThreeCountMp3Url = Test.SoundUrlPrefix + "3-count.mp3";

    static readonly OfflineSampleRate: number = 16000;

    static audioContext: AudioContext | OfflineAudioContext | null;
    static audioEngine: BABYLON.AbstractAudioEngine | null = null;

    static recorderDestination: MediaStreamAudioDestinationNode | null = null;
    static recorder: MediaRecorder | null = null;

    static whisper: any = null;

    static capturedAudio: Array<Float32Array> = [];
    static capturedText: Array<string> = [];
    static duration: number = 0;

    static async BeforeAll(): Promise<void> {
        if (Test.whisper === null) {
            console.log("Initializing whisper...");
            Test.whisper = new Whisper();
            await Test.whisper.init();
        }
    }

    static async AfterEach() {
        if (Test.audioContext instanceof AudioContext) {
            Test.audioContext?.close();
        }
        Test.audioContext = null;

        Test.audioEngine?.dispose();
        Test.audioEngine = null;

        Test.capturedAudio.length = 0;
        Test.capturedText.length = 0;

        Test.recorderDestination = null;
        Test.recorder = null;
    }

    static Setup(options: ITestOptions): void {
        Test.duration = options.duration;
        Test.audioContext =
            options.requiresRealtimeAudioContext || ForceRealtimeAudioContext
                ? new AudioContext()
                : new OfflineAudioContext(options.channels ?? 1, options.duration * Test.OfflineSampleRate, Test.OfflineSampleRate);
    }

    static InitRealtimeAudioCapture(audioContext: AudioContext) {
        if (!(audioContext instanceof AudioContext)) {
            return;
        }

        Test.recorderDestination = new MediaStreamAudioDestinationNode(audioContext);
        Test.recorder = new MediaRecorder(Test.recorderDestination.stream);

        const webAudioEngine = Test.audioEngine as BABYLON.WebAudioEngine;
        const webAudioMainOutput = webAudioEngine.mainOutput as BABYLON.WebAudioMainOutput;
        const nodeToCapture = webAudioMainOutput.webAudioInputNode;

        nodeToCapture.connect(Test.recorderDestination);

        if (SilenceRealtimeAudioOutput) {
            nodeToCapture.disconnect(audioContext.destination);
        }

        Test.recorder.start();
    }

    static async CreateAudioEngine(options: BABYLON.IWebAudioEngineOptions | null = null): Promise<BABYLON.AbstractAudioEngine> {
        const audioContext = Test.audioContext;

        if (!options) {
            options = {};
        }
        options.audioContext = audioContext!;

        Test.audioEngine = await BABYLON.CreateAudioEngineAsync(options);

        if (audioContext instanceof AudioContext) {
            Test.InitRealtimeAudioCapture(audioContext);
        }

        return Test.audioEngine;
    }

    static async CreateSound(source: BABYLON.StaticSoundSourceType, options: BABYLON.IStaticSoundOptions | null = null): Promise<BABYLON.StaticSound> {
        return BABYLON.CreateSoundAsync("", source, Test.audioEngine!, options);
    }

    static async CreateSoundBuffer(source: BABYLON.StaticSoundSourceType, options: BABYLON.IStaticSoundOptions | null = null): Promise<BABYLON.StaticSoundBuffer> {
        return BABYLON.CreateSoundBufferAsync(source, Test.audioEngine!, options);
    }

    static async SoundEndedPromise(sound: BABYLON.AbstractSound): Promise<void> {
        const audioContext = Test.audioContext;

        return new Promise<void>((resolve) => {
            if (audioContext instanceof OfflineAudioContext) {
                resolve();
            } else if (audioContext instanceof AudioContext || audioContext === undefined) {
                sound.onEndedObservable.addOnce(() => {
                    resolve();
                });
            }
        });
    }

    static CallAt(time: number, callback: () => void): void {
        if (Test.audioContext instanceof OfflineAudioContext) {
            Test.audioEngine!.pause(time).then(() => {
                callback();
                Test.audioEngine!.resume();
            });
        } else {
            setTimeout(() => {
                callback();
            }, time * 1000);
        }
    }

    static async GetSpeechToTextOutput(channelCount: number): Promise<string[]> {
        // Get captured audio.
        let renderedBuffer: AudioBuffer | null = null;

        if (Test.audioContext instanceof OfflineAudioContext) {
            renderedBuffer = await Test.audioContext.startRendering();
        } else if (Test.audioContext instanceof AudioContext) {
            await new Promise<void>((resolve) => {
                Test.recorder!.addEventListener(
                    "dataavailable",
                    async (event) => {
                        const arrayBuffer = await event.data.arrayBuffer();
                        const audioBuffer = await Test.audioContext!.decodeAudioData(arrayBuffer);

                        // Convert audio buffer to 16kHz sample rate required by whisper.cpp.
                        const offlineAudioContext = new OfflineAudioContext(2, audioBuffer.duration * Test.OfflineSampleRate, Test.OfflineSampleRate);
                        const source = new AudioBufferSourceNode(offlineAudioContext, { buffer: audioBuffer });
                        source.connect(offlineAudioContext.destination);
                        source.start();
                        renderedBuffer = await offlineAudioContext.startRendering();

                        Test.recorderDestination!.disconnect();

                        resolve();
                    },
                    { once: true }
                );
                Test.recorder!.stop();
            });
        }

        if (!renderedBuffer) {
            throw new Error("No buffer rendered.");
        }

        if (renderedBuffer.length === 0) {
            throw new Error("No audio data to transcribe.");
        }

        const capturedText: string[] = [];

        for (let i = 0; i < channelCount; i++) {
            let audio = renderedBuffer.getChannelData(i);

            const paddingSamples = Test.duration * Test.OfflineSampleRate - audio.length;
            if (paddingSamples > 0) {
                const paddedAudio = new Float32Array(audio.length + paddingSamples);
                paddedAudio.set(audio);
                audio = paddedAudio;
            }

            Test.capturedAudio.push(audio);
            Test.whisper.transcribe(audio);

            // Get speech-to-text output.
            let sttOutput = await Test.whisper.getText(60); // ~ 60 seconds timeout.
            // console.log("raw sttOutput:", sttOutput);

            if (sttOutput.length === 0) {
                throw new Error("No speech-to-text output. Try increasing the whisper timeout");
            }

            // Remove the trailing [BLANK_AUDIO] added by whisper.
            sttOutput = sttOutput.replace("[BLANK_AUDIO]", "");

            // Remove spaces.
            sttOutput = sttOutput.replace(/\s+/g, "");

            // Remove punctuation, hyphens and parenthesis added by whisper.
            sttOutput = sttOutput.replace(/(\,|\.|\-|\(|\))/g, "");
            sttOutput = sttOutput.toLowerCase();

            // console.log("sttOutput:", sttOutput);

            // Test.capturedText.push(sttOutput);
            capturedText.push(sttOutput);
        }

        return capturedText;
    }

    static async Results(sound: BABYLON.AbstractSound, channelCount: number = 1): Promise<string[]> {
        await Test.SoundEndedPromise(sound);
        return await Test.GetSpeechToTextOutput(channelCount);
    }
}

(window as any).Test = Test;
