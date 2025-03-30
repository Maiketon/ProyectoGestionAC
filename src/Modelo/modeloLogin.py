
#SE DECLARON LOS MODELOS DE LA BASE DE DATOS A OCUPAR PARA EL LOGIN#

from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from fastapi import HTTPException
from Modelo.database import Base
# Autor : Miguel Angel Montoya Bautista
# Fecha : 8-2-25
# Descripcion: Consulta a la tabla usuarios, en el schema public, extrayendo id de usuario qe empate con usr y pwd
class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"schema": "public"}
    id_user = Column(Integer, primary_key=True, index=True)
    usr = Column(String, unique=True, index=True)
    pwd = Column(String)
    rol = Column(Boolean)
    status= Column(Boolean)
    nombre = Column(String)
    apellido_p = Column(String)
    @classmethod
    async def validar_credenciales(cls, usuario: str, password: str, db: AsyncSession):
        # Ejecutar la consulta SQL para buscar el usuario
        result = await db.execute(select(cls).where(cls.usr == usuario))
        user = result.scalars().first()

        # Validar si el usuario existe y si la contraseña es correcta
        if user is None or user.pwd != password:
            raise HTTPException(status_code=401, detail="Usuario o contraseña incorrectos")

        return user
