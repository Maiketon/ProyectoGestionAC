import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import "./Utils/Css/estiloRecepcion.css";

const Formulario = ({ plegado }) => {

  useEffect(() => {
      console.log("🚀 Formulario montado");
    }, []);

  const [formData, setFormData] = useState({
    fecha: "",
    referencia: "",
    remitente: "",
    cargo: "",
    numeroOficio: "",
    dependencia: "",
    asunto: "",
    volante: "",
    turnado: "",
    copiaPara: "",
    instruccion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <Form onSubmit={handleSubmit} className="p-3">
      <h2 className="text-center">Registro de Documentos</h2>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Fecha</Form.Label>
          <Form.Control type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <Form.Label>Referencia</Form.Label>
          <Form.Control type="text" name="referencia" value={formData.referencia} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <Form.Label>Remitente</Form.Label>
          <Form.Control type="text" name="remitente" value={formData.remitente} onChange={handleChange} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Cargo</Form.Label>
          <Form.Control type="text" name="cargo" value={formData.cargo} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <Form.Label>No. de Oficio</Form.Label>
          <Form.Control type="text" name="numeroOficio" value={formData.numeroOficio} onChange={handleChange} />
        </Col>
        <Col md={4}>
          <Form.Label>Dependencia</Form.Label>
          <Form.Control type="text" name="dependencia" value={formData.dependencia} onChange={handleChange} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Asunto</Form.Label>
          <Form.Control type="text" name="asunto" value={formData.asunto} onChange={handleChange} />
        </Col>
        <Col md={6}>
          <Form.Label>Volante</Form.Label>
          <Form.Control type="text" name="volante" value={formData.volante} onChange={handleChange} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Label>Turnado a</Form.Label>
          <Form.Select name="turnado" value={formData.turnado} onChange={handleChange}>
            <option value="">--Selecciona Área--</option>
            <option value="area1">Área 1</option>
            <option value="area2">Área 2</option>
          </Form.Select>
        </Col>
        <Col md={6}>
          <Form.Label>Copia para</Form.Label>
          <Form.Select name="copiaPara" value={formData.copiaPara} onChange={handleChange}>
            <option value="">--Selecciona Área--</option>
            <option value="area1">Área 1</option>
            <option value="area2">Área 2</option>
          </Form.Select>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Form.Label>Instrucción</Form.Label>
          <Form.Control as="textarea" rows={3} name="instruccion" value={formData.instruccion} onChange={handleChange} />
        </Col>
      </Row>

      <Button type="submit" variant="primary" className="w-100">
        Enviar
      </Button>
    </Form>
  );
};

export default Formulario;

