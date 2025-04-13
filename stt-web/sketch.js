let mMic, mRecorder, mRecSound;
let isRecording;

let micButt;

let transformers;
let pipe;

async function preload() {
  try {
    transformers = await import("https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2");
    pipe = await transformers.pipeline("automatic-speech-recognition", "Xenova/whisper-tiny.en", {dtype: "q8"});
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

let mCanvas;
let mCaption = "";
function setup() {
  mCanvas = createCanvas(windowWidth, windowHeight);

  mMic = new p5.AudioIn();
  mRecSound = new p5.SoundFile();
  mRecorder = new p5.SoundRecorder();
  isRecording = false;

  micButt = createButton("Enable Microphone");
  micButt.position(20, 20);
  micButt.mousePressed(enableMic);

  mCaption = "";
  textSize(20);
}

function draw() {
  if (mMic.enabled && !isRecording) {
    background(180, 220, 240);
  } else if (isRecording) {
    background(255, 200, 200);
  } else {
    background(220);
  }

  text(mCaption, 10, 40, width - 20, 100);
}

async function captionAudio() {
  let samples16k = await resample(mRecSound.buffer.getChannelData(0), mRecSound.buffer.sampleRate, 16_000);
  let sttRes = await pipe(samples16k);
  mCaption = sttRes.text; 
}

function enableMic() {
  console.log("Enabling mic");

  if (!mMic.enabled) {
    mMic.start();
    mRecorder.setInput(mMic);
    userStartAudio();
    micButt.hide();
  }
}

function keyPressed() {
  console.log("key pressed");
  
  if (key == " ") {
    if (!isRecording && mMic.enabled) {
      console.log("recording started");
      mRecorder.record(mRecSound, 100, captionAudio);
      isRecording = true;
    } else if (isRecording) {
      console.log("recording stopped");
      mRecorder.stop();
      isRecording = false;
    }
  }
}
