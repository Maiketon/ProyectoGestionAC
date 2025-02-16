import React, { useState } from "react";
import "./Utils/Css/estiloRecepcion.css";

const Formulario = ({ plegado }) => {
  const [formData, setFormData] = useState({
    fecha: "",
    referencia: "",
    remitente: "",
    cargo: "",
    numeroOficio: "",
    dependencia: "",
    asunto: "",
    volante: "",
    turnado: "",
    copiaPara: "",
    instruccion: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);
  };

  return (
    <div className={`contenedor-formulario ${plegado ? "expandido" : "reducido"}`}>
      <h2>Registro de Documentos para la Alcaldesa</h2>
      <form onSubmit={handleSubmit}>
        <div className="fila">
          <label>Fecha:</label>
          <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
          <label>Referencia:</label>
          <input type="text" name="referencia" value={formData.referencia} onChange={handleChange} />
          <label>Remitente:</label>
          <input type="text" name="remitente" value={formData.remitente} onChange={handleChange} />
        </div>

        <div className="fila">
          <label>Cargo:</label>
          <input type="text" name="cargo" value={formData.cargo} onChange={handleChange} />
          <label>No. de Oficio:</label>
          <input type="text" name="numeroOficio" value={formData.numeroOficio} onChange={handleChange} />
          <label>Dependencia:</label>
          <input type="text" name="dependencia" value={formData.dependencia} onChange={handleChange} />
        </div>

        <div className="fila">
          <label>Asunto:</label>
          <input type="text" name="asunto" value={formData.asunto} onChange={handleChange} />
          <label>Volante:</label>
          <input type="text" name="volante" value={formData.volante} onChange={handleChange} />
        </div>

        <div className="fila">
          <label>Turnado a:</label>
          <select name="turnado" value={formData.turnado} onChange={handleChange}>
            <option value="">--Selecciona Área--</option>
            <option value="area1">Área 1</option>
            <option value="area2">Área 2</option>
          </select>
          <label>Copia para:</label>
          <select name="copiaPara" value={formData.copiaPara} onChange={handleChange}>
            <option value="">--Selecciona Área--</option>
            <option value="area1">Área 1</option>
            <option value="area2">Área 2</option>
          </select>
        </div>

        <div className="fila">
          <label>Instrucción:</label>
          <textarea name="instruccion" value={formData.instruccion} onChange={handleChange} />
        </div>

        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default Formulario;
