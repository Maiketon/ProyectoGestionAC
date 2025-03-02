from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from Modelo.database import get_db
from Modelo.modeloLogin import Usuario  
from Controlador.controlLogin import validar_usuario, verificar_usuario_autenticado

router = APIRouter()

@router.get("/dashboard")
async def dashboard(usuario: dict = Depends(verificar_usuario_autenticado)):
    return {"message": f"Bienvenido al dashboard, {usuario['usuario']}"}

@router.post("/login")
async def login(usuario: str, password: str, db: AsyncSession = Depends(get_db)):
    return await validar_usuario(usuario, password, db)



# Agrega más endpoints aquí 
