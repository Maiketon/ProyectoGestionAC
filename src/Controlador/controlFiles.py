from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, UploadFile 
from fastapi.responses import FileResponse
from datetime import datetime
import os
import shutil
from Modelo.modeloRecepcionModificar import *
from Modelo.modeloRespuestas import *

async def guardar_archivo(pdf: UploadFile, db: AsyncSession) -> dict:
    try:
        # Obtener la fecha actual
        fecha_actual = datetime.now()

        # Validar si hay registros en la tabla para el mes actual
        if not await Recibo.hay_registros_anioymes_actual(db, fecha_actual):
            nuevo_incremento = 1
        else:
            # Obtener el último incremento para el mes actual
            ultimo_incremento = await Recibo.obtener_ultimo_incremento(db, fecha_actual)
            nuevo_incremento = ultimo_incremento + 1

        # Formatear el nombre del archivo
        nombre_archivo = f"recibo_{fecha_actual.strftime('%Y-%m-%d')}_{nuevo_incremento:05d}.pdf"

        # Crear la carpeta "recibosPrueba" si no existe
        if not os.path.exists("recibosPrueba"):
            os.makedirs("recibosPrueba")

        # Guardar el archivo en la carpeta "recibosPrueba"
        file_path = f"recibosPrueba/{nombre_archivo}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(pdf.file, buffer)

        # Devolver el nombre del archivo generado
        return {"nombre_archivo": nombre_archivo}
    except Exception as e:
        # Revertir la transacción en caso de error (aunque no hay inserción, es buena práctica)
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {str(e)}")
    
async def obtener_pdf_controller(nombre_archivo: str):
    """
    Controlador para obtener un archivo PDF por su nombre.

    Parámetros:
    - nombre_archivo: Nombre del archivo PDF que se desea obtener.

    Retorna:
    - El archivo PDF si existe.
    - Un error 404 si el archivo no se encuentra.
    """
    # Ruta de la carpeta donde se guardan los archivos
    carpeta = "recibosPrueba"
    file_path = os.path.join(carpeta, nombre_archivo)

    # Verificar si el archivo existe
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Archivo no encontrado")

    # Devolver el archivo como respuesta
    return FileResponse(file_path, media_type="application/pdf")


async def guardar_archivo_respuesta(pdf: UploadFile, db: AsyncSession) -> dict:
    try:
        fecha_actual = datetime.now()

        # Obtener el último incremento para respuestas
        ultimo_incremento = await Respuestas.obtener_ultimo_incremento(db)
        nuevo_incremento = ultimo_incremento + 1 if ultimo_incremento else 1

        # Formatear el nombre del archivo
        nombre_archivo = f"respuesta_{nuevo_incremento:05d}.pdf"

        # Crear la carpeta si no existe
        if not os.path.exists("recibosPrueba"):
            os.makedirs("recibosPrueba")

        # Guardar el archivo
        file_path = f"recibosPrueba/{nombre_archivo}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(pdf.file, buffer)
            

        return {"nombre_archivo": nombre_archivo}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {str(e)}")