import React, { useState } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";

const ModalRespuesta = ({
  show,
  onHide,
  onSubmit,
  respuestasPrevias = [],
  selectedRecord
}) => {
  // Depuración: Verificar las props recibidas
  console.log("Props recibidas en ModalRespuesta:", {
    show,
    onHide,
    onSubmit,
    respuestasPrevias,
    selectedRecord
  });

  const [formData, setFormData] = useState({
    respuesta: "",
    pdf: null,
    fecha_crea: null,
    fecha_respuesta: null,
  });
  const [pdfFileName, setPdfFileName] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.respuesta.trim()) {
      alert("Por favor, escribe una respuesta antes de guardar");
      return;
    }

    try {
      if (!selectedRecord || !selectedRecord.id_registro) {
        throw new Error("No se ha seleccionado un registro válido");
      }

      const idUsuario = localStorage.getItem('id_user');
      if (!idUsuario) {
        throw new Error("Usuario no autenticado");
      }

      let nombreArchivo = "Sin archivo";
      if (formData.pdf) {
        const formDataPdf = new FormData();
        formDataPdf.append('pdf', formData.pdf);
        
        const uploadResponse = await axios.post(
          'http://127.0.0.1:8000/subirArchivoRespuesta',
          formDataPdf,
          { 
            headers: { 
              'Content-Type': 'multipart/form-data',
            } 
          }
        );
        nombreArchivo = uploadResponse.data.nombre_archivo;
      }

      // Usar las fechas como strings directamente
      const fecha_respuesta = formData.fecha_respuesta;
      const fecha_crea = formData.fecha_crea;

      await axios.post(
        'http://127.0.0.1:8000/registrarRespuesta',
        {
          respuesta: formData.respuesta,
          id_usuario: idUsuario,
          id_registro: selectedRecord.id_registro,
          nombre_archivo_respuesta: nombreArchivo,
          fecha_respuesta: fecha_respuesta,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      onHide();
      setFormData({ 
        respuesta: '', 
        pdf: null,
        fecha_respuesta: null,
        fecha_crea: null,
      });
      setPdfFileName('');
      alert('Respuesta guardada correctamente');

    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.detail || 
           error.response?.data?.message || 
           error.message || 
           'Error al guardar respuesta');
    }
  };

  const handleOpenAdjunto = (nombreArchivo) => {
    if (nombreArchivo) {
      window.open(
        `http://127.0.0.1:8000/obtenerPdf/${nombreArchivo}`,
        '_blank',
        'noopener,noreferrer'
      );
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Respuesta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="respuestasPrevias" className="mb-3">
            <Form.Label>Respuestas previas:</Form.Label>
            {respuestasPrevias.length > 0 ? (
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Respuesta</th>
                    <th>Fecha Captura</th>
                    <th>Fecha Respuesta</th>
                    <th>Adjunto</th>
                  </tr>
                </thead>
                <tbody>
                  {respuestasPrevias.map((previa, index) => (
                    <tr key={index}><td>{previa.respuesta}</td><td>{previa.fecha_captura || "Sin fecha"}</td><td>{previa.fecha_respuesta || "Sin fecha"}</td><td>{previa.adjunto ? (<a href="#" onClick={(e) => {e.preventDefault(); handleOpenAdjunto(previa.adjunto);}} style={{ cursor: 'pointer', color: '#007bff' }}>{previa.adjunto}</a>) : "Sin adjunto"}</td></tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <p>Sin respuestas previas del volante...</p>
            )}
          </Form.Group>

          <Form.Group controlId="fecha_respuesta" className="mb-3">
            <Form.Label>Fecha de respuesta:</Form.Label>
            <Form.Control
              type="date"
              name="fecha_respuesta"
              value={formData.fecha_respuesta || ""}
              onChange={handleChange}
              placeholder="Ingresa la fecha (DD/MM/YYYY)"
            />
          </Form.Group>

          <Form.Group controlId="respuesta" className="mb-3">
            <Form.Label>Respuesta:</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="respuesta"
              value={formData.respuesta}
              onChange={handleChange}
              placeholder="Escribe tu respuesta aquí..."
              maxLength={500}
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