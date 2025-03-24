// src/Vista/Modales/ModalRespuesta.jsx
import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

const ModalRespuesta = ({
  show,
  onHide,
  onSubmit, // Callback para manejar el envío de datos
  respuestasPrevias = [
    // Ejemplo 1: Respuesta con adjunto
    {
      respuesta: "Se coordinó una reunión para dar seguimiento al tema.",
      fecha: "2025-03-20",
      adjunto: "seguimiento_2025_03_20.pdf",
    },
    // Ejemplo 2: Respuesta sin adjunto
    {
      respuesta: "Se envió un correo al área correspondiente para su atención.",
      fecha: "2025-03-22",
      adjunto: null,
    },
  ], // Prop para recibir las respuestas previas desde el padre (ahora un array con ejemplos)
}) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    respuesta: "", // Campo para la nueva respuesta
    pdf: null,
  });

  const [pdfFileName, setPdfFileName] = useState(""); // Estado para mostrar el nombre del archivo PDF seleccionado

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "pdf") {
      const file = files[0];
      if (file) {
        setFormData({ ...formData, pdf: file });
        setPdfFileName(file.name);
      } else {
        setFormData({ ...formData, pdf: null });
        setPdfFileName("");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Llamar a la función onSubmit pasada como prop
    onHide(); // Cerrar el modal después de guardar
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Respuesta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Tabla para mostrar respuestas previas */}
          <Form.Group controlId="respuestasPrevias" className="mb-3">
            <Form.Label>Respuestas previas:</Form.Label>
            {respuestasPrevias.length > 0 ? (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Respuesta</th>
                    <th>Fecha</th>
                    <th>Adjunto</th>
                  </tr>
                </thead>
                <tbody>
                  {respuestasPrevias.map((previa, index) => (
                    <tr key={index}>
                      <td>{previa.respuesta}</td>
                      <td>{previa.fecha}</td>
                      <td>{previa.adjunto ? previa.adjunto : "Sin adjunto"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Sin respuestas previas del volante...</p>
            )}
          </Form.Group>

          {/* Campo para la nueva respuesta */}
          <Form.Group controlId="respuesta" className="mb-3">
            <Form.Label>Respuesta:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="respuesta"
              value={formData.respuesta}
              onChange={handleChange}
              placeholder="Escribe tu respuesta aquí..."
              maxLength={500} // Límite opcional, puedes ajustarlo según tus necesidades
              required
            />
          </Form.Group>

          {/* Campo para subir PDF */}
          <Form.Group controlId="pdf" className="mb-3">
            <Form.Label>Subir PDF:</Form.Label>
            <Form.Control
              type="file"
              name="pdf"
              accept="application/pdf"
              onChange={handleChange}
            />
            {pdfFileName && <p className="mt-2">Archivo seleccionado: {pdfFileName}</p>}
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalRespuesta;