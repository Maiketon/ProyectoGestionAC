// src/Vista/Modales/ModalRespuesta.jsx
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const ModalRespuesta = ({
  show,
  onHide,
  onSubmit, // Callback para manejar el envío de datos
}) => {
  // Estado para manejar los datos del formulario
  const [formData, setFormData] = useState({
    respuesta: "",
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
          <Form.Group controlId="respuesta" className="mb-3">
          <Form.Label>Respuestas previas:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="respuesta"
              value={formData.respuesta}
              onChange={handleChange}
              placeholder="Sin respuestas previas del volante..."
              maxLength={500} // Límite opcional, puedes ajustarlo según tus necesidades
              required
            />
          </Form.Group>

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