// src/Vista/recepcion.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button, Table, Modal } from "react-bootstrap";

const Recepcion = () => {
  const [formData, setFormData] = useState({
    fecha: "",
    referencia: "",
    cargo: "",
    remitente: "",
    procedencia: "",
    fechaOficio: "",
    indicacion: "",
    atencion: "",
    asunto: "",
    copia1: "",
    copia2: "",
    copia3: "",
    pdf: null,
    leyenda: "1", // Ajustado para que coincida con los valores del select
    urgente: "1", // Ajustado para que coincida con los valores del select
  });

  const [pdfFile, setPdfFile] = useState(null);
  const [error, setError] = useState(""); // Mensaje de error general
  const [fieldErrors, setFieldErrors] = useState({}); // Estado para rastrear errores por campo
  const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
  const [modalMessage, setModalMessage] = useState(""); // Mensaje del modal
  const [modalVariant, setModalVariant] = useState("success"); // Tipo de modal (success/danger)

  //Logica para llenar un selector con información de la base de datos
  /*
  Autor: Miguel Angel Montoya Bautista
  Fecha: 2-3-25
  Descripcion: Se crea una nueva ariable para alojar el catalogo de las areas y posteriormente se hace una peticion get al back.
  */
  const [areas, setAreas] = useState([]);
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/areas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAreas(response.data); // Guardamos las áreas en el estado
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
        // Ajuste para mostrar un mensaje de error si falla la petición por medio de Modal
        setModalMessage("No se pudieron cargar las áreas. Intenta de nuevo.");
        setModalVariant("danger");
        setShowModal(true);
      }
    };

    fetchAreas();
  }, []);


 //Autor: Abraham Alvarado Gutierrez
 //Fecha: 2-3-25
 //Descripcion: Funcion que cambia el valor de cada campo, en cuanto se efectua un cambio (actualizar valor al cambio)
 
 const handleChange = (e) => {
   const { name, value, files } = e.target;
   // Autor: Abraham Alvarado Gutierrez
   // Manejar cambios en los campos del formulario - Actualiza el estado formData - Actualiza el estado fieldErrors
   // Ajuste a la función original para validar el campo Volante (solo números)
   // Fecha: 15-3-25
    if (name === "pdf") {
      const file = files[0];
      // Validar tipo de archivo (solo PDF) y tamaño (máximo 5MB)
      if (file) {
        // Validar que sea un PDF
        if (!file.type.includes("application/pdf")) {
          setModalVariant("danger");
          setShowModal(true);
          setFieldErrors({ ...fieldErrors, pdf: true });
          setPdfFile(null);
          setFormData({ ...formData, pdf: null });
          return;
        }
        // Validar tamaño (máximo 5MB)
        const maxSizeInBytes = 5 * 1024 * 1024; // 5MB en bytes
        if (file.size > maxSizeInBytes) {
          setModalMessage("El archivo no debe exceder 5MB.");
          setModalVariant("danger");
          setShowModal(true);
          setFieldErrors({ ...fieldErrors, pdf: true });
          setPdfFile(null);
          setFormData({ ...formData, pdf: null });
          return;
        }
        // Si pasa las validaciones, actualizamos el estado
        setPdfFile(file);
        setFormData({ ...formData, pdf: file });

        // Limpiar errores si existen
        if (fieldErrors.pdf) {
          setFieldErrors({ ...fieldErrors, pdf: false });
          setError("");
        }

      } else {
        // Si no se selecciona ningún archivo, limpiamos el estado
        setPdfFile(null);
        setFormData({ ...formData, pdf: null });
        if (fieldErrors.pdf) {
          setFieldErrors({ ...fieldErrors, pdf: false });
          setError("");
        }
      }
    } else {
      setFormData({ ...formData, [name]: value });
      // Limpiar error si el campo se corrige
      if (fieldErrors[name]) {
        setFieldErrors({ ...fieldErrors, [name]: false });
      }
    }
  };

