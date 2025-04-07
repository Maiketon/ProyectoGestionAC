// src/Vista/seguimiento.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Table, Button, Modal } from "react-bootstrap";

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// MODALES O COMPONENTES
import GlobalModal from "./Modales/globalModal.jsx"; // Ajusta la ruta según tu estructura
import ModalModificar from "./Modales/modalModificar.jsx"; // Ajusta la ruta según tu estructura de carpetas
import ModalRespuesta from "./Modales/modalRespuesta.jsx"; // Ajusta la ruta según tu estructura de carpetas
import LogoAlcaldia from "./Utils/Images/Logo_AC.jpg";
import LogoAlcaldia2 from "./Utils/Images/Logo_AC02.jpg";

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

  // Estado para el error de formato del volante
  const [volanteError, setVolanteError] = useState("");

  // Estado para el modal de validación de mes/año
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState(""); // Nuevo estado para el mensaje dinámico del modal

  // Estado para el modal global
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [globalModalMessage, setGlobalModalMessage] = useState("");
  const [globalModalType, setGlobalModalType] = useState("info");

  const [allData, setAllData] = useState([]); // Reemplaza los datos en crudo con un estado dinámico

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });

    // Validar el formato del volante cuando cambia
    if (name === "volante") {
      const volantePattern = /^\d{5}$/; // Expresión regular para 5 dígitos exactos
      if (value && !volantePattern.test(value)) {
        setVolanteError("El volante debe tener exactamente 5 dígitos numéricos (por ejemplo, 12345)");
      } else {
        setVolanteError("");
      }
    }
  };

  const handleSearch = async () => {
    // Validar si no se ha seleccionado mes ni año
    if (!filters.month && !filters.year) {
      setGlobalModalMessage("Debe de seleccionar el campos mes y el campo año");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
      return; // No continuar con la búsqueda
    }
  
    // Validación: Si el campo "mes" está informado, también debe de seleccionar el campo "año"
    if (filters.month && !filters.year) {
      setGlobalModalMessage("Al elegir el mes, también debe de seleccionar el año");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
      return; // No continuar con la búsqueda
    }
  
    // Validación: Si el campo "año" está informado, también debe de seleccionar el campo "mes"
    if (filters.year && !filters.month) {
      setGlobalModalMessage("Al elegir el año, también debe de seleccionar el mes");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
      return; // No continuar con la búsqueda
    }
  
    // Validación: Si el campo "volante" está informado, debe de informar los campos "mes" y "año"
    if (filters.volante && (!filters.month || !filters.year)) {
      setGlobalModalMessage("Si ingresa un volante, debe de seleccionar mes y año");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
      return; // No continuar con la búsqueda
    }
    
    // Validar el formato del volante
    const volantePattern = /^\d{5}$/;
    if (filters.volante && !volantePattern.test(filters.volante)) {
      setVolanteError("El volante debe tener exactamente 5 dígitos numéricos (por ejemplo, 12345)");
      return; // No continuar con la búsqueda si el formato es incorrecto
    }
  
    // Validar si hay un valor en "volante" pero no se seleccionó mes ni año
    if (filters.volante && (!filters.month || !filters.year)) {
      setGlobalModalMessage("Falta seleccionar mes/año");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
      return; // No continuar con la búsqueda
    }
  
    console.log("haciendo petición de busquea con valores \n");
    console.log(filters);
    console.log("\n");
    const idTipoUsuarioCifrado = localStorage.getItem('type_user');
    const idUsuarioCifrado = localStorage.getItem('id_user');
    try {
      console.log("enviando al back los valores para buscar registros", filters.year,filters.month,filters.volante,idTipoUsuarioCifrado,idUsuarioCifrado)
      const response = await axios.post("http://127.0.0.1:8000/buscarRegistros", {
        year: filters.year,
        month: filters.month,
        volante: filters.volante,
        tipoUsuario: idTipoUsuarioCifrado,
        id_usuario: idUsuarioCifrado
      });
  
      if (response.status === 200) {
        console.log(response.data);
        setFilteredData(response.data); // Actualizar filteredData con los registros obtenidos
        // Validación adicional: si no hay datos, mostrar el modal
        if (response.data.length === 0) {
          setGlobalModalMessage("No hay información para el período seleccionado.");
          setGlobalModalType("warning");
          setShowGlobalModal(true);
        }
      } else {
        throw new Error("Error al obtener los registros");
      }
    } catch (error) {
      console.error("Error:", error);
      setGlobalModalMessage(error.response?.data?.detail || "Hubo un error al obtener los registros. Favor de contactar con el área de la Subdirección de Informática.");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
    }
  };
  
  // Estado para los datos filtrados (inicia vacío)
  const [filteredData, setFilteredData] = useState([]);

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
        setGlobalModalMessage("No se pudieron cargar las áreas. Favor de contactar con el área de la Subdirección de Informática.");
        setGlobalModalType("warning");
        setShowGlobalModal(true);
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
  const handleAction = async (action, item, e) => {
    e.stopPropagation(); // Detener la propagación del evento

    // Depurar la acción que se está ejecutando
    console.log("Acción ejecutada:", action);
    console.log("Estado inicial - showModalModificar:", showModalModificar);
    console.log("Estado inicial - showModalRespuesta:", showModalRespuesta);

    // Asegurarse de que solo un modal esté abierto a la vez
    if (action === "modificar") {
      setShowModalRespuesta(false); // Cerrar el modal de respuesta si está abierto
    } else if (action === "respuesta") {
      setShowModalModificar(false); // Cerrar el modal de modificar si está abierto
    }

    switch (action) {
      case "oficio":
        console.log("Abriendo modal de oficio...");
        // Establecer el nombre del archivo PDF y abrir el modal
        setSelectedPdfFileName(item.nombre_archivo || "");
        setShowModalOficio(true);
        break;
  
      case "imprimir":
        console.log("Generando PDF...", item);
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
            console.log("Abriendo modal de modificar...");
            setShowModalModificar(true); 
          } else {
            throw new Error("Error al obtener los datos del registro. Favor de contactar con el área de la Subdirección de Informática.");
          }
        } catch (error) {
          console.error("Error en acción modificar:", error);
          // Mostrar detalles del error 422
          if (error.response && error.response.status === 422) {
            console.error("Detalles del error 422:", error.response.data);
          }
          setGlobalModalMessage("Hubo un error al obtener los datos del registro. Favor de contactar con el área de la Subdirección de Informática.");
          setGlobalModalType("warning");
          setShowGlobalModal(true);
        }
        break;
  
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
            fecha_captura: resp.fecha_captura || null, // Añadir fecha_captura
            fecha_respuesta: resp.fecha_respuesta || null, // Añadir fecha_respuesta
            adjunto: resp.archivo || null,
            es_mio: resp.es_propietario || false
          }));
    
          setRespuestasData(respuestasParaModal);
          setSelectedRecord(item);
          console.log("Abriendo modal de respuesta...");
          setShowModalRespuesta(true);
        } catch (error) {
          console.error("Error al obtener respuestas:", error);
          setRespuestasData([]);
          console.log("Abriendo modal de respuesta a pesar del error...");
          setShowModalRespuesta(true); // Abrir el modal incluso si hay un error, para que el usuario pueda interactuar
          setGlobalModalMessage(error.response?.data?.detail || "Error al cargar respuestas. Favor de contactar con el área de la Subdirección de Informática.");
          setGlobalModalType("warning");
          setShowGlobalModal(true);
        }
        break;
  
      default:
        break;
    }
    // Depurar el estado después de ejecutar la acción
    console.log("Acción ejecutada:", action);
    console.log("Estado final - showModalModificar:", showModalModificar);
    console.log("Estado final - showModalRespuesta:", showModalRespuesta);
  };

  const generatePDF = (item) => {
    const doc = new jsPDF();

    // Solución para fuentes (evitar errores con 'arial')
    const fontList = doc.getFontList();
    const availableFonts = Array.isArray(fontList) ? fontList : Object.keys(fontList);
    const defaultFont = availableFonts.includes('helvetica') ? 'helvetica' : availableFonts[0];

    // Obtener ancho y alto de la página
    const pageWidth = doc.internal.pageSize.getWidth ? doc.internal.pageSize.getWidth() : doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.getHeight ? doc.internal.pageSize.getHeight() : doc.internal.pageSize.height;

    // ======================
    // Imagen del encabezado
    // Queremos que ocupe la mitad del ancho
    const headerImageWidth = pageWidth / 2;
    const headerImageHeight = 25; // Ajusta según la proporción de la imagen
    // Posición: x=10 (o 0 si quieres sin margen), y=10
    doc.addImage(LogoAlcaldia, 'jpg', 10, 10, 65, 25);

    // Ajustar yOffset para dejar espacio debajo del encabezado
    let yOffset = 10 + headerImageHeight + 5;

    // Validar nivel de prioridad
    if (item.nivel_prioridad === 1 || item.nivel_prioridad === 2) {
        doc.setFontSize(14);
        doc.setFont(defaultFont, 'bold');
        const prioridadText = item.nivel_prioridad === 1 ? "URGENTE" : "EXTRA URGENTE";
        const textWidth = doc.getStringUnitWidth(prioridadText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
        const centerX = (pageWidth - textWidth) / 2;
        doc.text(prioridadText, centerX, yOffset);
        yOffset += 2;
    }

    // Texto del encabezado (centrado)
    doc.setFontSize(14);
    doc.setFont(defaultFont, 'bold');
    const text = "Coordinación General de Desarrollo y Buena Administración";
    const textWidth = doc.getStringUnitWidth(text) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const centerX = (pageWidth - textWidth) / 2;
    doc.text(text, centerX, yOffset + 5);

    doc.setFontSize(12);
    const text2 = "Volante de Correspondencia";
    const textWidth2 = doc.getStringUnitWidth(text2) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const centerX2 = (pageWidth - textWidth2) / 2;
    doc.text(text2, centerX2, yOffset + 10);

    // ======================
    // Información del Volante (alineado a la izquierda)
    // Imprimir Fecha, Volante y Referencia en la misma línea
    yOffset += 18;
    const col1X = 10;
    const col2X = 60;
    const col3X = 100;

    // Etiquetas en negrita
    doc.setFont(defaultFont, 'bold');
    doc.text("Fecha:", col1X, yOffset);
    doc.text("Volante:", col2X, yOffset);
    doc.text("Referencia:", col3X, yOffset);

    // Valores en normal, con un pequeño desplazamiento a la derecha
    const valueOffset = 25;
    doc.setFont(defaultFont, 'normal');
    doc.text(item.fecha || '', col1X + valueOffset, yOffset);
    doc.text(item.volante || '', col2X + valueOffset, yOffset);
    doc.text(item.referencia || '', col3X + valueOffset, yOffset);

    yOffset += 10; // Incrementamos el espacio entre líneas

    // Función auxiliar para imprimir etiqueta y valor en una línea
    const addLabeledText = (label, value, y) => {
        doc.setFont(defaultFont, 'bold');
        doc.text(`${label}:`, 10, y);
        doc.setFont(defaultFont, 'normal');
        doc.text(value, 55, y);
    };

    // Resto de la información
    addLabeledText("Atención", item.titular_atencion || '', yOffset);
    yOffset += 10;

    addLabeledText("Cargo", item.cargo || '', yOffset);
    yOffset += 10;

    // Se imprime Remitente y en la siguiente línea su Cargo para evitar sobreposición
    addLabeledText("Remitente", item.remitente || '', yOffset);
    yOffset += 10;
    addLabeledText("Cargo del Remitente", item.cargo_remitente || item.cargo || '', yOffset);
    yOffset += 10;

    addLabeledText("Procedencia", item.dependencia || '', yOffset);
    yOffset += 10;

    addLabeledText("Fecha y No. de Oficio", item.noOficio || '', yOffset);
    yOffset += 10;

    addLabeledText("Asunto", item.asunto || '', yOffset);
    yOffset += 10;

    addLabeledText("Indicación", item.indicacion || '', yOffset);
    yOffset += 10;

    // Copias para
    if (item.copia_para || item.copia_para2 || item.copia_para3) {
        doc.setFont(defaultFont, 'bold');
        doc.text("C.C.P:", 10, yOffset);
        yOffset += 10;

        doc.setFont(defaultFont, 'normal');
        if (item.copia_para) {
            doc.text(`- ${item.copia_para_nombre || ''} ${item.titular_copia_para ? `(${item.titular_copia_para})` : ''}`, 15, yOffset);
            yOffset += 10;
        }
        if (item.copia_para2) {
            doc.text(`- ${item.copia_para2_nombre || ''} ${item.titular_copia_para2 ? `(${item.titular_copia_para2})` : ''}`, 15, yOffset);
            yOffset += 10;
        }
        if (item.copia_para3) {
            doc.text(`- ${item.copia_para3_nombre || ''} ${item.titular_copia_para3 ? `(${item.titular_copia_para3})` : ''}`, 15, yOffset);
            yOffset += 10;
        }
    }

    // Leyenda central
    doc.setFontSize(10);
    const leyendaText = "Enviar nota informativa a esta coordinación sobre la atención brindada, para el desahogo del volante";
    const leyendaWidth = doc.getStringUnitWidth(leyendaText) * doc.internal.getFontSize() / doc.internal.scaleFactor;
    const leyendaX = (pageWidth - leyendaWidth) / 2;
    doc.setFont(defaultFont, 'bold');
    doc.text(leyendaText, leyendaX, yOffset + 8);

    // Firma y cargo (centrado)
    yOffset += 20; // Aumentamos el espacio antes de la firma
    doc.setFontSize(12);
    doc.setFont(defaultFont, 'bold');
    doc.text("ATENTAMENTE", pageWidth / 2, yOffset + 20, { align: 'center' });

    // Espacio para firma
    doc.text("_________________________", pageWidth / 2, yOffset + 15, { align: 'center' });

    // Nombre y cargo
    doc.text("Sergio Alfredo Chávez López", pageWidth / 2, yOffset + 30, { align: 'center' });
    doc.setFont(defaultFont, 'normal');
    doc.text("Coordinador General de Planeación", pageWidth / 2, yOffset + 38, { align: 'center' });
    doc.text("del Desarrollo y Buena Administración", pageWidth / 2, yOffset + 42, { align: 'center' });


    if (item.leyenda === 0 && item.apellido_usuario?.trim()) {
      yOffset += 50; // Espacio después de la firma
      doc.setFontSize(8);
      doc.setFont(defaultFont, 'bold');
      doc.text(item.apellido_usuario.trim(), 15, yOffset); // 15px desde la izquierda
    }
    // ======================
    // Imagen del pie de página
    // Queremos que abarque todo el ancho del renglón
    const footerImageHeight = 25; // Ajusta según la proporción de la imagen
    // La posición Y se coloca restando la altura deseada al alto total de la página
    doc.addImage(LogoAlcaldia2, 'jpg', 0, pageHeight - footerImageHeight, pageWidth, footerImageHeight);

    // Abrir PDF en nueva ventana
    doc.output('dataurlnewwindow', {
        filename: `volante_${item.volante || 'documento'}.pdf`
    });
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
        setGlobalModalMessage("Respuesta guardada exitosamente");
        setGlobalModalType("success");
        setShowGlobalModal(true);
        // Opcional: Actualizar la tabla después de guardar
        handleSearch();
      } else {
        throw new Error("Error al guardar la respuesta");
      }
    } catch (error) {
      console.error("Error al guardar la respuesta:", error);
      setGlobalModalMessage("Hubo un error al guardar la respuesta. Favor de contactar con el área de la Subdirección de Informática.");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
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
              isInvalid={!!volanteError}
            />
            <Form.Control.Feedback type="invalid">
              {volanteError}
            </Form.Control.Feedback>
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
                        onClick={(e) => handleAction("oficio", item, e)}
                      >
                        Oficio
                      </Button>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                        onClick={(e) => handleAction("imprimir", item, e)}
                      >
                        Imprimir
                      </Button>
                      <Button
                        variant="outline-warning"
                        size="sm"
                        className="me-2"
                        onClick={(e) => handleAction("modificar", item, e)}
                      >
                        Modificar
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={(e) => handleAction("respuesta", item, e)}
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

      {/* Modal para validación de mes/año */}
      <Modal
        show={showValidationModal}
        onHide={() => setShowValidationModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Validación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{validationMessage}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowValidationModal(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal global */}
      <GlobalModal
        show={showGlobalModal}
        onHide={() => setShowGlobalModal(false)}
        message={globalModalMessage}
        type={globalModalType}
      />
    </Container>
  );
};

export default Seguimiento;