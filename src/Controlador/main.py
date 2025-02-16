# CONFIGURACIONES DE CONEXIÓN Y LÓGICAS DEL BACKEND
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from Controlador.rutas import router  # Importa el router correctamente
from Controlador.auth import generar_token_jwt, ACCESS_TOKEN_EXPIRE_MINUTES




app = FastAPI()
app.include_router(router)  # Incluye el router en la aplicación


# Configuración de seguridad
SECRET_KEY = "tu_clave_secreta_segura"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30  # Expiración del token en minutos
REFRESH_THRESHOLD_MINUTES = 5  # Tiempo antes de la expiración para renovar el token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")



app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permite solicitudes desde cualquier origen (cambia esto en producción)
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (GET, POST, etc.)
    allow_headers=["*"],  # Permite todos los encabezados
)


# 🔹 Endpoint para refrescar el token (Debe estar fuera de la función anterior)
@app.post("/refresh")
def refresh_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        nuevo_token = generar_token_jwt({"sub": payload["sub"]}, timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
        return {"access_token": nuevo_token, "token_type": "bearer"}
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido")



