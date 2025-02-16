from fastapi import FastAPI
from Controlador.rutas import router

app = FastAPI()

# Incluir las rutas del backend
app.include_router(router)

@app.get("/")
def read_root():
    return {"message": "API funcionando correctamente"}

