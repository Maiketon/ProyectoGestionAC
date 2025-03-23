from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.ext.declarative import declarative_base

# Configuración de la base de datos
#DATABASE_URL = "postgresql+asyncpg://postgres:123456@localhost:5432/proyectoJefatura"
DATABASE_URL = "postgresql+asyncpg://postgres:123456@localhost:5432/proyectoJefatura"

# Crear el motor asíncrono de la base de datos, para peticiones asincronas importante
engine = create_async_engine(DATABASE_URL, echo=True)

# Crear una sesión de base de datos
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para modelos de SQLAlchemy
Base = declarative_base()

# Dependencia para obtener la sesión en rutas
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
