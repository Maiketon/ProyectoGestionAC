from fastapi import APIRouter, Depends, HTTPException,File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from Modelo.database import get_db
#LIBRERIAS PARA LOS ARCHIVOS
#CONTROLADORES
from Controlador.controlLogin import validar_usuario
from Controlador.controlRecepcionModificar import enviarDatosRecibo
from Controlador.controlFiles import guardar_archivo

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
async def subir_archivo(
    pdf: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),  # Inyecta la sesión asíncrona
):
    return await guardar_archivo(pdf, db)  # Llama al controlador de manera asíncrona