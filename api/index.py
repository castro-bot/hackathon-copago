import os
import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google import genai
from google.genai import types
from dotenv import load_dotenv
from typing import Dict, Any

from api.prompts import obtener_system_prompt

load_dotenv(".env")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_ID = "gemini-3-flash-preview"

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

SYSTEM_PROMPT = obtener_system_prompt()

@app.post("/api/chat")
async def handle_chat_data(payload: Dict[str, Any]):
    messages = payload.get("messages", [])
    if not messages:
        return {"error": "No hay mensajes"}

    conversation_history = ""
    for msg in messages:
        role = msg.get("role", "user")
        
        # Soporte para el nuevo formato Multimodal ('parts')
        if "parts" in msg and len(msg["parts"]) > 0:
            content = msg["parts"][0].get("text", "")
        else:
            content = msg.get("content", "")
            
        if role == "user":
            conversation_history += f"Paciente: {content}\n"
        elif role == "assistant":
            conversation_history += f"Asesor: {content}\n"

    prompt_completo = f"{SYSTEM_PROMPT}\n\nHistorial de la conversación:\n{conversation_history}\nResponde como el Asesor a la última entrada del Paciente."

    store_name = os.getenv("FILE_SEARCH_STORE_NAME")
    if store_name:
        store_name = store_name.strip("'").strip('"')
    if not store_name:
        return {"error": "No se encontró FILE_SEARCH_STORE_NAME en .env. Por favor ejecuta 'python setup_rag.py' primero."}

    response = client.models.generate_content_stream(
        model=MODEL_ID,
        contents=prompt_completo,
        config=types.GenerateContentConfig(
            tools=[
                types.Tool(
                    file_search=types.FileSearch(
                        file_search_store_names=[store_name],
                        metadata_filter='type = "insurance"'
                    )
                )
            ]
        )
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

        try:
            # 4. Deltas de texto (los chunks de Gemini)
            for chunk in response:
                text = chunk.text
                if text:
                    yield sse({"type": "text-delta", "id": text_part_id, "delta": text})
        except Exception as e:
            # Si Gemini lanza un error, enviarlo a la UI en lugar de colgarse
            yield sse({"type": "text-delta", "id": text_part_id, "delta": f"\n\n⚠️ Error del API de Gemini: {str(e)}"})

        # 5. Fin de la parte de texto
        yield sse({"type": "text-end", "id": text_part_id})
        # 6. Fin de paso
        yield sse({"type": "finish-step"})
        # 7. Fin del stream — CRÍTICO para que useChat salga de 'streaming'
        yield sse({"type": "finish"})
        yield "data: [DONE]\n\n"

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