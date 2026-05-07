# pyrefly: ignore [missing-import]
import PyPDF2
import os

def extraer_texto_pdf(ruta_pdf: str) -> str:
    texto = ""
    try:
        # Aseguramos de construir la ruta absoluta para que no falle al desplegar
        ruta_absoluta = os.path.join(os.path.dirname(__file__), ruta_pdf)
        with open(ruta_absoluta, 'rb') as archivo:
            lector = PyPDF2.PdfReader(archivo)
            for pagina in lector.pages:
                texto += pagina.extract_text() + "\n"
    except Exception as e:
        print(f"Error leyendo el PDF: {e}")
        return "No se pudo cargar la base de datos de seguros."
    return texto