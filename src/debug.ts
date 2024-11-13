(async () => {
    await Test.CreateAudioEngine();
    const sound = await Test.CreateStreamingSound(Test.ThreeCountMp3Url);

    await sound.play();
    await Test.Delay(0.5);
    await sound.play();
    await Test.Delay(0.75);
    sound.stop();
})();
