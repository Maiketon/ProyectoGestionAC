from datetime import datetime
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from Modelo.modeloRecepcionModificar import Recibo  # Importa el modelo Recibo
from Modelo.modeloRespuestas import Respuestas
from Modelo.database import get_db
from Controlador.crypto_utils import cifrar_dato, descifrar_dato

#Funcion que envia los datos del formulario de recepcion al modelo
async def enviarDatosRecibo(datosForm: dict, db: AsyncSession = Depends(get_db)):
    try:
        print("📥 Datos recibidos en FastAPI:", datosForm)

        # Descifrar los campos cifrados
        # datosForm["copia1"] = descifrar_dato(datosForm["copia1"]) if datosForm["copia1"] else None
        # datosForm["copia2"] = descifrar_dato(datosForm["copia2"]) if datosForm["copia2"] else None
        # datosForm["copia3"] = descifrar_dato(datosForm["copia3"]) if datosForm["copia3"] else None
        # datosForm["fk_usuario_registra"] = descifrar_dato(datosForm["fk_usuario_registra"])
        # datosForm["atencion"] = descifrar_dato(datosForm["atencion"])
        
        # print("✅ Datos descifrados correctamente:", datosForm)

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
#Funcion que obtiene los registros filtrados en la sección de seguimiento
"""async def registrosFiltados(filtros: dict, db: AsyncSession = Depends(get_db)):
    try:
        # Validar que los filtros necesarios estén presentes
        if "year" not in filtros or "month" not in filtros:
            raise HTTPException(status_code=422, detail="Los campos 'year' y 'month' son requeridos")

        # Convertir el nombre del mes a número
        months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ]
        month_number = months.index(filtros["month"]) + 1  # Convertir nombre del mes a número

        # Llamar al modelo para obtener los registros filtrados
        registros = await Recibo.obtenerRegistrosFiltrados(
            db,
            year=int(filtros["year"]),
            month=month_number,
            volante=filtros.get("volante")  # El volante es opcional
        )

        # Convertir los registros a un formato que el frontend pueda usar
        registros_dict = [
            {
                "id_registro": registro.id_recibos,
                "fecha": registro.fecha_recibido.strftime("%d/%m/%Y"),
                "referencia": registro.referencia,
                "remitente": registro.remitente,
                "cargo": registro.cargo,
                "noOficio": registro.oficio,
                "dependencia": registro.procedencia,
                "turnado": registro.atencion,
                "instruccion": registro.indicacion,
                "asunto": registro.asunto,
                "volante": registro.volante,
                "nombre_archivo": registro.nombre_archivo,
            }
            for registro in registros
        ]

        return registros_dict

    except ValueError as e:
        raise HTTPException(status_code=422, detail=f"Error en los filtros: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al buscar registros: {str(e)}")"""

#Funcion que obtiene la información del registro completo en seguimiento
async def obtenerInfoRegistro(id_registro: dict, db: AsyncSession = Depends(get_db)):
    """
    Obtiene la información de un registro por su ID.

    :param id_registro: Diccionario con el ID del registro.
    :param db: Sesión de la base de datos.
    :return: Diccionario con los datos del registro.
    """
    try:
        # Extraer el valor de id_registro del diccionario
        id_registro_valor = id_registro.get("id_registro")
        if id_registro_valor is None:
            raise HTTPException(status_code=422, detail="El campo 'id_registro' es requerido")

        print(f"📥 Obteniendo información del registro con ID: {id_registro_valor}")

        # Llamar al classmethod del modelo para obtener el registro
        registro = await Recibo.obtenerInfoRegistro(db, id_registro_valor)

        if not registro:
            raise HTTPException(status_code=404, detail="Registro no encontrado")

        # Convertir el registro a un diccionario
        valores_registroRecibo = {
            "id_registro": registro.id_recibos,
            "fecha": registro.fecha_recibido.strftime("%Y-%m-%d"),
            "referencia": registro.referencia,
            "remitente": registro.remitente,
            "cargo": registro.cargo,
            "noOficio": registro.oficio,
            "dependencia": registro.procedencia,
            "turnado": registro.atencion,
            "instruccion": registro.indicacion,
            "asunto": registro.asunto, 
            "volante": registro.volante,
            "nivel_prioridad": registro.nivel_prioridad,
            "leyenda": registro.leyenda,
            "nombre_archivo": registro.nombre_archivo,
            "copia_para": registro.copia_para,
            "copia_para2": registro.copia_para2,
            "copia_para3": registro.copia_para3,
            "fk_usuario_registra": registro.fk_usuario_registra,
        }

        print("✅ Información del registro obtenida correctamente:", valores_registroRecibo)

        return valores_registroRecibo

    except HTTPException:
        # Relanzar la excepción HTTPException para que FastAPI la maneje
        raise

    except Exception as e:
        import traceback
        print("❌ Error en obtenerInfoRegistro:", str(e))
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error al obtener el registro: {str(e)}")
    
    
    #Obtiene registro filtrados para seguimiento
