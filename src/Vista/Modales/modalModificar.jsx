/*
Autor: Abraham Alvarado Gutierrez
Fecha: 22-03-25
Descripcioon: Componente modal de prueba/ejemplo
*/
// src/Vista/ModalModificar.jsx
import React from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";

const ModalModificar = ({
  show,
  onHide,
  formData,
  handleChange,
  enviarRecibo,
  getInputStyle,
  areas,
  pdfFile,
  isEditing = false, // Nueva prop para indicar si estamos editando
  onUpdate, // Callback para manejar la actualización
}) => {
  const handleSubmit = (e) => {
    if (isEditing) {
      onUpdate(e); // Si estamos editando, llamamos a onUpdate
    } else {
      enviarRecibo(e); // Si no, usamos enviarRecibo para crear un nuevo registro
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {isEditing
            ? "Modificar Correspondencia"
            : "Registro de Correspondencia Jefatura Alcaldía Cuauhtémoc"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Table style={{ backgroundColor: "white" }}>
            <tbody>
              <tr>
                <td style={{ width: "50%" }}>
                  <Form.Group controlId="fecha">
                    <Form.Label>Fecha:</Form.Label>
                    <Form.Control
                      type="text"
                      name="fecha"
                      value={formData.fecha}
                      onChange={handleChange}
                      style={getInputStyle("fecha")}
                    />
                  </Form.Group>
                </td>
                <td>
                  <Form.Group controlId="referencia">
                    <Form.Label>Referencia:</Form.Label>
                    <Form.Control
                      type="text"
                      name="referencia"
                      value={formData.referencia}
                      onChange={handleChange}
                      style={getInputStyle("referencia")}
                    />
                  </Form.Group>
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Group controlId="cargo">
                    <Form.Label>Cargo:</Form.Label>
                    <Form.Control
                      type="text"
                      name="cargo"
                      value={formData.cargo}
                      onChange={handleChange}
                      style={getInputStyle("cargo")}
                    />
                  </Form.Group>
                </td>
                <td>
                  <Form.Group controlId="remitente">
                    <Form.Label>Remitente:</Form.Label>
                    <Form.Control
                      type="text"
                      name="remitente"
                      value={formData.remitente}
                      onChange={handleChange}
                      style={getInputStyle("remitente")}
                    />
                  </Form.Group>
                </td>
              </tr>
              <tr>
                <td colSpan={2}>
                  <Form.Group controlId="procedencia">
                    <Form.Label>Procedencia:</Form.Label>
                    <Form.Control
                      type="text"
                      name="procedencia"
                      value={formData.procedencia}
                      onChange={handleChange}
                      style={getInputStyle("procedencia")}
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
                      style={getInputStyle("fechaOficio")}
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
                      style={getInputStyle("indicacion")}
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
                      style={getInputStyle("atencion")}
                    >
                      <option value="">Selecciona Área</option>
                      {areas.length > 0 ? (
                        areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.nombre}
                          </option>
                        ))
                      ) : (
                        <option disabled>Cargando áreas...</option>
                      )}
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
                      value={formData.indicacion} // Usar indicacion en lugar de asunto
                      onChange={handleChange}
                      style={getInputStyle("asunto")}
                    />
                  </Form.Group>
                </td>
              </tr>
              <tr>
                <td>
                  <Form.Group controlId="copia1">
                    <Form.Label>Seleccione copia para el área</Form.Label>
                    <Form.Select
                      name="copia1"
                      value={formData.copia1}
                      onChange={handleChange}
                      style={{ width: "100%", padding: "10px" }}
                    >
                      <option value="">Selecciona Área</option>
                      {areas.length > 0 ? (
                        areas.map((area) => (
                          <option key={area.id} value={area.id}>
                            {area.nombre}
                          </option>
                        ))
                      ) : (
                        <option disabled>Cargando áreas...</option>
                      )}
                    </Form.Select>
                  </Form.Group>
                </td>
                {formData.copia1 && formData.copia1 !== "" && (
                  <td>
                    <Form.Group controlId="copia2">
                      <Form.Label>Copia 2 para:</Form.Label>
                      <Form.Select
                        name="copia2"
                        value={formData.copia2}
                        onChange={handleChange}
                        style={getInputStyle("copia2")}
                      >
                        <option value="">Selecciona Área</option>
                        {areas.length > 0 ? (
                          areas.map((area) => (
                            <option key={area.id} value={area.id}>
                              {area.nombre}
                            </option>
                          ))
                        ) : (
                          <option disabled>Cargando áreas...</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </td>
                )}
              </tr>
              {formData.copia2 && formData.copia2 !== "" && (
                <tr>
                  <td colSpan={2}>
                    <Form.Group controlId="copia3">
                      <Form.Label>Copia 3 para:</Form.Label>
                      <Form.Select
                        name="copia3"
                        value={formData.copia3}
                        onChange={handleChange}
                        style={getInputStyle("copia3")}
                      >
                        <option value="">Selecciona Área</option>
                        {areas.length > 0 ? (
                          areas.map((area) => (
                            <option key={area.id} value={area.id}>
                              {area.nombre}
                            </option>
                          ))
                        ) : (
                          <option disabled>Cargando áreas...</option>
                        )}
                      </Form.Select>
                    </Form.Group>
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={2}>
                  <Form.Group controlId="pdf">
                    <Form.Label>Subir PDF:</Form.Label>
                    {formData.nombre_archivo && (
                      <p>
                        Archivo actual: {formData.nombre_archivo}{" "}
                        <Button
                          variant="link"
                          onClick={() => setFormData({ ...formData, nombre_archivo: "", pdf: null })}
                        >
                          (Eliminar)
                        </Button>
                      </p>
                    )}
                    <Form.Control
                      type="file"
                      name="pdf"
                      accept="application/pdf"
                      onChange={handleChange}
                      style={getInputStyle("pdf")}
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
                      style={getInputStyle("leyenda")}
                    >
                      <option value="1">Sí</option>
                      <option value="2">No</option>
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
                      style={getInputStyle("urgente")}
                    >
                      <option value="1">No</option>
                      <option value="2">Sí</option>
                      <option value="3">Extra</option>
                    </Form.Select>
                  </Form.Group>
                </td>
              </tr>
            </tbody>
          </Table>
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

export default ModalModificar;