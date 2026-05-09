# 🏥 Estimador Agéntico de Copago y Cobertura para Pacientes

## 🌟 Introducción

Bienvenidos a nuestro proyecto para el **hackIAthon** (organizado por **Viamatica** e **IT ahora**). Nuestro proyecto aborda el Reto #3: **Estimador Agéntico de Copago y Cobertura para el Paciente**.

Se trata de un agente conversacional inteligente impulsado por IA diseñado para empoderar a los pacientes. Antes de buscar atención médica, el paciente describe sus síntomas; el agente analiza la información, sugiere la especialidad médica adecuada, y mediante un cruce de datos inteligente con su póliza de seguro, calcula de forma precisa el copago estimado e indica el hospital de la red que ofrece la mejor conveniencia económica.

---

## 📑 Tabla de Contenidos

1. [Acerca del Proyecto](#-acerca-del-proyecto-about-section)
2. [Características Principales](#-características-principales-features)
3. [Stack Tecnológico](#-stack-tecnológico-tech-stack)
4. [Arquitectura del Sistema](#-arquitectura-del-sistema-architecture)
5. [Estructura del Proyecto](#-estructura-del-proyecto-project-structure)
6. [Empezando](#-empezando-getting-started)
7. [Configuración](#-configuración-configuration)
8. [Seguridad](#-seguridad-security)
9. [Autores](#-autores)

---

## 💡 Acerca del Proyecto

Navegar por el sistema de salud y entender la cobertura de los seguros médicos suele ser una tarea confusa y frustrante para los pacientes. **Estimador Agéntico de Copago** resuelve este dolor al proveer un asistente proactivo que traduce síntomas médicos a especialidades clínicas y políticas de seguro en costos claros y predecibles.

El agente no solo realiza cálculos matemáticos sobre pólizas, sino que actúa como un "Triage" de primer nivel orientando al paciente a urgencias cuando detecta riesgos vitales, o sugiriendo atención preventiva para síntomas menores, todo mientras cotiza opciones reales de hospitales afiliados.

---

## ✨ Características Principales

- 🤖 **Clasificación Inteligente de Síntomas**: Analiza descripciones en lenguaje natural para determinar la especialidad médica pertinente (o urgencias en casos de riesgo vital).
- 💰 **Estimación Precisa de Copagos**: Calcula el costo exacto a pagar basado en el plan específico del paciente (ej. VidaSana, SaludTotal, EliteCare VIP).
- 🏥 **Recomendación de Red Médica**: Sugiere el hospital más conveniente financieramente basado en los convenios de la aseguradora.
- 📚 **RAG Integrado (Retrieval-Augmented Generation)**: Consulta de manera dinámica y semántica la "Base de Datos de Seguros" en PDF usando Google Gemini File Search para evitar alucinaciones.
- ⚡ **Interfaz Moderna y Reactiva**: Frontend moderno con *streaming* de respuestas en tiempo real, ofreciendo una experiencia interactiva sin interrupciones.

---

## 🛠️ Stack Tecnológico

**Frontend:**
- Next.js (v16+)
- React (v18)
- Tailwind CSS & Shadcn UI
- Framer Motion
- Vercel AI SDK (v5)

**Backend:**
- Python 3.10+
- FastAPI
- Google GenAI SDK
- Uvicorn

**IA y Modelos:**
- **Modelo LLM**: `gemini-3.1-flash-lite`
- **Embeddings**: `models/gemini-embedding-2`
- **Técnica**: RAG a través de **Google Gemini File Search API**.

---

## 🏗️ Arquitectura del Sistema

La arquitectura sigue un patrón de **Cliente-Servidor con IA Integrada**:

1. **Capa de Presentación**: Captura la póliza seleccionada y los síntomas del usuario. Inicia una conexión por *Server-Sent Events (SSE)* vía Vercel AI SDK.
2. **Capa de Lógica**: Recibe el prompt del paciente y el contexto de la póliza. Construye un *System Prompt* robusto con reglas estrictas (ej. derivar a urgencias a costo cero si hay riesgo vital).
3. **Capa RAG & LLM**:
    - El backend consulta el *File Search Store* (creado previamente usando `setup_rag.py` a partir del PDF de seguros).
    - Extrae la información semántica exacta y la procesa a través del modelo `gemini-3.1-flash-lite`.
    - Retorna de manera progresiva (*stream*) la respuesta validada.
4. **Flujo de Respuesta**: Los *chunks* de texto se transmiten vía protocolo *Data Stream* hacia el frontend, el cual renderiza el texto en tiempo real al usuario.

---

## 📂 Estructura del Proyecto

```text
hackathon-copago/
├── api/                    # 🐍 Backend (FastAPI + Python)
│   ├── data/               # Archivos fuente (PDFs de pólizas)
│   ├── index.py            # Entrypoint de FastAPI y lógica de LLM
│   └── prompts.py          # Definición de System Prompts y Reglas
├── app/                    # ⚛️ Frontend (Next.js App Router)
│   ├── globals.css         # Estilos globales y variables
│   ├── layout.tsx          # Layout principal
│   └── page.tsx            # Interfaz principal de chat
├── components/             # Componentes modulares de React (Shadcn UI)
├── setup_rag.py            # Script de inicialización del Gemini File Search
├── requirements.txt        # Dependencias de Python
└── package.json            # Dependencias de Node.js
```

---

## 🚀 Empezando

Sigue estos pasos para levantar el entorno de desarrollo local:

### Prerrequisitos
- Node.js (v18 o superior) y `pnpm` o `npm`.
- Python (3.10 o superior).
- Una API Key de Google Gemini.

### 1. Clonar e Instalar Dependencias
```bash
git clone <URL_DEL_REPOSITORIO>
cd hackathon-copago

# Instalar dependencias del frontend
pnpm install

# Configurar entorno virtual y backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Inicializar RAG (Generación Aumentada por Recuperación)
Ejecuta el script para subir la base de datos de seguros a Google Gemini:
```bash
python setup_rag.py
```
*(Este script cargará el PDF, creará el File Search Store y actualizará automáticamente el `.env` con el ID del Store).*

### 3. Ejecutar el Servidor
Puedes ejecutar ambos entornos simultáneamente usando:
```bash
pnpm dev
```
La aplicación frontend estará disponible en `http://localhost:3000` y la API en `http://localhost:8000`.

---

## ⚙️ Configuración

Crea un archivo `.env` en la raíz del proyecto basándote en `.env.example`:

```env
# Clave API de Google Gemini (Obligatoria)
GEMINI_API_KEY="tu_google_gemini_api_key_aqui"

# Nombre del Almacén de Archivos (Generado automáticamente por setup_rag.py)
FILE_SEARCH_STORE_NAME="stores/tu_store_id"
```

---

## 🛡️ Seguridad

- **Gestión de Secretos**: Las claves API nunca son expuestas al Frontend. Todas las llamadas a LLMs se orquestan y firman desde el Backend.
- **Prevención de Alucinaciones**: El uso de *System Prompts* estrictos obliga a la IA a basarse **únicamente** en los documentos indexados en el RAG. Hay prohibición explícita de inventar pólizas, coberturas o precios.
- **CORS Seguro**: El middleware de FastAPI está configurado para controlar los orígenes permitidos.
- **Enmascaramiento de Errores**: Excepciones internas no se fugan al cliente; se envían mensajes amigables y genéricos ante fallos técnicos.
- **Protección contra Ataques de Supply Chain (NPM & Python)**:
  - **Bloqueo de Scripts Maliciosos**: Se utiliza PNPM con un archivo `.npmrc` configurado con `ignore-scripts=true` y `minimum-release-age=1440` para evitar la ejecución automática de pre/post-installs infectados y poner en cuarentena paquetes recién publicados (menos de 24 horas).
  - **Dependencias Pineadas**: Se han eliminado los "carets" (`^` y `~`) en el `package.json` para las dependencias de JS, y se han fijado de manera exacta (`==`) todas las dependencias de Python en `requirements.txt`. Esto bloquea la descarga automática de parches ("patches") o versiones menores comprometidas.

---

## 👥 Autores

Desarrollado con pasión para el **hackIAthon**:
- **Castro Adolfo**
- **Burgos Richard**

Organizado por: **Viamatica**
Co-organizador: **IT ahora**