async def registrosFiltados(filtros: dict, db: AsyncSession = Depends(get_db)):
    """
    Obtiene los registros filtrados por año, mes y (opcionalmente) volante.

    :param filtros: Diccionario con los filtros (year, month, volante).
    :param db: Sesión de la base de datos.
    :return: Lista de registros que coinciden con los filtros.
    """
    try:
        # Validar que los filtros necesarios estén presentes
        if "year" not in filtros or "month" not in filtros:
            raise HTTPException(
                status_code=422,
                detail="Los campos 'year' y 'month' son requeridos"
            )

        # Convertir el nombre del mes a número
        months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ]
        month_name = filtros["month"].capitalize()  # Asegurar formato correcto
        if month_name not in months:
            raise HTTPException(
                status_code=422,
                detail=f"Nombre del mes no válido: {filtros['month']}"
            )
        month_number = months.index(month_name) + 1  # Convertir nombre del mes a número
        print(f"tipoUsuario antes de enviarlo al modelo: {filtros.get('tipoUsuario')}, Tipo: {type(filtros.get('tipoUsuario'))}")

        # Llamar al modelo para obtener los registros filtrados
        registros = await Recibo.obtenerRegistrosFiltrados(
            db,
            year=int(filtros["year"]),
            month=month_number,
            volante=filtros.get("volante"),  # El volante es opcional
            tipoUsuario=filtros.get("tipoUsuario") in [True, "true", "True", 1],  # 👈 Conversión manual
            id_usuario=int(descifrar_dato(filtros.get("id_usuario"))) if filtros.get("id_usuario") else None
        )



        # Devolver la respuesta directamente (ya está en el formato correcto)
        return registros

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error en los filtros: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar registros: {str(e)}"
        )


async def obtenerRespuestasLigadas(informacion_registro: dict, db: AsyncSession):
    print("Entrando a Control")
    try:
        # 1. Validación básica de estructura
        if not informacion_registro:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Datos de solicitud inválidos"
            )

        # 2. Descifrar ID de usuario directamente
        id_usuario = descifrar_dato(informacion_registro["id_usuario"])
        
        # 3. Obtener ID de recibo directamente
        id_recibo = informacion_registro["id_registro"]

        # 4. Obtener respuestas
        respuestas = await Respuestas.obtener_por_recibo(db, id_recibo)
        
        # 5. Formatear respuesta
        return {
            "success": True,
            "count": len(respuestas),
            "respuestas": [
                {
                    "id": r.id_respuestas,
                    "respuesta": r.respuesta,
                    "fecha": r.fecha_crea.isoformat(),
                    "archivo": r.nombre_archivo_respuesta if r.nombre_archivo_respuesta not in [None, "Sin archivo"] else None,
                    "usuario_id": r.fk_usuario_responde,
                    "es_propietario": r.fk_usuario_responde == id_usuario,
                    "fecha_respuesta": r.fecha_respuesta,
                    "fecha_captura": r.fecha_crea
                }
                for r in respuestas
            ],
            "metadata": {
                "recibo_id": id_recibo,
                "usuario_consulta": id_usuario,
                "consulta_timestamp": datetime.now().isoformat()
            }
        }
        
    except KeyError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Falta campo obligatorio: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno al procesar la solicitud: {str(e)}"
        )
    

async def registrar_respuesta_controller(respuesta_data: dict, db: AsyncSession):
    try:
        # Validación básica
        required_fields = ["respuesta", "id_usuario", "id_registro", "fecha_respuesta"]
        for field in required_fields:
            if not respuesta_data.get(field):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Campo requerido faltante: {field}"
                )

        # Validar formato de fecha
        try:
            datetime.strptime(respuesta_data["fecha_respuesta"], "%Y-%m-%d")
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato de fecha inválido. Use YYYY-MM-DD"
            )

        # Insertar usando el modelo
        id_respuesta = await Respuestas.crear_respuesta(
            db=db,
            respuesta=respuesta_data["respuesta"],
            id_usuario=int(descifrar_dato(respuesta_data["id_usuario"])),
            id_registro=respuesta_data["id_registro"],
            nombre_archivo=respuesta_data.get("nombre_archivo_respuesta", "Sin archivo"),
            fecha_respuesta=respuesta_data["fecha_respuesta"]
        )

        return {
            "success": True,
            "id_respuesta": id_respuesta,
            "message": "Respuesta registrada exitosamente"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al registrar respuesta: {str(e)}"
        )
    #FUNCIONES PARA EL COMPONENTE DE CONSULTAR
    
async def consultar_MesAnio(filtro: dict, db: AsyncSession = Depends(get_db)):
    """
    Obtiene los registros filtrados por año y mes.

    :param filtro: Diccionario con los filtros (year, month).
    :param db: Sesión de la base de datos.
    :return: Lista de registros que coinciden con los filtros.
    """
    try:
        print("el back recibio estos valors", filtro)
        # Validar que los filtros necesarios estén presentes
        if "year" not in filtro or "month" not in filtro:
            raise HTTPException(
                status_code=422,
                detail="Los campos 'year' y 'month' son requeridos"
            )

        # Convertir el nombre del mes a número
        months = [
            "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
            "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
        ]
        month_name = filtro["month"].capitalize()  # Asegurar formato correcto
        if month_name not in months:
            raise HTTPException(
                status_code=422,
                detail=f"Nombre del mes no válido: {filtro['month']}"
            )
        month_number = months.index(month_name) + 1  # Convertir nombre del mes a número

        # Llamar al modelo para obtener los registros filtrados
        registros = await Recibo.obtenerRegistrosFiltrados(
            db,
            year=int(filtro["year"]),
            month=month_number,
            tipoUsuario= filtro.get("tipoUsuario"),
            id_usuario= descifrar_dato(filtro.get("id_usuario"))
        )

        # Devolver la respuesta directamente (ya está en el formato correcto)
        return registros

    except ValueError as e:
        raise HTTPException(
            status_code=422,
            detail=f"Error en los filtros: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error al buscar registros: {str(e)}"
        )    