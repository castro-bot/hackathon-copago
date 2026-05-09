import os
import json
import logging
import traceback
import re
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from google import genai
from google.genai import types
from dotenv import load_dotenv
from typing import Dict, Any

from api.prompts import obtener_system_prompt

# Configurar logging para ver errores en consola
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv(".env")
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_ID = "gemini-3.1-flash-lite"

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

    # Extraer la póliza seleccionada por el usuario desde el frontend
    selected_policy = payload.get("selectedPolicy", None)
    if not selected_policy and "data" in payload and isinstance(payload["data"], dict):
        selected_policy = payload["data"].get("selectedPolicy", None)
    
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

    # Inyectar la póliza seleccionada como contexto para que Gemini no pregunte
    policy_context = ""
    if selected_policy:
        policy_context = f"\n\n[INFORMACIÓN DEL SISTEMA] El paciente ya seleccionó su póliza de seguro: '{selected_policy}'. NO le preguntes qué seguro tiene, ya lo sabemos. Usa esta póliza para todos los cálculos de copago.\n"
        logger.info(f"Póliza seleccionada por el usuario: {selected_policy}")

    prompt_completo = f"{SYSTEM_PROMPT}{policy_context}\n\nHistorial de la conversación:\n{conversation_history}\nResponde como el Asesor a la última entrada del Paciente."

    store_name = os.getenv("FILE_SEARCH_STORE_NAME")
    if store_name:
        store_name = store_name.strip("'").strip('"')

    # Construir config con o sin File Search
    tools_config = []
    if store_name:
        logger.info(f"Usando File Search Store: {store_name}")
        tools_config = [
            types.Tool(
                file_search=types.FileSearch(
                    file_search_store_names=[store_name],
                )
            )
        ]
    else:
        logger.warning("FILE_SEARCH_STORE_NAME no encontrado, generando sin RAG")

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
            logger.info(f"Llamando a Gemini ({MODEL_ID}) con prompt de {len(prompt_completo)} chars...")

            config_kwargs = {}
            if tools_config:
                config_kwargs["tools"] = tools_config

            response = client.models.generate_content_stream(
                model=MODEL_ID,
                contents=prompt_completo,
                config=types.GenerateContentConfig(**config_kwargs) if config_kwargs else None,
            )

            logger.info("Stream de Gemini iniciado, procesando chunks...")
            chunk_count = 0

            # 4. Deltas de texto (los chunks de Gemini)
            for chunk in response:
                chunk_count += 1
                text = chunk.text
                if text:
                    text = re.sub(r'\[\d+(?:\.\d+)?\]', '', text)
                    yield sse({"type": "text-delta", "id": text_part_id, "delta": text})

            logger.info(f"Stream completado: {chunk_count} chunks recibidos")

        except Exception as e:
            error_msg = f"{type(e).__name__}: {str(e)}"
            logger.error(f"Error en Gemini API: {error_msg}")
            logger.error(traceback.format_exc())
            # Si Gemini lanza un error, enviarlo a la UI en lugar de colgarse
            yield sse({"type": "text-delta", "id": text_part_id, "delta": "\n\n⚠️ Lo siento, ocurrió un error al procesar su consulta. Por favor, intente de nuevo más tarde."})

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