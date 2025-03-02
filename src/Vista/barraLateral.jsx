// src/Vista/barraLateral.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Utils/Css/estilosBarraNav.css";

function BarraLateral({ setPlegado }) {
  const [plegado, setEstadoPlegado] = useState(false);
  const navigate = useNavigate();

  const toggleBarra = () => {
    setEstadoPlegado(!plegado);
    setPlegado(!plegado);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  return (
    <div className={`barra-lateral ${plegado ? "plegado" : ""}`}>
      <button className="toggle-btn" onClick={toggleBarra}>
        {plegado ? "▶" : "◀"}
      </button>
      <nav className="menu">
        <ul>
          <li>
            <Link to="/dashboard/inicio">Inicio</Link>
          </li>
          <li>
            <Link to="/dashboard/recepcion">Recepción</Link>
          </li>
          <li>
            <Link to="/dashboard/seguimiento">Seguimiento</Link>
          </li>
          <hr></hr>
          <li>
            <Link to="/dashboard/consultar">Consultar</Link>
          </li>
          <hr></hr>
          <li>
            <a href="#" onClick={handleLogout}>
              Salir
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default BarraLateral;