// src/Controlador/rutas.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Vista/login";
import Dashboard from "../Vista/dashboard";
import Inicio from "../Vista/inicio";
// Placeholder para componentes futuros
import Recepcion from "../Vista/recepcion";
import Modificar from "../Vista/modificar";
import Respuesta from "../Vista/respuesta";

function RutasApp() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", checkToken);
    return () => window.removeEventListener("storage", checkToken);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/" />}
        >
          <Route index element={<Navigate to="/dashboard/inicio" />} />
          <Route path="inicio" element={<Inicio />} />
          <Route path="recepcion" element={<Recepcion />} />
          <Route path="modificar" element={<Modificar />} />
          <Route path="respuesta" element={<Respuesta />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default RutasApp;