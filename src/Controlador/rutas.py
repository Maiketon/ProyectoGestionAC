from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from Modelo.database import get_db
#LIBRERIAS PARA LOS ARCHIVOS
from fastapi import APIRouter, File, UploadFile, HTTPException
import os
import shutil
#CONTROLADORES
from Controlador.controlLogin import validar_usuario
from Controlador.controlRecepcionModificar import enviarDatosRecibo

from Controlador.controlCatalogos import catalogoAreas
#ARCHIVO DE RUTAS DE MAPEO DE LOS ENPOINTS
router = APIRouter()

#Endpoints Login
@router.post("/login")
async def login(usuario: str, password: str, db: AsyncSession = Depends(get_db)):
    return await validar_usuario(usuario, password, db)

#Endpoints recepcion y modificar
@router.post("/registrarRecibo")
async def formulario_recepcion(datosForm: dict, db: AsyncSession = Depends(get_db)):
    print("📥 Datos recibidos en FastAPI:", datosForm)  # <-- Agrega esto
    return await enviarDatosRecibo(datosForm, db)
#async def registrarOficio



#Endpoints de Catalogos para hacer peticiones gets
@router.get("/areas")
async def get_areas(db:AsyncSession = Depends(get_db)):
    return await catalogoAreas(db)


# Agrega más endpoints aquí 


#endpoint para subir archivos al servidor desde el formulario de recepcion
@router.post("/subirArchivo")
async def subir_archivo(pdf: UploadFile = File(...)):
    try:
        # Crear la carpeta "uploads" si no existe
        if not os.path.exists("recibosPrueba"):
            os.makedirs("recibosPrueba")

        # Guardar el archivo en la carpeta "uploads"
        file_path = f"recibosPrueba/{pdf.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(pdf.file, buffer)

        # Devolver el nombre del archivo
        return {"nombre_archivo": pdf.filename}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al subir el archivo: {str(e)}")