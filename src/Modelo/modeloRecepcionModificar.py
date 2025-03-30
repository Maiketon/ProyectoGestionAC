from sqlalchemy import Column, Integer, String, Date, select, extract
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from Modelo.database import Base
from Modelo.modeloCatalogos import CatalogoAreas
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
    volante = Column(String, nullable=False)
    indicacion = Column(String, nullable=False)
    fecha_captura = Column(Date, nullable=False)
    nivel_prioridad = Column(Integer, nullable=True)
    leyenda = Column(Integer, nullable=False)
    nombre_archivo = Column(String, nullable=False)
    copia_para = Column(Integer, nullable=False)
    copia_para2 = Column(Integer, nullable=True)
    copia_para3 = Column(Integer, nullable=True)
    fk_usuario_registra = Column(Integer, nullable=False)

    @staticmethod
    async def hay_registros_anioymes_actual(db: AsyncSession, fecha_actual: datetime) -> bool:
        """
        Verifica si hay registros en la tabla para el año y mes actual.
        """
        año_actual = fecha_actual.year
        mes_actual = fecha_actual.month

        logger.debug(f"Verificando registros para el año {año_actual} y mes {mes_actual}")

        query = (
            select(Recibo)
            .where(
                extract("year", Recibo.fecha_captura) == año_actual,
                extract("month", Recibo.fecha_captura) == mes_actual,
            )
        )
        resultado = await db.execute(query)
        existe_registro = resultado.scalar() is not None

        logger.debug(f"¿Hay registros para el año {año_actual} y mes {mes_actual}? {existe_registro}")

        return existe_registro
    @staticmethod
    async def obtener_ultimo_incremento(db: AsyncSession, fecha_actual: datetime) -> int:
        """
        Obtiene el último incremento del nombre del archivo para el año y mes actual.
        """
        año_actual = fecha_actual.year
        mes_actual = fecha_actual.month

        logger.debug(f"Obteniendo último incremento para el año {año_actual} y mes {mes_actual}")

        query = (
            select(Recibo.nombre_archivo)
            .where(
                extract("year", Recibo.fecha_captura) == año_actual,
                extract("month", Recibo.fecha_captura) == mes_actual,
            )
            .order_by(Recibo.id_recibos.desc())
        )
        resultado = await db.execute(query)
        ultimo_registro = resultado.scalars().first()
        if ultimo_registro:
            # Extraer el incremento del nombre del archivo
            incremento = int(ultimo_registro.split("_")[-1].split(".")[0])
            logger.debug(f"Último incremento encontrado: {incremento}")
        else:
            incremento = 0
            logger.debug("No se encontraron registros para el año y mes actual. Incremento inicial: 0")

        return incremento
    #FUNCIONES PARA OBTENER REGISTROS DE ESTE AÑO PARA VOLANTE#
    @staticmethod
    async def hay_registros_año_actual(db: AsyncSession, fecha_actual: datetime) -> bool:
        """
        Verifica si hay registros en la tabla para el año actual.
        """
        año_actual = fecha_actual.year

        query = (
            select(Recibo)
            .where(
                extract("year", Recibo.fecha_captura) == año_actual,
            )
        )
        resultado = await db.execute(query)
        return resultado.scalar() is not None
    #SI EXISTEN REGISTROS SOBRE EL AÑO ACTUAL, OBTENER EL ULTIMO VOLANTE PARA EN CONTROL INCREMENTAR
    @staticmethod
    async def obtener_ultimo_volante(db: AsyncSession, fecha_actual: datetime) -> int:
        """
        Obtiene el último valor de `volante` para el año actual.
        """
        año_actual = fecha_actual.year

        query = (
            select(Recibo.volante)
            .where(
                extract("year", Recibo.fecha_captura) == año_actual,
            )
            .order_by(Recibo.volante.desc())
        )
        resultado = await db.execute(query)
        ultimo_volante = resultado.scalars().first()

        return ultimo_volante if ultimo_volante else 0
    
    # FUNCION QUE PERMITE INSERTAR UN RECIBO DE RECEPCIÓN EN LA BASE DE DATOS
    @classmethod
    async def insertar_Recibo(cls, datos: dict, db: AsyncSession):
        try:
            # Obtener la fecha actual
            fecha_actual = datetime.now()

            # Verificar si hay registros para el año actual
            if not await cls.hay_registros_año_actual(db, fecha_actual):
                nuevo_volante = 1  # Si no hay registros, empezar con 1
            else:
                # Obtener el último valor de `volante` para el año actual
                ultimo_volante = await cls.obtener_ultimo_volante(db, fecha_actual)
                
                # Convertir el último volante a entero, sumarle 1 y luego formatearlo
                nuevo_volante = int(ultimo_volante) + 1

            # Formatear el volante con ceros a la izquierda
            volante_formateado = f"{nuevo_volante:05d}"  # Resultado: "00001", "00002", etc.

            # Asignar el nuevo valor de `volante` a los datos
            datos["volante"] = volante_formateado  # Asegúrate de que sea un str

            # Crear una instancia de Recibo con los datos recibidos
            nuevo_recibo = cls(**datos)
            logger.debug("Instancia de Recibo creada: %s", nuevo_recibo)

            # Agregar el nuevo recibo a la sesión y guardar en la base de datos
            db.add(nuevo_recibo)
            logger.debug("Recibo agregado a la sesión \n")

            await db.commit()  # Guardar los cambios en la base de datos
            logger.debug("Cambios confirmados en la base de datos \n")

            await db.refresh(nuevo_recibo)  # Actualizar la instancia con los datos de la base de datos
            logger.debug("Instancia de Recibo actualizada con datos de la base de datos \n")

            return nuevo_recibo
        except Exception as e:
            await db.rollback()  # Revertir la transacción en caso de error
            logger.error("Error al insertar el recibo: %s", str(e), exc_info=True)
            raise HTTPException(status_code=500, detail=f"Error al insertar el recibo: {str(e)}")
    #Funcion que trae toda la información de un registro
    @classmethod
    async def obtenerInfoRegistro(cls, db: AsyncSession, id_registro: int):
        try:
            # Consultar el registro en la base de datos
            query = select(cls).where(cls.id_recibos == id_registro)
            result = await db.execute(query)
            registro = result.scalars().first()

            if not registro:
                return None  # Si no se encuentra el registro, retornar None

            return registro  # Retornar el registro encontrado

        except Exception as e:
            print(f"Error en obtenerInfoRegistro: {str(e)}")
            raise  # Relanzar la excepción para manejarla en el endpoint




    @classmethod
    async def obtenerRegistrosFiltrados(
        cls, 
        db: AsyncSession, 
        year: int, 
        month: int, 
        volante: str = None,
        tipoUsuario: bool = False,
        id_usuario: int = None
    ):
        """
        Obtiene los registros filtrados por año, mes y (opcionalmente) volante.
        Si tipoUsuario es True, trae todos los registros (super usuario).
        Si es False, filtra también por el usuario que registró (fk_usuario_registra == id_usuario).

        :param db: Sesión de la base de datos.
        :param year: Año de los registros.
        :param month: Mes de los registros.
        :param volante: Volante de los registros (opcional).
        :param tipoUsuario: Si es True, muestra todos los registros sin filtrar por usuario.
        :param id_usuario: ID del usuario para filtrar (si tipoUsuario es False).
        :return: Lista de registros que coinciden con los filtros.
        """
        try:
            # Construir la consulta base
            query = select(cls).where(
                extract("year", cls.fecha_captura) == year,
                extract("month", cls.fecha_captura) == month,
            )

            # Si no es super usuario, se filtra por el usuario que registró
            if not tipoUsuario and id_usuario is not None:
                query = query.where(cls.fk_usuario_registra == id_usuario)

            # Si se proporciona un volante, agregarlo a la consulta
            if volante:
                query = query.where(cls.volante == volante)

            # Ejecutar la consulta
            result = await db.execute(query)
            registros = result.scalars().all()

            registros_actualizados = []
            for registro in registros:
                try:
                    # Subconsulta para obtener el nombre y titular del área de atención
                    nombre_area_atencion = None
                    titular_area_atencion = None
                    if registro.atencion:
                        subquery_atencion = select(
                            CatalogoAreas.nombre, 
                            CatalogoAreas.titular
                        ).where(
                            CatalogoAreas.id_areas == int(registro.atencion)
                        )
                        subresult_atencion = await db.execute(subquery_atencion)
                        result_atencion = subresult_atencion.fetchone()
                        if result_atencion:
                            nombre_area_atencion = result_atencion.nombre
                            titular_area_atencion = result_atencion.titular

                    # Subconsultas para copias
                    nombre_copia_para = None
                    titular_copia_para = None
                    nombre_copia_para2 = None
                    titular_copia_para2 = None
                    nombre_copia_para3 = None
                    titular_copia_para3 = None

                    if registro.copia_para:
                        subquery_copia_para = select(
                            CatalogoAreas.nombre, 
                            CatalogoAreas.titular
                        ).where(
                            CatalogoAreas.id_areas == int(registro.copia_para)
                        )
                        subresult_copia_para = await db.execute(subquery_copia_para)
                        result_copia_para = subresult_copia_para.fetchone()
                        if result_copia_para:
                            nombre_copia_para = result_copia_para.nombre
                            titular_copia_para = result_copia_para.titular

                    if registro.copia_para2:
                        subquery_copia_para2 = select(
                            CatalogoAreas.nombre, 
                            CatalogoAreas.titular
                        ).where(
                            CatalogoAreas.id_areas == int(registro.copia_para2)
                        )
                        subresult_copia_para2 = await db.execute(subquery_copia_para2)
                        result_copia_para2 = subresult_copia_para2.fetchone()
                        if result_copia_para2:
                            nombre_copia_para2 = result_copia_para2.nombre
                            titular_copia_para2 = result_copia_para2.titular

                    if registro.copia_para3:
                        subquery_copia_para3 = select(
                            CatalogoAreas.nombre, 
                            CatalogoAreas.titular
                        ).where(
                            CatalogoAreas.id_areas == int(registro.copia_para3)
                        )
                        subresult_copia_para3 = await db.execute(subquery_copia_para3)
                        result_copia_para3 = subresult_copia_para3.fetchone()
                        if result_copia_para3:
                            nombre_copia_para3 = result_copia_para3.nombre
                            titular_copia_para3 = result_copia_para3.titular

                    # Crear el diccionario con los datos transformados
                    registro_dict = {
                        "id_registro": registro.id_recibos,
                        "fecha": registro.fecha_recibido.strftime("%Y-%m-%d") if registro.fecha_recibido else None,
                        "referencia": registro.referencia,
                        "remitente": registro.remitente,
                        "cargo": registro.cargo,
                        "noOficio": registro.oficio,
                        "dependencia": registro.procedencia,
                        "asunto": registro.asunto,
                        "atencion_valor": registro.atencion,
                        "atencion": nombre_area_atencion,
                        "titular_atencion": titular_area_atencion,
                        "volante": registro.volante,
                        "indicacion": registro.indicacion,
                        "fecha_captura": registro.fecha_captura.strftime("%Y-%m-%d") if registro.fecha_captura else None,
                        "nivel_prioridad": registro.nivel_prioridad,
                        "leyenda": registro.leyenda,
                        "nombre_archivo": registro.nombre_archivo,
                        "copia_para": registro.copia_para,
                        "copia_para_nombre": nombre_copia_para,
                        "titular_copia_para": titular_copia_para,
                        "copia_para2": registro.copia_para2,
                        "copia_para2_nombre": nombre_copia_para2,
                        "titular_copia_para2": titular_copia_para2,
                        "copia_para3": registro.copia_para3,
                        "copia_para3_nombre": nombre_copia_para3,
                        "titular_copia_para3": titular_copia_para3,
                        "fk_usuario_registra": registro.fk_usuario_registra,
                    }
                    registros_actualizados.append(registro_dict)

                except Exception as e:
                    print(f"❌ Error al procesar el registro {registro.id_recibos}: {str(e)}")
                    continue

            return registros_actualizados

        except Exception as e:
            print(f"❌ Error en obtenerRegistrosFiltrados: {str(e)}")
            raise
