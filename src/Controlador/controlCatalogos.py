from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from Modelo.modeloCatalogos import CatalogoAreas
from Controlador.crypto_utils import cifrar_dato
async def catalogoAreas(db: AsyncSession):
    query = select(CatalogoAreas)
    result = await db.execute(query)
    areas = result.scalars().all()
    return [{"id":str(cifrar_dato(area.id_areas)), "nombre": area.nombre} for area in areas]