// src/Vista/consultar.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button, Spinner, Alert, Modal } from "react-bootstrap";
import axios from "axios"; // Importar axios
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import GlobalModal from "./Modales/globalModal.jsx"; // Ajusta la ruta según tu estructura

// Definimos months y years fuera del componente para evitar cambios en la referencia
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const years = ["2025", "2026", "2027"];

const Consultar = () => {
  // Estado para los filtros
  const [filters, setFilters] = useState({
    month: "",
    year: "",
  });

  // Estado para los datos filtrados (inicia vacío)
  const [filteredData, setFilteredData] = useState([]);

  // Estados para manejar la carga y errores
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Estado para el modal de validación
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // Estado para el modal global
  const [showGlobalModal, setShowGlobalModal] = useState(false);
  const [globalModalMessage, setGlobalModalMessage] = useState("");
  const [globalModalType, setGlobalModalType] = useState("info");

  // Función para obtener los registros filtrados desde la API
  const fetchFilteredData = async (month, year) => {
    try {
      setLoading(true);
      setError(null);
  
      // Convertir el nombre del mes a número
      const monthNumber = months.indexOf(month) + 1;
      const idTipoUsuarioCifrado = localStorage.getItem('type_user');
      const idUsuarioCifrado = localStorage.getItem('id_user');
      // Hacer la solicitud a la API usando axios
      const response = await axios.post("http://127.0.0.1:8000/consultarRegistros", {
        year: year,
        month: month,
        volante: filters.volante,
        tipoUsuario: idTipoUsuarioCifrado,
        id_usuario: idUsuarioCifrado
      });
  
      // Actualizar los datos filtrados
      setFilteredData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Error al obtener los registros. Favor de contactar con el área de la Subdirección de Informática.");
      setGlobalModalMessage(err.response?.data?.detail || "Error al obtener los registros. Favor de contactar con el área de la Subdirección de Informática.");
      setGlobalModalType("error");
      setShowGlobalModal(true);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar datos cuando cambian los filtros
  useEffect(() => {
    if (filters.month && filters.year) {
      fetchFilteredData(filters.month, filters.year);
    } else {
      setFilteredData([]); // Si no hay filtros, tabla vacía
    }
  }, [filters]); // Solo depende de filters

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };
  

  
  const exportToExcel = (data, year, month) => {
    // Validar si no se ha seleccionado mes ni año
    if (!filters.month && !filters.year) {
      setGlobalModalMessage("Debe de seleccionar mes/año");
      setGlobalModalType("warning");
      setShowGlobalModal(true);
      return; // Detener la ejecución si no hay filtros
    }

    // Validar si hay al menos un registro en data
    if (!data || data.length === 0) {
        setGlobalModalMessage("No hay registros para exportar.");
        setGlobalModalType("warning");
        setShowGlobalModal(true);
        return; // Detener la ejecución si no hay registros
    }

    // Crear un nuevo libro de trabajo
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Registros");

    // Definir las columnas con el nuevo orden y nombres
    worksheet.columns = [
        { header: "Asunto", key: "asunto", width: 30 },
        { header: "Fecha", key: "fecha", width: 15 },
        { header: "Referencia", key: "referencia", width: 15 },
        { header: "Remitente", key: "remitente", width: 30 },
        { header: "Cargo", key: "cargo", width: 30 },
        { header: "Oficio", key: "noOficio", width: 15 },
        { header: "Dependencia", key: "dependencia", width: 20 },
        { header: "Turnado a", key: "atencion", width: 40 },
        { header: "Copia a", key: "copia_a", width: 30 },
        { header: "Instrucción", key: "indicacion", width: 20 },
        { header: "Volante", key: "volante", width: 15 },
        { header: "Respuesta", key: "respuesta", width: 15 },
    ];

    // Aplicar estilos a los encabezados
    worksheet.getRow(1).eachCell((cell) => {
        cell.font = { name: "Aptos Narrow", bold: true }; // Fuente Aptos Narrow y negrita
        cell.alignment = { vertical: "middle", horizontal: "center" }; // Alineación centrada para encabezados
    });

    // Agregar los datos con el nuevo orden y lógica
    data.forEach((item) => {
        // Concatenar los campos de "Copia a"
        const copia_a = [item.copia_para_nombre, item.copia_para2_nombre, item.copia_para3_nombre]
            .filter((value) => value !== null && value !== undefined) // Filtrar valores nulos o undefined
            .join(", "); // Unir con comas

        // Lógica para el campo "Respuesta"
        const respuesta = item.respuesta ? "Sí" : "No";

        // Formatear la fecha si es necesario
        const fecha = item.fecha_recibido ? item.fecha_recibido : item.fecha; // Asegúrate de usar el nombre correcto del campo
        const fechaFormateada = fecha ? new Date(fecha).toISOString().split('T')[0] : ''; // Formato YYYY-MM-DD

        // Agregar fila con los datos
        const row = worksheet.addRow({
            asunto: item.asunto,
            fecha: fechaFormateada, // Usar la fecha formateada
            referencia: item.referencia,
            remitente: item.remitente,
            cargo: item.cargo,
            noOficio: item.noOficio,
            dependencia: item.dependencia,
            atencion: item.atencion, // Cambiar a "Turnado a"
            copia_a: copia_a, // Concatenación de copia_para, copia_para2, copia_para3
            indicacion: item.indicacion, // Cambiar a "Instrucción"
            volante: item.volante,
            respuesta: respuesta, // Lógica para "Respuesta"
        });

        // Aplicar estilos a las celdas de la fila
        row.eachCell((cell) => {
            cell.font = { name: "Aptos Narrow" }; // Fuente Aptos Narrow
            cell.alignment = { vertical: "bottom", horizontal: "left" }; // Alineación inferior y a la izquierda
        });
    });

    // Ajustar el ancho de las columnas dinámicamente
    worksheet.columns.forEach((column) => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, (cell) => {
            const cellLength = cell.value ? cell.value.toString().length : 0;
            if (cellLength > maxLength) {
                maxLength = cellLength;
            }
        });
        column.width = maxLength < 10 ? 10 : maxLength + 2; // Ancho mínimo de 10
    });

    // Generar el nombre del archivo
    const fileName = `consulta_registros_${year}-${String(months.indexOf(month) + 1).padStart(2, "0")}.xlsx`;

    // Guardar el archivo Excel
    workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    });
};
  
  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">
            Selecciona año y mes de <span>fecha de captura</span> de los registros que deseas consultar
          </h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={6}>
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
        <Col md={6}>
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
      </Row>

      <Row>
        <Col>
          {loading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Cargando...</span>
              </Spinner>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="text-center">
              {error}
            </Alert>
          )}

          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Referencia</th>
                <th>Remitente</th>
                <th>Cargo</th>
                <th>No. de Oficio</th>
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
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="text-center">
                    {!loading && !error && "Selecciona mes y año para mostrar los registros."}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={11} className="text-center">
                <Button onClick={() => exportToExcel(filteredData, filters.year, filters.month)}>
                  Exportar a Excel
                </Button>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

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

export default Consultar;