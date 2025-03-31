// src/Vista/barraLateral.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Importamos Modal y Button de react-bootstrap
import "./Utils/Css/estilosBarraNav.css";

function BarraLateral({ setPlegado }) {
  const [plegado, setEstadoPlegado] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false); // Estado para el modal de "Acerca de..."
  const navigate = useNavigate();

  const toggleBarra = () => {
    setEstadoPlegado(!plegado);
    setPlegado(!plegado);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    // Limpiar completamente el localStorage
    localStorage.clear();
    // Verificar que el localStorage esté vacío
    console.log("localStorage después de limpiar:", localStorage);
    // Redirigir al login
    navigate("/");
  };

  // Función para abrir el modal
  const handleShowAboutModal = (e) => {
    e.preventDefault();
    setShowAboutModal(true);
  };

  // Función para cerrar el modal
  const handleCloseAboutModal = () => {
    setShowAboutModal(false);
  };

  return (
    <div className={`barra-lateral ${plegado ? "plegado" : ""}`}>
      <button className="toggle-btn" onClick={toggleBarra}>
        {plegado ? "▶" : "◀"}
      </button>
      <nav className="menu">
        <ul className="menu-list">
          <li>
            <Link to="/dashboard/inicio">Inicio</Link>
          </li>
          <li>
            <Link to="/dashboard/recepcion">Recepción</Link>
          </li>
          <li>
            <Link to="/dashboard/seguimiento">Seguimiento</Link>
          </li>
          <hr />
          <li>
            <Link to="/dashboard/consultar">Consultar</Link>
          </li>
          <hr />
          <li>
            <a href="#" onClick={handleLogout}>Salir</a>
          </li>
          <hr />
          <li className="about-item">
            <a href="#" onClick={handleShowAboutModal}>Acerca de...</a>
          </li>
        </ul>
      </nav>

      {/* Modal para "Acerca de..." */}
      <Modal show={showAboutModal} onHide={handleCloseAboutModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Acerca de...</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Personas Involucradas en el Proyecto</h5>
          <ul>
            <li><strong>Miguel Angel Montoya Bautista</strong> - Desarrollador Principal</li>
            <li><strong>Abraham Alvarado Gutierrez</strong> - Desarrollador y Soporte</li>
            <li><strong>Carlos Alberto Ornelas Guido</strong> - Subdirector de Informática</li>
          </ul>
          <h5>Área Responsable</h5>
          <p>
            <ul>
            <li><strong>Subdirección de Informática</strong></li>
            </ul>
          </p>
          <h5>Problemas / Soporte</h5>
          <p>
            <ul>
            <li>Favor de contactar con el área de la Subdirección de Informática</li>
            </ul>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAboutModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Estilos para posicionar "Acerca de..." al final */}
      <style jsx>{`
        .barra-lateral {
          display: flex;
          flex-direction: column;
          height: 100vh; /* Asegura que la barra ocupe toda la altura de la ventana */
        }
        .menu {
          flex-grow: 1; /* Permite que el menú ocupe el espacio disponible */
          display: flex;
          flex-direction: column;
        }
        .menu-list {
          flex-grow: 1; /* El ul crece para ocupar el espacio disponible */
          display: flex;
          flex-direction: column;
          justify-content: flex-start; /* Los elementos del menú se alinean al inicio */
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .about-item {
          margin-top: auto; /* Empuja el elemento "Acerca de..." al final */
        }
      `}</style>
    </div>
  );
}

export default BarraLateral;