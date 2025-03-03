from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from Modelo.database import get_db
from Controlador.controlLogin import validar_usuario
#from Controlador.controlRecepcionModificar import obtener
from Controlador.controlCatalogos import catalogoAreas
#ARCHIVO DE RUTAS DE MAPEO DE LOS ENPOINTS
router = APIRouter()

#Endpoints Login
@router.post("/login")
async def login(usuario: str, password: str, db: AsyncSession = Depends(get_db)):
    return await validar_usuario(usuario, password, db)

#Endpoints recepcion y modificar
#@router.post("/registrar")
#async def registrarOficio



#Endpoints de Catalogos para hacer peticiones gets
@router.get("/areas")
async def get_areas(db:AsyncSession = Depends(get_db)):
    return await catalogoAreas(db)


# Agrega más endpoints aquí 
