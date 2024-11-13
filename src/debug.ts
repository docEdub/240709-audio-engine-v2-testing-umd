(async () => {
    await Test.CreateAudioEngine();
    const sound = await Test.CreateSound(Test.ThreeCountMp3Url, { autoplay: true });
})();
