from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from Modelo.modeloLogin import Usuario
from Controlador.auth import generar_token_jwt, ACCESS_TOKEN_EXPIRE_MINUTES
from Controlador.crypto_utils import cifrar_dato




SECRET_KEY = "tu_clave_secreta_segura"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")
# Autor : Miguel Angel Montoya Bautista
# Fecha : 8-2-25
# Descripcion: Valida que el usuario exista en la base de datos y genera un token para la protección de rutas, cifra el ID
async def validar_usuario(usuario: str, password: str, db: AsyncSession):
    result = await db.execute(select(Usuario).where(Usuario.usr == usuario))
    user = result.scalars().first()
    
    if user is None or user.pwd != password:
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = generar_token_jwt({"sub": usuario}, access_token_expires)

    return {"access_token": access_token, "token_type": "bearer", "status": "success", "id_user": cifrar_dato(user.id_user)}

# Autor : Miguel Angel Montoya Bautista
# Fecha : 8-2-25
# Descripcion: Verifica si el usuario tiene un token para permitir el acceso a las otras rutas
def verificar_usuario_autenticado(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        usuario = payload.get("sub")
        if usuario is None:
            raise HTTPException(status_code=401, detail="No autenticado")
        return {"usuario": usuario}
    except JWTError:
        raise HTTPException(status_code=401, detail="No autenticado")




