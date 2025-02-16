
#SE DECLARON LOS MODELOS DE LA BASE DE DATOS A OCUPAR#

from sqlalchemy import Column, Integer, String
from Modelo.database import Base

class Usuario(Base):
    __tablename__ = "Usuarios"
    __table_args__ = {"schema": "public"}
    id_user = Column(Integer, primary_key=True, index=True)
    usr = Column(String, unique=True, index=True)
    pwd = Column(String)
