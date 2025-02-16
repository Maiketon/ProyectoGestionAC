import React, { useEffect } from 'react';
import { HashLoader } from 'react-spinners';

const SpinnerComponent = ({ loading }) => {
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden'; // Ocultar el scroll
      document.body.style.position = 'fixed'; // Bloquear la pantalla
    } else {
      document.body.style.overflow = 'auto'; // Mostrar el scroll
      document.body.style.position = 'relative'; // Desbloquear la pantalla
    }
  }, [loading]);

  if (!loading) return null;
  return (

    <path 
      d="M2.5 50.75 A47.74 47.74 0 0 1 25 0 A47.74 47.74 0 0 1 72.5 50.75 L72 50.75"
      fill="none" 
      stroke="#fff" 
      strokeWidth="3.5"
    />

    <div style={{ position: 'fixed', 
                  top: center, 
                  left: center, 
                  width: '100%', 
                  height: '100%', 
                  backgroundColor: 'rgba(192, 196, 7, 0.77)' }}>
                    
      <HashLoader 
        color="#36d7b7" 
        size={50} 
        loading={loading} 
      />
      <HashLoader 
        color="#dec518"
        size={50} 
        loading={loading} 
      />
        <HashLoader 
        color="#187edb"
        size={50} 
        loading={loading} 
      />
        <HashLoader 
        color="#db1818"
        size={50} 
        loading={loading} 
      />

    </div>
  );
};

export default SpinnerComponent;