/*
Autor: Abraham Avarado Gutierrez
Fecha: 2-3-25
Descripción:Valida que el formulario de recepción, no tenga campos incompletos
*/
  const validarCampos = () => {
    const defaultSelectValue = ""; // Valor predeterminado para selectores (Selecciona Área)
    const defaultBooleanValue = "1"; // Valor predeterminado para Leyenda y Urgente
    const errors = {};

    // Verificar campos de texto (no pueden estar vacíos)
    if (!formData.fecha.trim()) errors.fecha = true;
    if (!formData.referencia.trim()) errors.referencia = true;
    if (!formData.cargo.trim()) errors.cargo = true;
    if (!formData.remitente.trim()) errors.remitente = true;
    if (!formData.procedencia.trim()) errors.procedencia = true;
    if (!formData.fechaOficio.trim()) errors.fechaOficio = true;
    if (!formData.indicacion.trim()) errors.indicacion = true;

    // Verificar campo de selección Atención (no puede ser el valor predeterminado)
    if (formData.atencion === defaultSelectValue) errors.atencion = true;

    if (!formData.asunto.trim()) errors.asunto = true;

    // Verificar Copia 1 (si está seleccionado, debe ser diferente a "Selecciona Área")
    if (formData.copia1 === defaultSelectValue) {
      setFormData({ ...formData, copia2: "", copia3: "" }); // Resetear Copia 2 y 3 si Copia 1 está vacío
    }

    // Verificar PDF (opcional, pero si se sube, debe ser un PDF y no exceder 5MB)
    if (pdfFile) {
      if (!pdfFile.type.includes("application/pdf")) {
        errors.pdf = true;
      }
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB en bytes
      if (pdfFile.size > maxSizeInBytes) {
        errors.pdf = true;
      }
    }

    // Si hay errores, actualizar fieldErrors y mostrar mensaje
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      const errorMessages = Object.keys(errors).map((key) => {
      switch (key) {
        case "fecha":
        return "El campo Fecha es obligatorio.";
        case "referencia":
        return "El campo Referencia es obligatorio.";
        case "cargo":
        return "El campo Cargo es obligatorio.";
        case "remitente":
        return "El campo Remitente es obligatorio.";
        case "procedencia":
        return "El campo Procedencia es obligatorio.";
        case "fechaOficio":
        return "El campo Fecha y No. de Oficio es obligatorio.";
        case "indicacion":
        return "El campo Indicación es obligatorio.";
        case "asunto":
        return "El campo Asunto es obligatorio.";
        case "atencion":
        return "Debes seleccionar un área en el campo Atención.";
        case "pdf":
        return pdfFile && !pdfFile.type.includes("application/pdf")
          ? "El archivo subido debe ser un PDF."
          : "El archivo no debe exceder 5MB.";
        default:
        return "";
      }
      });

      setModalMessage(
      <ul>
        {errorMessages.map((message, index) => (
        <li key={index}>{message}</li>
        ))}
      </ul>
      );
      setModalVariant("danger");
      setShowModal(true);
      return true; // Indica que hay errores
    }

    setError(""); // Limpia el mensaje de error si todo es válido
    setFieldErrors({}); // Limpia los errores de campos
    return false; // No hay errores
  };

  // Enviar el formulario al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validarCampos()) {
      return; // No envía el formulario si hay errores
    }

    // Crear un FormData para enviar los datos y el archivo al backend
    const data = new FormData();
    data.append("fecha", formData.fecha);
    data.append("referencia", formData.referencia);
    data.append("cargo", formData.cargo);
    data.append("remitente", formData.remitente);
    data.append("procedencia", formData.procedencia);
    data.append("fechaOficio", formData.fechaOficio);
    data.append("indicacion", formData.indicacion);
    data.append("atencion", formData.atencion);
    data.append("asunto", formData.asunto);
    data.append("copia1", formData.copia1);
    data.append("copia2", formData.copia2);
    data.append("copia3", formData.copia3);
    data.append("leyenda", formData.leyenda);
    data.append("urgente", formData.urgente);
    if (pdfFile) {
      data.append("pdf", pdfFile);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/recepcion", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Formulario enviado exitosamente:", response.data);
      setModalMessage("Formulario enviado exitosamente");
      setModalVariant("success");
      setShowModal(true);
      
      // Resetear el formulario después de enviar
      setFormData({
        fecha: "",
        referencia: "",
        cargo: "",
        remitente: "",
        procedencia: "",
        fechaOficio: "",
        indicacion: "",
        atencion: "",
        asunto: "",
        copia1: "",
        copia2: "",
        copia3: "",
        pdf: null,
        leyenda: "1",
        urgente: "1",
      });
      setPdfFile(null);
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      setModalMessage("Error al enviar el formulario. Intenta de nuevo.");
      setModalVariant("danger");
      setShowModal(true);
    }
  };

// Estilo condicional para campos con errores
//  const getInputStyle = (fieldName) => ({
//    borderColor: fieldErrors[fieldName] ? "red" : "#007bff",
//  });


