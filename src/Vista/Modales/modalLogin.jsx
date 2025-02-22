import React from "react";
import { Modal, Button } from "react-bootstrap";

function ModalLogin({ show, handleClose, mensaje, esIncorrecto }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header>
        <Modal.Title className="w-100 text-center">Inicio de Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>{mensaje}</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        {esIncorrecto && (
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalLogin;
