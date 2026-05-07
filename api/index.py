import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import google.generativeai as genai
from dotenv import load_dotenv

# Importamos nuestros nuevos módulos
from api.pdf_reader import extraer_texto_pdf
from api.prompts import obtener_system_prompt

load_dotenv(".env") 
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ClientMessage(BaseModel):
    role: str
    content: str

class Request(BaseModel):
    messages: list[ClientMessage]

TEXTO_PDF = extraer_texto_pdf("data/Base_Datos_Seguros_Completa.pdf")

SYSTEM_PROMPT = obtener_system_prompt(TEXTO_PDF)

@app.post("/api/chat")
async def handle_chat_data(request: Request):
    user_message = request.messages[-1].content
    prompt_completo = f"{SYSTEM_PROMPT}\n\nMensaje del paciente: {user_message}"
    
    response = model.generate_content(prompt_completo, stream=True)
    
    def stream_generator():
        for chunk in response:
            if chunk.text:
                clean_text = chunk.text.replace('\n', '\\n').replace('"', '\\"')
                yield f'0:"{clean_text}"\n'

    return StreamingResponse(stream_generator(), media_type="text/plain")