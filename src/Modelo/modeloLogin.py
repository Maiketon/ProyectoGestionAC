
#SE DECLARON LOS MODELOS DE LA BASE DE DATOS A OCUPAR PARA EL LOGIN#

from sqlalchemy import Column, Integer, String
from Modelo.database import Base

class Usuario(Base):
    __tablename__ = "usuarios"
    __table_args__ = {"schema": "public"}
    id_user = Column(Integer, primary_key=True, index=True)
    usr = Column(String, unique=True, index=True)
    pwd = Column(String)
