from sqlalchemy import Column, Integer, String, Date, select, extract
from datetime import datetime
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
        


class validarNombreArchivo(Base):
    __tablename__ = "nombre_archivos"
    __table_args__ = {"schema": "public"}
    id_nombre_archivo = Column(Integer, primary_key=True, autoincrement=True, nullable=False)
    nombre_del_archivo = Column(String, nullable=False)
    fecha_insercion = Column(Date, nullable=False)

    @staticmethod
    async def hay_registros_mes_actual(db: AsyncSession, fecha_actual: datetime) -> bool:
        """
        Verifica si hay registros en la tabla para el año y mes actual.
        """
        año_actual = fecha_actual.year
        mes_actual = fecha_actual.month

        query = (
            select(validarNombreArchivo)
            .where(
                extract("year", validarNombreArchivo.fecha_insercion) == año_actual,
                extract("month", validarNombreArchivo.fecha_insercion) == mes_actual,
            )
        )
        resultado = await db.execute(query)
        return resultado.scalar() is not None

    @staticmethod
    async def obtener_ultimo_incremento(db: AsyncSession, fecha_actual: datetime) -> int:
        año_actual = fecha_actual.year
        mes_actual = fecha_actual.month

        query = (
            select(validarNombreArchivo)
            .where(
                extract("year", validarNombreArchivo.fecha_insercion) == año_actual,
                extract("month", validarNombreArchivo.fecha_insercion) == mes_actual,
            )
            .order_by(validarNombreArchivo.id_nombre_archivo.desc())
        )
        resultado = await db.execute(query)
        ultimo_registro = resultado.scalars().first()

        if ultimo_registro:
            # Extraer el incremento del nombre del archivo
            incremento = int(ultimo_registro.nombre_del_archivo.split("_")[-1].split(".")[0])
            return incremento
        else:
            return 0

    @staticmethod
    async def crear_registro(db: AsyncSession, nombre_archivo: str, fecha_insercion: datetime):
        """
        Crea un nuevo registro en la tabla.
        """
        nuevo_registro = validarNombreArchivo(
            nombre_del_archivo=nombre_archivo,
            fecha_insercion=fecha_insercion.date(),
        )
        db.add(nuevo_registro)
        await db.commit()
        await db.refresh(nuevo_registro)
        return nuevo_registro