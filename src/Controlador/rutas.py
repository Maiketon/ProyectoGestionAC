from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from Modelo.database import get_db
from Modelo.modelos import Usuario  # Asegúrate de que el modelo esté bien importado
from Controlador.controlLogin import validar_usuario #

router = APIRouter()


@router.post("/login")
async def login(usuario: str, password: str, db: AsyncSession = Depends(get_db)):
    return await validar_usuario(usuario, password, db)


# Agrega más endpoints aquí según los necesites
