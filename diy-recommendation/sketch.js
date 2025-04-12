const video = document.getElementById('webcam');
const canvas = document.getElementById('snapshot');
const ctx = canvas.getContext('2d');
const captureBtn = document.getElementById('capture-btn');

// Start webcam stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    video.srcObject = stream;
  })
  .catch(err => {
    console.error("Error accessing webcam:", err);
  });

// Hugging Face API
let mClient;
async function connectGradio() {
  try {
    const module = await import("https://cdn.jsdelivr.net/npm/@gradio/client/dist/index.min.js");
    mClient = await module.Client.connect("IDMNYU/9103D-2025S-DIY");
  } catch (error) {
    console.error("Failed to load module:", error);
  }
}

async function sendToModel(imageBlob) {
  if (!mClient) {
    await connectGradio();
  }

  const res = await mClient.predict("/predict", { 
    img: imageBlob, 
  });

  const result = res.data[0];
  console.log("Model output:", result);

  const outputDiv = document.getElementById("prediction-output");
  if (result && result.length > 0) {
    const label = result[0].label;
    const score = (result[0].score * 100).toFixed(2);
    outputDiv.innerText = `Prediction: ${label} (${score}%)`;
  } else {
    outputDiv.innerText = "No prediction returned.";
  }
}


// Capture image on button click
captureBtn.addEventListener('click', () => {
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  console.log("📸 Image captured!");

  // Convert canvas to Blob and send to model
  canvas.toBlob(blob => {
    if (blob) {
      sendToModel(blob);  // Send the image to the model
    } else {
      console.error("Failed to create image blob");
    }
  }, "image/png");
});
