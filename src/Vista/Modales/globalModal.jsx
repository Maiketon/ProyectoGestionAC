// src/Components/GlobalModal.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";

const GlobalModal = ({ show, onHide, message, type = "info", title }) => {
  // Determinar el estilo del modal según el tipo
  const getVariant = () => {
    switch (type.toLowerCase()) {
      case "error":
        return "danger";
      case "success":
        return "success";
      case "warning":
        return "warning";
      default:
        return "info";
    }
  };

  // Determinar el título por defecto según el tipo
  const getDefaultTitle = () => {
    switch (type.toLowerCase()) {
      case "error":
        return "Error";
      case "success":
        return "Éxito";
      case "warning":
        return "Advertencia";
      default:
        return "Información";
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || getDefaultTitle()}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant={getVariant()} onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GlobalModal;