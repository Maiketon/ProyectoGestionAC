
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Utils/Css/estilosBarraNav.css";

function BarraLateral({ setPlegado }) {
  const [plegado, setEstadoPlegado] = useState(false);

  const navigate = useNavigate();

  const toggleBarra = () => {
    setEstadoPlegado(!plegado);
    setPlegado(!plegado); // Se actualiza en el Dashboard
  };


  const handleLogout = (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del enlace
    localStorage.removeItem("token"); // Elimina el token del usuario
    window.dispatchEvent(new Event("storage")); // 🔹 Notifica a los componentes que localStorage cambió
    navigate("/"); // Redirige al login
  };

  return (
    <div className={`barra-lateral ${plegado ? "plegado" : ""}`}>
      <button className="toggle-btn" onClick={toggleBarra}>
        {plegado ? "▶" : "◀"}
      </button>
      <nav className="menu">
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Recepción</a></li>
          <li><a href="#">Modificar</a></li>
          <li><a href="#">Respuesta</a></li>
        </ul>
        <ul>
        <li><a href="#" onClick={handleLogout}>Salir</a></li>
        </ul>
      </nav>
    </div>
  );
}

export default BarraLateral;