// Autor : Miguel Angel Montoya Bautista
// Fecha : 15-3-25
// Descripcion: Función que hace la petición post para subir el archivo al servidor y posteriormente retornar el nombre del archivo
// FALTA AGREGAR LA LOGICA DE COMO SE MANEJARA EL NOMBRE DEL ARCHIVO : recibo_YY-MM-DD_00000
  const subirArchivo = async (archivo) => {
    try {
        const formPdf = new FormData();
        formPdf.append("pdf", archivo);

        const response = await axios.post("http://127.0.0.1:8000/subirArchivo", formPdf, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return response.data.nombre_archivo; // Devuelve el nombre del archivo
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        throw error;
    }
};

// Autor : Miguel Angel Montoya Bautista
// Fecha : 9-3-25
// Descripcion: Función que hace la petición post para insertar y guardar un nuevo recibo como en base de datos
const enviarRecibo = async (e) => {
  e.preventDefault();
  const idUsuario = localStorage.getItem("id_user");

  if (!idUsuario) {
    //console.error("ID de usuario no encontrado en localStorage");
    //setError("Usuario no autenticado");
    setModalMessage("Usuario no autenticado");
    setModalVariant("danger");
    setShowModal(true);
    return;
  }

  if (validarCampos()) {
    return; // No envía el formulario si hay errores
  }

  try {
    // Subir el archivo primero (si existe)
    let nombreArchivo = null;
    if (formData.pdf) {
      nombreArchivo = await subirArchivo(formData.pdf);
    }

    // Crear un objeto con los datos del formulario
    const datosParaEnviar = {
      ...formData,
      nombre_archivo: nombreArchivo,
      fk_usuario_registra: idUsuario,
    };

    // Enviar los datos del formulario como JSON
    const { pdf, ...datosSinPdf } = datosParaEnviar;

    const response = await axios.post(
      "http://127.0.0.1:8000/registrarRecibo",
      datosSinPdf,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    console.log("Respuesta del servidor:", response.data);
    setError(""); // Limpiar errores
    setModalMessage("Recibo insertado correctamente");
    setModalVariant("success");
    setShowModal(true);

    // Resetear el formulario después de enviar
    setFormData({
      fecha: "",
      referencia: "",
      cargo: "",
      remitente: "",
      procedencia: "",
      fechaOficio: "",
      indicacion: "",
      atencion: "",
      asunto: "",
      copia1: "",
      copia2: "",
      copia3: "",
      pdf: null,
      leyenda: "1",
      urgente: "1",
    });
    setPdfFile(null);
  } catch (error) {
    console.error("Error al enviar el recibo:", error);
    setModalMessage("Error al enviar el recibo");
    setModalVariant("danger");
    setShowModal(true);
  }
};

  // Estilo condicional para campos con errores
  const getInputStyle = (fieldName) => ({
    borderColor: fieldErrors[fieldName] ? "red" : "#007bff",
  });

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center bg-dark text-white p-2 rounded">
            Registro de Correspondencia Jefatura Alcaldía Cuauhtémoc
          </h2>
        </Col>
      </Row>

      <Form onSubmit={enviarRecibo}>
        {error && (
          <Row className="mb-3">
            <Col>
              <Alert variant="danger">{error}</Alert>
            </Col>
          </Row>
        )}

        <Table  style={{ backgroundColor: "white" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <Form.Group controlId="fecha">
                  <Form.Label>Fecha:</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    style={getInputStyle("fecha")}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="referencia">
                  <Form.Label>Referencia:</Form.Label>
                  <Form.Control
                    type="text"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    style={getInputStyle("referencia")}
                  />
                </Form.Group>
              </td>
              </tr>
              <tr>
              <td>
                <Form.Group controlId="cargo">
                  <Form.Label>Cargo:</Form.Label>
                  <Form.Control
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    style={getInputStyle("cargo")}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="remitente">
                  <Form.Label>Remitente:</Form.Label>
                  <Form.Control
                    type="text"
                    name="remitente"
                    value={formData.remitente}
                    onChange={handleChange}
                    style={getInputStyle("remitente")}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
            <td colSpan={2}>
                <Form.Group controlId="procedencia">
                  <Form.Label>Procedencia:</Form.Label>
                  <Form.Control
                    type="text"
                    name="procedencia"
                    value={formData.procedencia}
                    onChange={handleChange}
                    style={getInputStyle("procedencia")}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Form.Group controlId="fechaOficio">
                  <Form.Label>Fecha y No. de Oficio:</Form.Label>
                  <Form.Control
                    type="text"
                    name="fechaOficio"
                    value={formData.fechaOficio}
                    onChange={handleChange}
                    style={getInputStyle("fechaOficio")}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Form.Group controlId="indicacion">
                  <Form.Label>Indicación:</Form.Label>
                  <Form.Control
                    type="text"
                    name="indicacion"
                    value={formData.indicacion}
                    onChange={handleChange}
                    style={getInputStyle("indicacion")}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Form.Group controlId="atencion">
                  <Form.Label>Atención:</Form.Label>
                  <Form.Select
                    name="atencion"
                    value={formData.atencion}
                    onChange={handleChange}
                    style={getInputStyle("atencion")}
                  >
                    <option value="">Selecciona Área</option>
                    {areas.length > 0 ? (
                      areas.map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.nombre}
                        </option>
                      ))
                      ) : (
                      <option disabled>Cargando áreas...</option>
                      )}
                  </Form.Select>
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Form.Group controlId="asunto">
                  <Form.Label>Asunto:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="asunto"
                    value={formData.asunto}
                    onChange={handleChange}
                    style={getInputStyle("asunto")}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Group controlId="copia1">
                <Form.Label>Seleccione copia para el areá</Form.Label>
                <Form.Select
                  name="copia1"
                  value={formData.copia1}
                  onChange={handleChange}
                  style={{ width: "100%", padding: "10px" }}
                >
                  <option value="">Selecciona Área</option>
                  {areas.length > 0 ? (
                    areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombre}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando áreas...</option>
                  )}
                </Form.Select>
              </Form.Group>
              </td>
              {formData.copia1 && formData.copia1 !== "" && (
                <td>
                  <Form.Group controlId="copia2">
                    <Form.Label>Copia 2 para:</Form.Label>
                    <Form.Select
                      name="copia2"
                      value={formData.copia2}
                      onChange={handleChange}
                      style={getInputStyle("copia2")}
                    >
                      <option value="">Selecciona Área</option>
                      {areas.length > 0 ? (
                    areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombre}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando áreas...</option>
                  )}
                    </Form.Select>
                  </Form.Group>
                </td>
              )}
            </tr>
            {formData.copia2 && formData.copia2 !== "" && (
              <tr>
                <td colSpan={2}>
                  <Form.Group controlId="copia3">
                    <Form.Label>Copia 3 para:</Form.Label>
                    <Form.Select
                      name="copia3"
                      value={formData.copia3}
                      onChange={handleChange}
                      style={getInputStyle("copia3")}
                    >
                      <option value="">Selecciona Área</option>
                      {areas.length > 0 ? (
                    areas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.nombre}
                      </option>
                    ))
                  ) : (
                    <option disabled>Cargando áreas...</option>
                  )}
                    </Form.Select>
                  </Form.Group>
                </td>
              </tr>
            )}
            <tr>
              <td colSpan={2}>
                <Form.Group controlId="pdf">
                  <Form.Label>Subir PDF:</Form.Label>
                  <Form.Control
                    type="file"
                    name="pdf"
                    accept="application/pdf"
                    onChange={handleChange}
                    style={getInputStyle("pdf")}
                  />
                  {pdfFile && <p>Archivo seleccionado: {pdfFile.name}</p>}
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Group controlId="leyenda">
                  <Form.Label>Leyenda:</Form.Label>
                  <Form.Select
                    name="leyenda"
                    value={formData.leyenda}
                    onChange={handleChange}
                    style={getInputStyle("leyenda")}
                  >
                    <option value="1">Sí</option>
                    <option value="2">No</option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="urgente">
                  <Form.Label>Urgente:</Form.Label>
                  <Form.Select
                    name="urgente"
                    value={formData.urgente}
                    onChange={handleChange}
                    style={getInputStyle("urgente")}
                  >
                    <option value="1">No</option>
                    <option value="2">Sí</option>
                    <option value="3">Extra</option>
                  </Form.Select>
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td colSpan={2} className="text-center">
                <Button variant="primary" type="submit" className="mt-3">
                  Enviar
                </Button>
              </td>
            </tr>
          </tbody>
        </Table>
      </Form>

      {/* Modal para notificaciones */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notificación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className={`text-${modalVariant}`}>{modalMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant={modalVariant} onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default Recepcion;