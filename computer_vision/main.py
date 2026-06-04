import io
import torch
import uvicorn
import warnings
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, HTTPException
from transformers import AutoImageProcessor, AutoModelForImageClassification

def word_formatter(name: str) -> str:
    ''' Função para formatar o resultado do nome'''
    words = name.replace('_', ' ').split()
    
    if len(words) >= 2:
        return f"{words[0].capitalize()} {words[1].lower()}"
    elif len(words) == 1:
        return words[0].capitalize()
        
    return "Planta Desconhecida"

# ignorar avisos
warnings.filterwarnings("ignore")

app = FastAPI(title="API de detecção")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# modelo FloraSense (ONNX) disponível em https://huggingface.co/onnx-community/FloraSense-ONNX
processor = AutoImageProcessor.from_pretrained("Sisigoks/FloraSense")
model = AutoModelForImageClassification.from_pretrained("Sisigoks/FloraSense")

@app.post("/identify")
async def identify_plant(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Arquivo inválido. Por favor, envie uma imagem.")

    try:
        # esperar e receber a imagem
        content = await file.read()
        image = Image.open(io.BytesIO(content)).convert('RGB')
        
        # passos dados para utilizar o modelo
        inputs = processor(images=image, return_tensors="pt")
        
        with torch.no_grad():
            outputs = model(**inputs)
            logits = outputs.logits
            
        probabilities = torch.nn.functional.softmax(logits, dim=-1)[0]
        
        top3_prob, top3_indices = torch.topk(probabilities, 3)
        
        predictions = []
        for i in range(3):
            class_id = top3_indices[i].item()
            confidence = top3_prob[i].item()
            
            name = model.config.id2label[class_id]
            name_formatted = word_formatter(name)
            
            predictions.append({
                "specie": name_formatted,
                "confidence": confidence
            })

        return {
            "status": "success",
            "predictions": predictions
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao processar a imagem: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)