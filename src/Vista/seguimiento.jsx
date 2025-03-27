// src/Vista/seguimiento.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Table, Button, Modal } from "react-bootstrap";

import jsPDF from 'jspdf';
  import 'jspdf-autotable';

// MODALES O COMPONENTES
import ModalModificar from "./Modales/modalModificar.jsx"; // Ajusta la ruta según tu estructura de carpetas
import ModalRespuesta from "./Modales/modalRespuesta.jsx"; // Ajusta la ruta según tu estructura de carpetas
import LogoAlcaldia from "./Utils/Images/Logo_AC.png";
import LogoAlcaldia2 from "./Utils/Images/Logo_AC02.png";

// Definimos months y years fuera del componente para evitar cambios en la referencia
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const years = ["2025", "2026", "2027"];

const Seguimiento = () => {
  // Estado para los filtros
  const [filters, setFilters] = useState({
    month: "",
    year: "",
    volante: "",
  });

  const [allData, setAllData] = useState([]); // Reemplaza los datos en crudo con un estado dinámico

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
    console.log("haciendo petición de busquea con valores \n");
    console.log(filters);
    console.log("\n");
    try {
      const response = await axios.post("http://127.0.0.1:8000/buscarRegistros", {
        year: filters.year,
        month: filters.month,
        volante: filters.volante,
      });

      if (response.status === 200) {
        console.log(response.data);
        setFilteredData(response.data); // Actualizar allData con los registros obtenidos
      } else {
        throw new Error("Error al obtener los registros");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Hubo un error al obtener los registros");
    }
  };

  // Estado para los datos filtrados (inicia vacío)
  const [filteredData, setFilteredData] = useState([]);

  // Datos de ejemplo (puedes reemplazar con datos de una API)
  /*const allData = [
    {
      id_registro: 1, // Nuevo campo
      fecha: "24/02/2025",
      referencia: "4569",
      remitente: "Eva Yael Reinosa Sánchez",
      cargo: "Directora General de Desarrollo y Bienestar",
      noOficio: "AC/RMSG/00013/2025",
      dependencia: "DGDB",
      turnado: "Desarrollo y Bienestar",
      instruccion: "ASISTIR Y DAR SEGUIMIENTO",
      volante: "259874",
    },
    {
      id_registro: 2, // Nuevo campo
      fecha: "24/02/2025",
      referencia: "521",
      remitente: "abhtzir reynoso",
      cargo: "abhtzir reynoso",
      noOficio: "AC/RMSG/00001/2025",
      dependencia: "DRMSG",
      turnado: "Desarrollo y Bienestar",
      instruccion: "ASISTIR Y DAR SEGUIMIENTO",
      volante: "4521",
    },
    // Otros registros...
  ];*/

  const [areas, setAreas] = useState([]); // Estado para las áreas
  const [showModalModificar, setShowModalModificar] = useState(false); // Estado para el modal de modificar
  const [showModalRespuesta, setShowModalRespuesta] = useState(false); // Estado para el modal de respuesta
  const [showModalOficio, setShowModalOficio] = useState(false); // Estado para el modal de oficio
  const [selectedPdfFileName, setSelectedPdfFileName] = useState(""); // Estado para el nombre del archivo PDF
  const [selectedRecord, setSelectedRecord] = useState(null); // Registro seleccionado para modificar o responder
  const [formData, setFormData] = useState({
    fecha: "",
    referencia: "",
    cargo: "",
    remitente: "",
    procedencia: "",
    fechaOficio: "",
    indicacion: "",
    atencion: "",
    atencion_valor: "", // Añadido para manejar el ID del área
    asunto: "",
    copia1: "",
    copia2: "",
    copia3: "",
    pdf: null,
    nombre_archivo: "", // Añadido para manejar el nombre del archivo PDF existente
    leyenda: "1",
    urgente: "1",
  });
  const [pdfFile, setPdfFile] = useState(null); // Estado para el archivo PDF

  // Cargar áreas desde el backend
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/areas", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAreas(response.data);
      } catch (error) {
        console.error("Error al obtener las áreas:", error);
        alert("No se pudieron cargar las áreas. Intenta de nuevo.");
      }
    };

    fetchAreas();
  }, []);

  // Filtrar datos cuando cambian los filtros
  useEffect(() => {
    if (filters.month && filters.year) {
      const filtered = allData.filter((item) => {
        const [day, month, year] = item.fecha.split("/");
        const monthName = months[parseInt(month, 10) - 1]; // Convertir número de mes a nombre
        return monthName === filters.month && year === filters.year;
      });
      setFilteredData(filtered);
    } else if (filters.volante) {
      const filtered = allData.filter((item) =>
        item.volante.includes(filters.volante)
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [filters, allData]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      const file = files[0];
      if (file) {
        setPdfFile(file);
        setFormData({ ...formData, pdf: file, nombre_archivo: file.name });
      } else {
        setPdfFile(null);
        setFormData({ ...formData, pdf: null, nombre_archivo: formData.nombre_archivo });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getInputStyle = (fieldName) => ({
    borderColor: "#007bff", // Estilo por defecto
  });

  // Agrega este estado al inicio de tu componente
const [respuestasData, setRespuestasData] = useState([]);
  const handleAction = async (action, item) => {
    switch (action) {
      case "oficio":
        // Establecer el nombre del archivo PDF y abrir el modal
        setSelectedPdfFileName(item.nombre_archivo || "");
        setShowModalOficio(true);
        break;
  
      case "imprimir":
        generatePDF(item); // Llamamos a la función para generar el PDF
        break;
  
      case "modificar":
        console.log("ID Registro enviado:", item.id_registro);
        try {
          const response = await axios.post(
            "http://127.0.0.1:8000/modificarObtenerInfo",
            {
              id_registro: item.id_registro // Enviamos el id_registro
            }
          );
  
          if (response.status === 200) {
            console.log("Esta es la información del registro \n");
            console.log(response.data);
            const data = response.data;
            // Actualizar formData con los datos del backend
            setFormData({
              fecha: data.fecha || "",
              referencia: data.referencia || "",
              cargo: data.cargo || "",
              remitente: data.remitente || "",
              procedencia: data.dependencia || "",
              fechaOficio: data.noOficio || "",
              indicacion: data.instruccion || "",
              atencion: data.turnado || "", // Nombre del área (para mostrar)
              atencion_valor: data.atencion_valor || "", // ID del área (para el select)
              copia1: data.copia_para ? String(data.copia_para) : "", // Convertir a string
              copia2: data.copia_para2 ? String(data.copia_para2) : "", // Convertir a string
              copia3: data.copia_para3 ? String(data.copia_para3) : "", // Convertir a string
              pdf: null, // No cargamos el archivo, solo el nombre
              nombre_archivo: data.nombre_archivo || "", // Nombre del archivo existente
              leyenda: String(data.leyenda) || "1", // Convertir a string
              urgente: String(data.nivel_prioridad) || "1", // Convertir a string
            });
            setShowModalModificar(true);
          } else {
            throw new Error("Error al obtener los datos del registro");
          }
        } catch (error) {
          console.error("Error:", error);
  
          // Mostrar detalles del error 422
          if (error.response && error.response.status === 422) {
            console.error("Detalles del error 422:", error.response.data);
          }
  
          alert("Hubo un error al obtener los datos del registro");
        }
  
        // Cargar los datos del registro seleccionado en el formulario
      //  setSelectedRecord(item);
      //  setFormData({
      //    fecha: item.fecha,
      //    referencia: item.referencia,
      //    cargo: item.cargo,
      //    remitente: item.remitente,
      //    procedencia: item.dependencia,
      //    fechaOficio: item.noOficio,
      //    indicacion: item.indicacion,
      //    atencion: item.atencion, // Esto debería mapearse al ID del área si tienes un mapeo
      //    asunto: "", // Ajusta según los datos reales
      //    copia1: "",
      //    copia2: "",
      //    copia3: "",
      //    pdf: null,
      //    leyenda: "1",
      //    urgente: "1",
      //  });
      //  setShowModalModificar(true);
      //  break;
      case "respuesta":
        try {
          console.log("Consultando respuestas para recibo:", item.id_registro);
          
          const idUsuarioCifrado = localStorage.getItem('id_user');
    
          const response = await axios.post(
            "http://127.0.0.1:8000/consultarRespuestas",
            { 
              id_registro: item.id_registro,
              id_usuario: idUsuarioCifrado
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
    
          console.log("Respuesta del backend:", response.data);
    
          const respuestasParaModal = (response.data?.respuestas || []).map(resp => ({
            id: resp.id || 0,
            respuesta: resp.respuesta || "[Sin texto]",
            fecha: resp.fecha ? new Date(resp.fecha).toLocaleDateString('es-MX', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            }) : "Sin fecha",
            adjunto: resp.archivo || null,
            es_mio: resp.es_propietario || false
          }));
    
          setRespuestasData(respuestasParaModal);
          setSelectedRecord(item);
          setShowModalRespuesta(true);
    
        } catch (error) {
          console.error("Error al obtener respuestas:", error);
          setRespuestasData([]);
          setShowModalRespuesta(true);
          
          const errorMessage = error.response?.data?.detail || 
                              error.message || 
                              "Error al cargar respuestas";
          alert(errorMessage);
        }
        break;
  
      default:
        break;
    }
  };

  const generatePDF = (item) => {
      const doc = new jsPDF();
  
      // Tamaño de los logos (ajusta según sea necesario)
      const logoWidth = 25; // Aumentamos el tamaño de los logos
      const logoHeight = 25;
  
      // Agregar los logos en el encabezado
      doc.addImage(LogoAlcaldia, 'PNG', 10, 10, logoWidth, logoHeight); // Logo a la izquierda
      doc.addImage(LogoAlcaldia2, 'PNG', doc.internal.pageSize.width - 10 - logoWidth, 10, logoWidth, logoHeight); // Logo a la derecha
  
      // Centrar el texto entre los dos logos
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      const text = "Coordinación General de Desarrollo y Buena Administración";
      const textWidth = doc.getTextWidth(text);
      const centerX = (doc.internal.pageSize.width - textWidth) / 2;
      doc.text(text, centerX, 20 + logoHeight / 2); // Ajustar la posición vertical del texto
  
      doc.setFontSize(12);
      const text2 = "Volante de Correspondencia";
      const textWidth2 = doc.getTextWidth(text2);
      const centerX2 = (doc.internal.pageSize.width - textWidth2) / 2;
      doc.text(text2, centerX2, 30 + logoHeight / 2); // Ajustar la posición vertical del texto
  
      // Información del Volante (etiquetas en negritas, variables en texto normal)
      let yOffset = 20 + logoHeight; // Posición inicial después del encabezado
  
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("Fecha:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.fecha}`, 40, yOffset); // Ajustar la posición del valor
  
      yOffset += 8; // Reducir el interlineado
      doc.setFont('helvetica', 'bold');
      doc.text("Volante:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.volante}`, 40, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Referencia:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.referencia}`, 40, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Atención:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.titular_atencion}`, 40, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Cargo:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.cargo}`, 40, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Remitente:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.remitente}`, 40, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Cargo del Remitente:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.cargo}`, 60, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Procedencia:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.dependencia}`, 40, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Fecha y No. de Oficio:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.noOficio}`, 60, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Asunto:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.asunto}`, 40, yOffset);
  
      yOffset += 8;
      doc.setFont('helvetica', 'bold');
      doc.text("Indicación:", 10, yOffset);
      doc.setFont('helvetica', 'normal');
      doc.text(`${item.indicacion}`, 40, yOffset);
  
      // Definir yOffset fuera del bloque if
      yOffset += 16; // Espacio adicional antes de las copias
  
      // Agregar las copias para, si las 3 copia_para están vacías no poner el campo C.C.P:
      if (item.copia_para || item.copia_para2 || item.copia_para3) {
          doc.setFont('helvetica', 'bold');
          doc.text("C.C.P:", 10, yOffset);
          yOffset += 8; // Incrementar la posición para las copias
  
          if (item.copia_para) {
              doc.setFont('helvetica', 'normal');
              doc.text(`- ${item.copia_para_nombre} (${item.titular_copia_para})`, 10, yOffset);
              yOffset += 8; // Incrementar la posición para la siguiente copia
          }
          if (item.copia_para2) {
              doc.setFont('helvetica', 'normal');
              doc.text(`- ${item.copia_para2_nombre} (${item.titular_copia_para2})`, 10, yOffset);
              yOffset += 8; // Incrementar la posición para la siguiente copia
          }
          if (item.copia_para3) {
              doc.setFont('helvetica', 'normal');
              doc.text(`- ${item.copia_para3_nombre} (${item.titular_copia_para3})`, 10, yOffset);
              yOffset += 8; // Incrementar la posición para la siguiente copia
          }
      }
  
      // Validar si el valor de leyenda es 1 o 2
      if (item.leyenda === "1" || item.leyenda === "2") {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'normal');
          doc.text("GVS ORNELAS", 10, yOffset + 10); // Ajustar la posición según sea necesario
          yOffset += 16; // Incrementar la posición para la firma
      }
  
      // Firma y cargo (centrado y en negritas)
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text("ATENTAMENTE", doc.internal.pageSize.width / 2, yOffset + 20, { align: 'center' }); // Centrado
      doc.text("Sergio Alfredo Chávez López", doc.internal.pageSize.width / 2, yOffset + 30, { align: 'center' }); // Centrado
      doc.setFont('helvetica', 'normal');
      doc.text("Coordinador General de Planeación del Desarrollo y Buena Administración", doc.internal.pageSize.width / 2, yOffset + 40, { align: 'center' }); // Centrado
  
      // Guardar el PDF
      doc.save(`volante_${item.volante}.pdf`);
  };

  
  // Función para manejar el envío del formulario del modal de respuesta
  const handleRespuestaSubmit = async (data) => {
    if (!selectedRecord) return;
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("id_registro", selectedRecord.id_registro);
      formDataToSend.append("respuesta", data.respuesta);
      if (data.pdf) {
        formDataToSend.append("pdf", data.pdf);
      }
      const response = await axios.post("http://127.0.0.1:8000/guardarRespuesta", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        alert("Respuesta guardada exitosamente");
        // Opcional: Actualizar la tabla después de guardar
        handleSearch();
      } else {
        throw new Error("Error al guardar la respuesta");
      }
    } catch (error) {
      console.error("Error al guardar la respuesta:", error);
      alert("Hubo un error al guardar la respuesta");
    }
  }

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">
            Selecciona mes y año para seguimiento en la Base de Datos
          </h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={4} sm={12} className="mb-3">
          <Form.Group controlId="monthFilter">
            <Form.Label>Selecciona mes:</Form.Label>
            <Form.Select
              name="month"
              value={filters.month}
              onChange={handleFilterChange}
            >
              <option value="">Selecciona un mes</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4} sm={12} className="mb-3">
          <Form.Group controlId="yearFilter">
            <Form.Label>Selecciona año:</Form.Label>
            <Form.Select
              name="year"
              value={filters.year}
              onChange={handleFilterChange}
            >
              <option value="">Selecciona un año</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        <Col md={4} sm={12} className="mb-3">
          <Form.Group controlId="volanteFilter">
            <Form.Label>Buscar por Volante:</Form.Label>
            <Form.Control
              type="text"
              name="volante"
              value={filters.volante}
              onChange={handleFilterChange}
            />
          </Form.Group>
        </Col>

        <Col md={12} className="text-center">
          <Button variant="primary" className="w-20" onClick={handleSearch}>
            Buscar
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Referencia</th>
                <th>Remitente</th>
                <th>Cargo</th>
                <th>No. de Oficio</th>
                <th>Dependencia</th>
                <th>Turnado a</th>
                <th>Instrucción</th>
                <th>Volante</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.fecha}</td>
                    <td>{item.referencia}</td>
                    <td>{item.remitente}</td>
                    <td>{item.cargo}</td>
                    <td>{item.noOficio}</td>
                    <td>{item.dependencia}</td>
                    <td>{item.atencion}</td>
                    <td>{item.indicacion}</td>
                    <td>{item.volante}</td>
                    <td>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAction("oficio", item)}
                      >
                        Oficio
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAction("imprimir", item)}
                      >
                        Imprimir
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={() => handleAction("modificar", item)}
                      >
                        Modificar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleAction("respuesta", item)}
                      >
                        Respuesta
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center">
                    Selecciona mes y año o busca por volante para mostrar los registros.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>

      {/* Modal para modificar */}
      <ModalModificar
        show={showModalModificar}
        onHide={() => setShowModalModificar(false)}
        formData={formData}
        handleChange={handleChange}
        enviarRecibo={() => alert("Envío manejado por el backend")} // Placeholder
        getInputStyle={getInputStyle}
        areas={areas}
        pdfFile={pdfFile}
        isEditing={true}
        onUpdate={() => alert("Actualización manejada por el backend")} // Placeholder
      />

      {/* Modal para vista previa del PDF */}
          <Modal
        show={showModalOficio}
        onHide={() => setShowModalOficio(false)}
        size="lg"
        centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Vista Previa del Oficio</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedPdfFileName ? (
                <iframe
                    src={`http://127.0.0.1:8000/obtenerPdf/${selectedPdfFileName}`} // Ruta del backend para obtener el PDF
                    style={{ width: "100%", height: "500px" }}
                    title="Vista previa del PDF"
                />
            ) : (
                <p>No se encontró el archivo PDF para este registro.</p>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModalOficio(false)}>
                Cerrar
            </Button>
        </Modal.Footer>
    </Modal>

    {/* Modal para respuesta */}
      <ModalRespuesta
        show={showModalRespuesta}
        onHide={() => setShowModalRespuesta(false)}
        onSubmit={handleRespuestaSubmit}
        respuestasPrevias={respuestasData}
        selectedRecord={selectedRecord} // Pasar el registro completo
      />
    </Container>
  );
};

export default Seguimiento;