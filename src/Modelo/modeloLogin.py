
#SE DECLARON LOS MODELOS DE LA BASE DE DATOS A OCUPAR PARA EL LOGIN#

from sqlalchemy import Column, Integer, String
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
