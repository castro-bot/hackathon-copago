import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.responses import StreamingResponse
import google.generativeai as genai
from dotenv import load_dotenv

# 1. Cargar variables y configurar Gemini
load_dotenv(".env") # O .env, dependiendo de cómo llamaste a tu archivo
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI()

# 2. Modelos de datos de Vercel
class ClientMessage(BaseModel):
    role: str
    content: str

class Request(BaseModel):
    messages: list[ClientMessage]

# 3. Nuestra Base de Datos Simulada (RAG)
POLIZAS_MOCK = """
BASE DE DATOS DE SEGUROS MÉDICOS Y COPAGOS:
- Seguro "VidaSana": Traumatología $20 (Clínica San Juan), Cardiología $50 (Hospital Central), Medicina General $10 (Clínica San Juan).
- Seguro "SaludTotal": Traumatología $15 (Hospital Santa María), Cardiología $30 (Hospital Santa María), Dermatología $25 (Clínica La Piel).
REGLA DE EMERGENCIA: Riesgo de muerte o infarto = URGENCIAS inmediatas, Copago $0.
"""

# 4. El Prompt Estricto
SYSTEM_PROMPT = f"""
Eres un Asesor de Seguros Médicos automatizado. No eres doctor, no puedes dar diagnósticos, solo estimas copagos y derivas al especialista correcto.
Tienes ESTRICTAMENTE PROHIBIDO inventar hospitales, precios, pólizas o especialidades. Solo puedes usar los datos de la base proporcionada. 
Si el precio dice $20, es $20.
Si el paciente no menciona qué seguro tiene ('VidaSana' o 'SaludTotal'), detén el cálculo y responde ÚNICAMENTE: 'Para poder estimar tu copago y derivarte al hospital correcto, por favor indícame cuál es tu seguro médico.'
Relaciona el síntoma lógicamente (ej. huesos rotos = Traumatología). Si el síntoma es ambiguo o no encaja, recomienda Medicina General.

BASE DE DATOS A UTILIZAR:
{POLIZAS_MOCK}
"""

@app.post("/api/chat")
async def handle_chat_data(request: Request):
    # Extraemos el historial. Para este prototipo, nos enfocamos en el último mensaje.
    user_message = request.messages[-1].content
    
    # Unimos las reglas con la consulta del paciente
    prompt_completo = f"{SYSTEM_PROMPT}\n\nMensaje del paciente: {user_message}"
    
    # Llamamos a Gemini activando el streaming
    response = model.generate_content(prompt_completo, stream=True)
    
    # Formateamos la respuesta para el AI SDK de Vercel
    def stream_generator():
        for chunk in response:
            if chunk.text:
                # Vercel espera el formato '0:"texto"\n'
                clean_text = chunk.text.replace('\n', '\\n').replace('"', '\\"')
                yield f'0:"{clean_text}"\n'

    return StreamingResponse(stream_generator(), media_type="text/plain")