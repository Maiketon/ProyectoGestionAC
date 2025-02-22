import React, { useState, useEffect } from 'react';
import { HashLoader } from 'react-spinners';
import './SpinnerStyles.css';

function SpinnerComponent({ loading }) {
  const [colorIndex, setColorIndex] = useState(0);
  const colors = ['#f4d03f', '#3498db', '#e74c3c']; // Amarillo, Azul, Rojo

  useEffect(() => {
    const interval = setInterval(() => {
      setColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1000); // Cambia cada 1 segundo

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, []);

  if (!loading) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <HashLoader 
        size={50} 
        speedMultiplier={1} 
        color={colors[colorIndex]} // Cambia de color automáticamente
        loading={loading} 
        style={{ margin: 20, transition: 'color 0.5s ease-in-out' }} 
      />
    </div>
  );
}

export default SpinnerComponent;
