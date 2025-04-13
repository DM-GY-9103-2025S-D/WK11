let winkPosTagger;

async function preload() {
  try {
    const module = await import(
      "https://cdn.jsdelivr.net/npm/wink-pos-tagger@2.2.2/+esm"
    );
    winkPosTagger = module.default();
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

let pInput;
let pOutput;

let lastInput;
let lastTagged;
function setup() {
  mCanvas = createCanvas(windowWidth, windowHeight);
  textSize(20);

  pInput = createInput("");
  pInput.position(10, 10);
  pInput.size(width/2, 20);

  pOutput = "";

  lastInput = "";
  lastTagged = millis();
}

function draw() {
  background(220);
  text(pOutput, 10, 60);

  let currentInput = pInput.value();
  if (currentInput != lastInput && millis() - lastTagged > 200) {
    pos(currentInput);
    lastTagged = millis();
  }

  lastInput = pInput.value();
}

const nTags = ["NN", "NNS", "NNP", "NNPS"];
function pos(sentence) {
  const tagged = winkPosTagger.tagSentence(sentence);
  const nouns = tagged.filter((x) => nTags.includes(x.pos)).map((x) => x.value);
  pOutput = `${nouns}`;
}
