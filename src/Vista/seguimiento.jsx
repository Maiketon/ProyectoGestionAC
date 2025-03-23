// src/Vista/seguimiento.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";
// MODALES O COMPONENTES
import ModalModificar from "./Modales/modalModificar.jsx"; // Ajusta la ruta según tu estructura de carpetas
// Ajuste la ruta de la imagen según su estructura de carpetas

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

  // Estado para los datos filtrados (inicia vacío)
  const [filteredData, setFilteredData] = useState([]);

  // Datos de ejemplo (puedes reemplazar con datos de una API)
  const allData = [
    {
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
    {
      fecha: "25/02/2025",
      referencia: "521",
      remitente: "Eva Yael Reinosa Sánchez",
      cargo: "Directora General de Desarrollo y Bienestar",
      noOficio: "AC/RMSG/00001/2025",
      dependencia: "DRMSG",
      turnado: "Desarrollo y Bienestar",
      instruccion: "ASISTIR Y DAR SEGUIMIENTO",
      volante: "4521",
    },
    {
      fecha: "03/02/2025",
      referencia: "987",
      remitente: "Carlos Segundo",
      cargo: "Director General del ISSSTE",
      noOficio: "SG/DG/JEL/PA/CCDMX/11/00084.3/2023",
      dependencia: "La dependencia del oficio",
      turnado: "Dirección General de Administración",
      instruccion: "La instrucción que debe hacer el responsable del volante",
      volante: "1234",
    },
  ];

  const [areas, setAreas] = useState([]); // Estado para las áreas
  const [showModalModificar, setShowModalModificar] = useState(false); // Estado para el modal
  const [selectedRecord, setSelectedRecord] = useState(null); // Registro seleccionado para modificar
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

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      const file = files[0];
      if (file) {
        setPdfFile(file);
        setFormData({ ...formData, pdf: file });
      } else {
        setPdfFile(null);
        setFormData({ ...formData, pdf: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const getInputStyle = (fieldName) => ({
    borderColor: "#007bff", // Estilo por defecto
  });

  const handleAction = (action, item) => {
    switch (action) {
      case "oficio":
        alert(`Generar Oficio para: ${item.volante}`);
        break;
      case "imprimir":
        alert(`Imprimir registro: ${item.referencia}`);
        break;
      case "modificar":
        // Cargar los datos del registro seleccionado en el formulario
        setSelectedRecord(item);
        setFormData({
          fecha: item.fecha,
          referencia: item.referencia,
          cargo: item.cargo,
          remitente: item.remitente,
          procedencia: item.dependencia,
          fechaOficio: item.noOficio,
          indicacion: item.instruccion,
          atencion: "", // Esto debería mapearse al ID del área si tienes un mapeo
          asunto: "", // Ajusta según los datos reales
          copia1: "",
          copia2: "",
          copia3: "",
          pdf: null,
          leyenda: "1",
          urgente: "1",
        });
        setShowModalModificar(true);
        break;
      case "respuesta":
        alert(`Generar Respuesta para: ${item.volante}`);
        break;
      default:
        break;
    }
  };

  return (
    <Container className="py-3">
      <Row className="mb-3">
        <Col>
          <h2 className="text-center">
            Selecciona mes y año para seguimiento en la Base de Datos
          </h2>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={3}>
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

        <Col md={3}>
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

        <Col md={3}>
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

        <Col md={3}>
          <Button variant="primary" className="mt-4">
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
                    <td>{item.turnado}</td>
                    <td>{item.instruccion}</td>
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
    </Container>
  );
};

export default Seguimiento;