import React, { useState } from "react";
import BarraLateral from "./barraLateral";
import Formulario from "./recepcion";
import "./Utils/Css/estilosBarraNav.css";

function Dashboard() {
  const [plegado, setPlegado] = useState(false);

  return (
    <div className="dashboard-container">
      <BarraLateral setPlegado={setPlegado} />
      <div className={`contenido ${plegado ? "expandido" : "reducido"}`}>
        <Formulario plegado={plegado} />
      </div>
    </div>
  );
}

export default Dashboard;
