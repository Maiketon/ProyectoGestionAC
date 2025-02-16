import React from "react";
import { Modal, Button } from "react-bootstrap";

function ModalLogin({ show, handleClose, mensaje,esIncorrecto }) {
  return (
    <Modal show={show} onHide={esIncorrecto? handleClose:null} centered>
      <Modal.Header closeButton={esIncorrecto}>
        <Modal.Title>Inicio de Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>{mensaje}</p>
      </Modal.Body>
      <Modal.Footer>
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
