// src/Vista/consultar.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Table, Button } from "react-bootstrap";

// Definimos months y years fuera del componente para evitar cambios en la referencia
const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];
const years = ["2025", "2024", "2023"];

const Consultar = () => {
  // Estado para los filtros
  const [filters, setFilters] = useState({
    month: "",
    year: "",
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

  // Filtrar datos cuando cambian los filtros
  useEffect(() => {
    if (filters.month && filters.year) {
      const filtered = allData.filter((item) => {
        const [day, month, year] = item.fecha.split("/");
        const monthName = months[parseInt(month, 10) - 1]; // Convertir número de mes a nombre
        return monthName === filters.month && year === filters.year;
      });
      setFilteredData(filtered);
    } else {
      setFilteredData([]); // Si no hay filtros, tabla vacía
    }
  }, [filters]); // Solo depende de filters, ya que months es constante afuera

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleAction = (action, item) => {
    switch (action) {
      case "oficio":
        alert(`Generar Oficio para: ${item.volante}`);
        break;
      case "imprimir":
        alert(`Imprimir registro: ${item.referencia}`);
        break;
      case "modificar":
        alert(`Modificar registro: ${item.volante}`);
        break;
      case "respuesta":
        alert(`Generar Respuesta para: ${item.volante}`);
        break;
      default:
        break;
    }
  };

  return (
    <Container className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">
            Selecciona mes y año para consultar en la Base de Datos
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
                <th>PDF</th>
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
                        variant="link"
                        onClick={() => handleAction("pdf", item)}
                      >
                        Ver
                      </Button>
                    </td>
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
                    Selecciona mes y año para mostrar los registros.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default Consultar;