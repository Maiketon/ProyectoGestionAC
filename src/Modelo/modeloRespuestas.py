from sqlalchemy import Column, Integer, String, Date, select
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from Modelo.database import Base
import re

class Respuestas(Base):
    __tablename__ = "respuestas"
    __table_args__ = {"schema": "public"}
    
    id_respuestas = Column(Integer, primary_key=True, index=True)
    respuesta = Column(String, nullable=False)
    fecha_crea = Column(Date, nullable=False)
    fk_usuario_responde = Column(Integer, nullable=False)
    fk_recibo = Column(Integer, nullable=False)
    nombre_archivo_respuesta = Column(String, nullable=False)
    fecha_respuesta = Column(Date, nullable=False)
    @classmethod
    async def obtener_por_recibo(cls, db: AsyncSession, id_recibo: int):
            """
            Obtiene todas las respuestas asociadas a un recibo específico
            ordenadas por fecha descendente.
            """
            try:
                query = (
                    select(cls)
                    .where(cls.fk_recibo == id_recibo)
                    .order_by(cls.fecha_crea.desc())
                )
                result = await db.execute(query)
                return result.scalars().all()
            except Exception as e:
                raise e
    @classmethod
    async def obtener_ultimo_incremento(cls, db: AsyncSession):
        """
        Obtiene el último número de incremento usado en los nombres de archivo de respuestas
        """
        try:
            # Buscar el máximo número en los nombres de archivo existentes
            query = select(cls.nombre_archivo_respuesta)
            result = await db.execute(query)
            archivos = result.scalars().all()
            
            if not archivos:
                return 0
                
            numeros = []
            for archivo in archivos:
                match = re.search(r'respuesta_(\d+)\.pdf', archivo)
                if match:
                    numeros.append(int(match.group(1)))
                    
            return max(numeros) if numeros else 0
        except Exception as e:
            raise e
    @classmethod
    async def crear_respuesta(
    cls,
    db: AsyncSession,
    respuesta: str,
    id_usuario: int,  # ID cifrado
    id_registro: int,
    nombre_archivo: str = "Sin archivo",
    fecha_respuesta: str = None,  # Cambiado de Date a str para manejar el formato
) -> int:
        """
        Crea una nueva respuesta en la base de datos
        Args:
            - db: Sesión de base de datos
            - respuesta: Texto de la respuesta
            - id_usuario: ID de usuario cifrado
            - id_registro: ID del registro (fk_recibo)
            - nombre_archivo: Nombre del archivo adjunto
            - fecha_respuesta: Fecha de respuesta en formato string (YYYY-MM-DD)
        Returns:
            int: ID de la respuesta creada
        """
        try:
            # Convertir la fecha de string a date si viene
            fecha_respuesta_date = None
            if fecha_respuesta:
                try:
                    fecha_respuesta_date = datetime.strptime(fecha_respuesta, "%Y-%m-%d").date()
                except ValueError as e:
                    raise ValueError(f"Formato de fecha inválido. Use YYYY-MM-DD: {str(e)}")

            nueva_respuesta = cls(
                respuesta=respuesta,
                fecha_crea=datetime.now().date(),
                fk_usuario_responde=id_usuario,  # Guardamos el ID cifrado
                fk_recibo=id_registro,
                nombre_archivo_respuesta=nombre_archivo,
                fecha_respuesta=fecha_respuesta_date  # Asignamos la fecha convertida
            )
            
            db.add(nueva_respuesta)
            await db.commit()
            await db.refresh(nueva_respuesta)
            
            return nueva_respuesta.id_respuestas
            
        except Exception as e:
            await db.rollback()
            raise e