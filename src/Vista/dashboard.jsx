import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, Outlet } from "react-router-dom";
import BarraLateral from "./barraLateral";
import "./Utils/Css/estilosBarraNav.css";
import "./Utils/Css/estiloDashboard.css";
import LogoAlcaldiaFondo from "./Utils/Images/wall_w.png";

function Dashboard() {
  const [plegado, setPlegado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 Dashboard montado");
  }, []);

  return (
    <div
      className="background-container"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        backgroundImage: `url(${LogoAlcaldiaFondo})`,
        backgroundSize: "1200px",
        backgroundRepeat: "repeat",
        backgroundPosition: "center",
        zIndex: 0,
        animation: "moveBackground 100s linear infinite",
      }}
    >
      {/* Animación CSS para el fondo y ajustes de scroll */}
      <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            position: relative;
            overflow-y: auto; /* Permitir scroll vertical */
          }
        
          @keyframes moveBackground {
            from { background-position: 0 0; }
            to { background-position: 500px 500px; } /* Mueve el fondo suavemente */
          }
        `}
      </style>

      <Container fluid className="h-100">
        <Row className="h-100">
          {!plegado && (
            <Col md={2} className="h-100">
              <BarraLateral setPlegado={setPlegado} />
            </Col>
          )}
          <Col
            md={plegado ? 12 : 9}
            className="d-flex flex-column h-100"
            style={{ overflowY: "auto" }} // Permitir scroll vertical en el contenido
          >
            <div className="flex-grow-1 d-flex align-items-center justify-content-center">
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  borderRadius: "10px",
                  boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                  width: "100%",
                  maxWidth: "1200px",
                }}
              >
                <Outlet />
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Botón flotante para mostrar la barra lateral nuevamente */}
      {plegado && (
        <Button
          variant="primary"
          onClick={() => setPlegado(false)}
          style={{
            position: "fixed",
            top: "20px",
            left: "10px",
            zIndex: 1000,
            borderRadius: "5px",
          }}
        >
          ▶ Menú
        </Button>
      )}
    </div>
  );
}

export default Dashboard;