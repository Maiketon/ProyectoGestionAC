from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from Modelo.database import Base
import logging

# Configurar el logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class Recibo(Base):
    __tablename__ = "recibos"
    __table_args__ = {"schema": "public"}
    id_recibos = Column(Integer, primary_key=True, index=True, autoincrement=True)
    fecha_recibido = Column(Date, nullable=False)
    referencia = Column(String, nullable=False)
    remitente = Column(String, nullable=False)
    cargo = Column(String, nullable=False)
    oficio = Column(String, nullable=False)
    procedencia = Column(String, nullable=False)
    asunto = Column(String, nullable=False)
    atencion = Column(String, nullable=False)
    volante = Column(Integer, nullable=False)
    indicacion = Column(String, nullable=False)
    fecha_captura = Column(Date, nullable=False)
    nivel_prioridad = Column(Integer, nullable=True)
    leyenda = Column(Integer, nullable=False)
    nombre_archivo = Column(String, nullable=False)
    copia_para = Column(Integer, nullable=False)
    copia_para2 = Column(Integer, nullable=True)
    copia_para3 = Column(Integer, nullable=True)
    fk_usuario_registra = Column(Integer, nullable=False)

    @classmethod
    async def insertar_Recibo(cls, datos: dict, db: AsyncSession):
        """
        Inserta un nuevo recibo en la base de datos.
        :param datos: Diccionario con los datos del recibo.
        :param db: Sesión de la base de datos.
        :return: El nuevo recibo creado.
        """
        try:
            # Depuración: Imprimir los datos recibidos
            logger.debug("Datos recibidos para insertar: %s", datos)

            # Crear una instancia de Recibo con los datos recibidos
            nuevo_recibo = cls(**datos)
            logger.debug("Instancia de Recibo creada: %s", nuevo_recibo)

            # Agregar el nuevo recibo a la sesión y guardar en la base de datos
            db.add(nuevo_recibo)
            logger.debug("Recibo agregado a la sesión")

            await db.commit()  # Guardar los cambios en la base de datos
            logger.debug("Cambios confirmados en la base de datos")

            await db.refresh(nuevo_recibo)  # Actualizar la instancia con los datos de la base de datos
            logger.debug("Instancia de Recibo actualizada con datos de la base de datos")

            return nuevo_recibo
        except Exception as e:
            await db.rollback()  # Revertir la transacción en caso de error
            logger.error("Error al insertar el recibo: %s", str(e), exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error al insertar el recibo: {str(e)}")