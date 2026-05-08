import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google import genai
from dotenv import load_dotenv
from typing import Dict, Any 

from api.pdf_reader import extraer_texto_pdf
from api.prompts import obtener_system_prompt

load_dotenv(".env") 
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_ID = "gemini-2.5-flash"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    # CRÍTICO: expone el header que AI SDK v5 usa para detectar el protocolo
    expose_headers=["x-vercel-ai-ui-message-stream"],
)

TEXTO_PDF = extraer_texto_pdf("data/Base_Datos_Seguros_Completa2.pdf")
SYSTEM_PROMPT = obtener_system_prompt(TEXTO_PDF)

@app.post("/api/chat")
async def handle_chat_data(payload: Dict[str, Any]): 
    messages = payload.get("messages", [])
    if not messages:
        return {"error": "No hay mensajes"}
        
    last_message = messages[-1]
    
    # Soporte para el nuevo formato Multimodal ('parts')
    if "parts" in last_message and len(last_message["parts"]) > 0:
        user_message = last_message["parts"][0].get("text", "")
    else:
        user_message = last_message.get("content", "")
    
    prompt_completo = f"{SYSTEM_PROMPT}\n\nPaciente: {user_message}"
    
    response = client.models.generate_content_stream(
        model=MODEL_ID,
        contents=prompt_completo,
    )
    
    import uuid
    message_id = str(uuid.uuid4())
    text_part_id = str(uuid.uuid4())

    def sse(obj: dict) -> str:
        """Formatea un objeto como evento SSE: 'data: {json}\n\n'"""
        return f"data: {json.dumps(obj)}\n\n"

    def stream_generator():
        # 1. Inicio del mensaje asistente
        yield sse({"type": "start", "messageId": message_id})
        # 2. Inicio de paso
        yield sse({"type": "start-step"})
        # 3. Inicio de la parte de texto
        yield sse({"type": "text-start", "id": text_part_id})

        # 4. Deltas de texto (los chunks de Gemini)
        for chunk in response:
            text = chunk.text
            if text:
                yield sse({"type": "text-delta", "id": text_part_id, "delta": text})

        # 5. Fin de la parte de texto
        yield sse({"type": "text-end", "id": text_part_id})
        # 6. Fin de paso
        yield sse({"type": "finish-step"})
        # 7. Fin del stream — CRÍTICO para que useChat salga de 'streaming'
        yield sse({"type": "finish", "finishReason": "stop"})

    return StreamingResponse(
        stream_generator(),
        media_type="text/event-stream",
        headers={
            # Header que AI SDK v5 busca para activar el parser correcto
            "x-vercel-ai-ui-message-stream": "v1",
            "cache-control": "no-cache",
            "connection": "keep-alive",
            "x-accel-buffering": "no",
            "X-Content-Type-Options": "nosniff",
        }
    )