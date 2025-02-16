import React, { useState } from 'react';
import SpinnerComponent from '../SpinnerComponent';
import axios from 'axios';
import { Navigate, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/login", null, {
        params: { usuario, password }
      })
      .then(response => {
        setTimeout(() => { // agregar este setTimeout
            navigate("/dashboard");
          }, 5000); // 5000ms = 5 segundos
        })
    } catch (error) {
      setError(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <SpinnerComponent />;
  }

  return (
    <div>
      {loading && <SpinnerComponent loading={loading} />}
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Usuario:</label>
        <input type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <br />
        <label>Password:</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <br />
        <button type="submit">Iniciar sesión</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default Login;
