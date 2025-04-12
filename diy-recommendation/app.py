import gradio as gr
from transformers import pipeline

DIY_MODEL = "merelevy/diy-recommendation2"
pipe = pipeline("image-classification", model=DIY_MODEL)

def classify(img):
  res = pipe(img)
  return res
  label = res[0]["label"]
  score = res[0]["score"]
  return f"{label}, {score}"

demo = gr.Interface(fn=classify, inputs=gr.Image(type="pil"), outputs="json")
demo.launch()
