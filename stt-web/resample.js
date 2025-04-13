async function resample(audioData, originalSampleRate, targetSampleRate) {
  const audioContext = new OfflineAudioContext({
    numberOfChannels: 1,
    length: audioData.length * (targetSampleRate / originalSampleRate),
    sampleRate: targetSampleRate,
  });

  const audioBuffer = audioContext.createBuffer(
    1,
    audioData.length,
    originalSampleRate
  );

  const channelData = audioBuffer.getChannelData(0);
  channelData.set(audioData);

  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();

  const resampledBuffer = await audioContext.startRendering();
  return resampledBuffer.getChannelData(0);
}
