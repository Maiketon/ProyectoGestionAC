// src/Vista/modificar.jsx
import React, { useState } from "react";
import { Container, Row, Col, Form, Button, Table } from "react-bootstrap";

const Modificar = () => {
    const [formData, setFormData] = useState({
    volante: "",
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
    leyenda: "No",
    urgente: "No",
  });

  const [pdfFile, setPdfFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      setPdfFile(files[0]);
      setFormData({ ...formData, pdf: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    // Aquí puedes agregar la lógica para enviar los datos (por ejemplo, a una API)
  };

  return (
    <Container className="py-3">
      <Row className="mb-3">
        <Col>
          <h2 className="text-center bg-dark text-white p-2 rounded">
            Modificación de Correspondencia Jefatura Alcaldía Cuauhtémoc
          </h2>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Table style={{ backgroundColor: "white" }}>
          <tbody>
            <tr>
              <td style={{ width: "50%" }}>
                <Form.Group controlId="volante">
                  <Form.Label>Volante:</Form.Label>
                  <Form.Control
                    type="text"
                    name="volante"
                    value={formData.volante}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="fecha">
                  <Form.Label>Fecha:</Form.Label>
                  <Form.Control
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Group controlId="referencia">
                  <Form.Label>Referencia:</Form.Label>
                  <Form.Control
                    type="text"
                    name="referencia"
                    value={formData.referencia}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="cargo">
                  <Form.Label>Cargo:</Form.Label>
                  <Form.Control
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Group controlId="remitente">
                  <Form.Label>Remitente:</Form.Label>
                  <Form.Control
                    type="text"
                    name="remitente"
                    value={formData.remitente}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  />
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="procedencia">
                  <Form.Label>Procedencia:</Form.Label>
                  <Form.Control
                    type="text"
                    name="procedencia"
                    value={formData.procedencia}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
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
                    style={{ borderColor: "#007bff" }}
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
                    style={{ borderColor: "#007bff" }}
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
                    style={{ borderColor: "#007bff" }}
                  >
                    <option value="">Selecciona Área</option>
                    <option value="Area1">Área 1</option>
                    <option value="Area2">Área 2</option>
                    <option value="Area3">Área 3</option>
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
                    style={{ borderColor: "#007bff" }}
                  />
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td>
                <Form.Group controlId="copia1">
                  <Form.Label>Copia 1 para:</Form.Label>
                  <Form.Select
                    name="copia1"
                    value={formData.copia1}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  >
                    <option value="">Selecciona Área</option>
                    <option value="Area1">Área 1</option>
                    <option value="Area2">Área 2</option>
                    <option value="Area3">Área 3</option>
                  </Form.Select>
                </Form.Group>
              </td>
              <td>
                <Form.Group controlId="copia2">
                  <Form.Label>Copia 2 para:</Form.Label>
                  <Form.Select
                    name="copia2"
                    value={formData.copia2}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  >
                    <option value="">Selecciona Área</option>
                    <option value="Area1">Área 1</option>
                    <option value="Area2">Área 2</option>
                    <option value="Area3">Área 3</option>
                  </Form.Select>
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Form.Group controlId="copia3">
                  <Form.Label>Copia 3 para:</Form.Label>
                  <Form.Select
                    name="copia3"
                    value={formData.copia3}
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
                  >
                    <option value="">Selecciona Área</option>
                    <option value="Area1">Área 1</option>
                    <option value="Area2">Área 2</option>
                    <option value="Area3">Área 3</option>
                  </Form.Select>
                </Form.Group>
              </td>
            </tr>
            <tr>
              <td colSpan={2}>
                <Form.Group controlId="pdf">
                  <Form.Label>Subir PDF:</Form.Label>
                  <Form.Control
                    type="file"
                    name="pdf"
                    accept="application/pdf"
                    onChange={handleChange}
                    style={{ borderColor: "#007bff" }}
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
                    style={{ borderColor: "#007bff" }}
                  >
                    <option value="No">No</option>
                    <option value="Sí">Sí</option>
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
                    style={{ borderColor: "#007bff" }}
                  >
                    <option value="No">No</option>
                    <option value="Sí">Sí</option>
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
    </Container>
  );
};

export default Modificar;