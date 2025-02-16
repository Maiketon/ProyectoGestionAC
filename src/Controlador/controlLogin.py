from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from Modelo.modelos import Usuario

async def validar_usuario(usuario: str, password: str, db: AsyncSession):
    # Hacer la consulta al esquema correcto
    result = await db.execute(select(Usuario).where(Usuario.usr == usuario))
    user = result.scalars().first()  # Obtener el primer resultado
    
    # Verificar si el usuario existe y si la contraseña es correcta
    if user is None or user.pwd != password:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")
    
    return {"message": "Login exitoso", "usuario": usuario, "status":"success"}
