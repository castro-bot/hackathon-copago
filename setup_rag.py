import os
import time
from dotenv import load_dotenv, set_key
from google import genai
from google.genai import types

# Cargar variables de entorno
load_dotenv(".env")

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def main():
    print("🚀 Creando File Search Store...")

    # Creamos el File Search Store
    file_search_store = client.file_search_stores.create(
        config=types.CreateFileSearchStoreConfig(
            display_name='seguros-knowledge',
            embedding_model='models/gemini-embedding-2'
        )
    )
    store_name = file_search_store.name
    print(f"✅ Store creado: {store_name}")

    # Guardamos el store en el .env
    set_key(".env", "FILE_SEARCH_STORE_NAME", store_name)
    print("✅ FILE_SEARCH_STORE_NAME guardado en .env")

    # Subimos el PDF
    pdf_path = "api/data/Base_Datos_Seguros_Completa2.pdf"

    if not os.path.exists(pdf_path):
        print(f"❌ No se encontró el archivo: {pdf_path}")
        return

    print(f"📤 Subiendo {pdf_path} al Store (esto puede tardar un poco)...")
    operation = client.file_search_stores.upload_to_file_search_store(
        file=pdf_path,
        file_search_store_name=store_name,
        config=types.UploadToFileSearchStoreConfig(
            display_name='Base de Datos Seguros',
            custom_metadata=[
                types.CustomMetadata(key='type', string_value='insurance')
            ]
        )
    )

    # Esperar a que termine la indexación
    print("⏳ Esperando a que termine el procesamiento...")
    while not operation.done:
        time.sleep(5)
        operation = client.operations.get(operation)

    print("🎉 ¡Procesamiento completado!")
    print(f"Ya puedes iniciar tu servidor FastAPI y el backend usará el Store {store_name} como motor RAG.")

if __name__ == "__main__":
    main()
