import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../Vista/login";
import Dashboard from "../Vista/dashboard";


function AppRoutes() {
  const token = localStorage.getItem("token"); // Obtiene el token del almacenamiento local ya que el back ahi lo deja

  useEffect(() => {
    const checkToken = () => setToken(localStorage.getItem("token"));

    window.addEventListener("storage", checkToken); // Escucha cambios en localStorage
    return () => window.removeEventListener("storage", checkToken); // Limpieza del evento
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/" />} /> {/*OPERADOR ELVIS Redirige si no hay token */}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
