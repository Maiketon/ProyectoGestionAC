
#INICIALIZACIÓN DE LA BASE DE DATOS#
import asyncio
from Modelo.database import engine, Base

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

if __name__ == "__main__":
    asyncio.run(init_db())
