from sqlalchemy import Column, Integer, String
from Modelo.database import Base



class catalogAreas(Base):
    __tablename__ = "areas"
    __table_args__ = {"schema": "public"}
    id_areas = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)
