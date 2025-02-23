import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Logo from "./Utils/Images/LogoAlcaldiaVertical.png";

const Inicio = () => {
  return (
    <Container className="d-flex align-items-center justify-content-center">
      <Row className="text-center">
        <Col>
          {/* Imagen centrada */}
          <img src={Logo} alt="Logo" style={{ maxWidth: "200px", marginBottom: "20px" }} />
          {/* Spinner personalizado */}
          <div style={{ minHeight: "80px" }}>
            <div className="custom-spinner" />
          </div>
          {/* Mensaje de espera */}
          <p className="mt-3 text-muted">...::: Inicio :::...</p>
          <p className="mt-3 text-muted">...   En espera de actividades   ...</p>
        </Col>
      </Row>

      {/* Estilos globales para el spinner */}
      <style>
        {`
          .custom-spinner {
            width: 50px;
            height: 50px;
            border: 8px solid transparent;
            border-top: 8px solid #ffeb3b; /* Color inicial */
            border-radius: 50%;
            animation: spin 1s linear infinite, changeColor 3s infinite;
            display: block;
            margin: 0 auto;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes changeColor {
            0% { border-top-color: #ffeb3b; } /* Amarillo */
            33% { border-top-color: #f44336; } /* Rojo */
            66% { border-top-color: #007bff; } /* Azul */
            100% { border-top-color: #ffeb3b; } /* Vuelve a amarillo */
          }
        `}
      </style>
    </Container>
  );
};

export default Inicio;