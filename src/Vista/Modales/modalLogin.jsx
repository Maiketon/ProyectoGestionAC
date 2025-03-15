/*
Autor: Miguel Angel Montoya Bautista
Fecha: 8-2-25
Descripcioon: Componente modal de prueba/ejemplo
*/
import React from "react";
import { Modal, Button } from "react-bootstrap";

function ModalLogin({ show, onHide, mensaje, esIncorrecto }) {
  return (
    /* Fecha: 9-3-25
       Descripción: Ajuste al boton de cerrar modal
       Se modifica el evento onClick para que cierre el modal pasando de parametro 
       handleClose
       al evento
       onHide
    */
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header>
        <Modal.Title className="w-100 text-center">Inicio de Sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <p>{mensaje}</p>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        {esIncorrecto && (
          <Button variant="secondary" onClick={onHide}>
            Cerrar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default ModalLogin;
