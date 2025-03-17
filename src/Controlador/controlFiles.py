from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, UploadFile, Depends
from datetime import datetime
import os
import shutil
from Modelo.database import get_db
from Modelo.modeloRecepcionModificar import validarNombreArchivo

async def guardar_archivo(pdf: UploadFile, db: AsyncSession = Depends(get_db)) -> dict:
    try:
        # Obtener la fecha actual
        fecha_actual = datetime.now()

        # Validar si hay registros en la tabla para el mes actual
        if not await validarNombreArchivo.hay_registros_mes_actual(db, fecha_actual):
            # No hay registros, empezar con el incremento 00001
            nuevo_incremento = 1
        else:
            # Obtener el último incremento para el mes actual
            ultimo_incremento = await validarNombreArchivo.obtener_ultimo_incremento(db, fecha_actual)
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

        # Insertar el nuevo registro en la base de datos
        await validarNombreArchivo.crear_registro(db, nombre_archivo, fecha_actual)

        # Devolver el nombre del archivo
        return {"nombre_archivo": nombre_archivo}
    except Exception as e:
        await db.rollback()  # Revertir la transacción en caso de error
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {str(e)}")