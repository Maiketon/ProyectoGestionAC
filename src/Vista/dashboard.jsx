import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BarraLateral from "./barraLateral";
import Formulario from "./recepcion";
import "./Utils/Css/estilosBarraNav.css";
import "./Utils/Css/estiloDashboard.css";
import LogoAlcaldiaFondo from "./Utils/Images/wall_proyecto.png"; // ✅ Import correcto

function Dashboard() {
  const [plegado, setPlegado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🚀 Dashboard montado");
  }, []);

  return (
    <div
      className="dashboard-container"
      style={{
        backgroundImage: `url(${LogoAlcaldiaFondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="dashboard-content">
        <BarraLateral setPlegado={setPlegado} />
        <div className={`contenedor-formulario ${plegado ? "expandido" : "reducido"}`}>
          <Formulario plegado={plegado} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
