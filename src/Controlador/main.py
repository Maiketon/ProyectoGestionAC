#CONFIGURACIONES DE CONEXIONE Y LOGICAS DEL BACKEND
from fastapi import FastAPI
from Controlador.rutas import router  # Importa el router correctamente
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(router)  # Incluye el router en la aplicación

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes desde cualquier origen (cambia esto en producción)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)






