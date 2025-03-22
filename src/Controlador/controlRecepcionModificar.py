from datetime import datetime
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from Modelo.modeloRecepcionModificar import Recibo  # Importa el modelo Recibo
from Modelo.database import get_db
from Controlador.crypto_utils import cifrar_dato, descifrar_dato


async def enviarDatosRecibo(datosForm: dict, db: AsyncSession = Depends(get_db)):
    try:
        print("📥 Datos recibidos en FastAPI:", datosForm)

        # Descifrar los campos cifrados
        datosForm["copia1"] = descifrar_dato(datosForm["copia1"]) if datosForm["copia1"] else None
        datosForm["copia2"] = descifrar_dato(datosForm["copia2"]) if datosForm["copia2"] else None
        datosForm["copia3"] = descifrar_dato(datosForm["copia3"]) if datosForm["copia3"] else None
        datosForm["fk_usuario_registra"] = descifrar_dato(datosForm["fk_usuario_registra"])
        
        print("✅ Datos descifrados correctamente:", datosForm)

        # Mapear los datos correctamente
        datos_mapeados = {
            "fecha_recibido": datetime.strptime(datosForm["fecha"], "%Y-%m-%d").date(),
            "referencia": datosForm["referencia"],
            "remitente": datosForm["remitente"],
            "cargo": datosForm["cargo"],
            "oficio": datosForm["fechaOficio"],
            "procedencia": datosForm["procedencia"],
            "asunto": datosForm["asunto"],
            "atencion": datosForm["atencion"],
            "indicacion": datosForm["indicacion"],
            "fecha_captura": datetime.now().date(),  
            "nivel_prioridad": int(datosForm["urgente"]) if datosForm["urgente"].isdigit() else 1,  
            "leyenda": 1 if datosForm["leyenda"] == "Sí" else 0,
            "copia_para": int(datosForm["copia1"]) if datosForm["copia1"] and datosForm["copia1"].isdigit() else None,
            "copia_para2": int(datosForm["copia2"]) if datosForm["copia2"] and datosForm["copia2"].isdigit() else None,
            "copia_para3": int(datosForm["copia3"]) if datosForm["copia3"] and datosForm["copia3"].isdigit() else None,
            "fk_usuario_registra": int(datosForm["fk_usuario_registra"]) if datosForm["fk_usuario_registra"].isdigit() else None,
            "nombre_archivo": datosForm["nombre_archivo"]
        }

        print("🛠 Datos mapeados correctamente:", datos_mapeados)

        # Llamar al modelo para insertar los datos
        nuevo_recibo = await Recibo.insertar_Recibo(datos_mapeados, db)

        return {"message": "Recibo insertado correctamente", "data": nuevo_recibo}

    except Exception as e:
        import traceback
        print("❌ Error en enviarDatosRecibo:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error en enviarDatosRecibo: {str(e)}")