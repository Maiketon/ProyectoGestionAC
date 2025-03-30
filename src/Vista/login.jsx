//COMPONENTE PRINCIPAL DE LOGIN//
//DECLARACION DE LIBRERIAS Y HOOKS//
import React, {useState,useEffect} from "react";
import SpinnerComponent from '../SpinnerComponent';   // Lib para Spinner
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import LogoAlcaldia from "./Utils/Images/LogoAlcaldiaHorizontal.png";
import LogoAlcaldiaFondo from "./Utils/Images/wall_proyecto.png";

//MODALES O COMPONENTES//
import ModalLogin from "./Modales/modalLogin";

const Login = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Estado para mostrar spinner
    const [mensajeModal, setMensajeModal] = useState('');
    const [esIncorrecto, setEsIncorrecto] = useState(false);
    const [showModal, setShowModal] = useState(false);

/*
Autor: Miguel Angel Montoya Bautista && Abraham Alvarado Gutierrez
Fecha : 2/2/25
Descripción: Funcion ligada al boton de "Login" la cual permite hacer la petición de validacion del usuario a la base de datos
y guardar en almacenamiento local del browser un token de protección de rutas y id del usuario
///////////////////////MODIFICACIONES//////////////////////////////////////

*/
  const iniciarSesion = async (event) => {
    event.preventDefault();
    setLoading(true); // Mostrar spinner
    setTimeout(async () => {

    try {
        console.log(usuario, password);
        const response = await axios.post("http://127.0.0.1:8000/login", null, {
          params: { usuario, password }
        } 
        );
    
     
        if (response.data.status ==="success") {
            setEsIncorrecto(false);

          console.log("Login exitoso");
          console.log("Usuario",usuario,"Contraseña",password);
          localStorage.setItem("token", response.data.access_token); //GUARDA EL TOKEN ANTES DE HACER EL REDIRECCIONAMIENTO//
          localStorage.setItem("id_user", response.data.id_user); //SE GUARDA EL ID DEL USUARIO QUE ESTA HACIENDO LOGIN //
          localStorage.setItem("type_user", response.data.type_user); //SE GUARDA EL-TIPO DE USUARIO ADMIN T , NORMAL F
          localStorage.setItem("sUser", response.data.sUser); //SE GUARDA EL-TIPO DE USUARIO ADMIN T , NORMAL F
          setTimeout(() => {
            setLoading(false); // Mostrar spinner
            navigate("/dashboard");
          }); //SIMULA UNA PETICIÓN AL SERVIDOR PARA QUE SE VISUALICE EL SPINNER//
 
        }
        } 
        catch (error) {
        //console.error("Error en la solicitud:", error);
        console.error("Error en la solicitud se uvicorn:", error.response?.data || error.message);
        //alert("Usuario o contraseña incorrectos");
        setMensajeModal("Usuario o contraseña incorrectos ❌");
        setEsIncorrecto(true);
        setShowModal(true);
        setLoading(false);}
        }, 2500); //Tiempo de espera en segs.
};


/*
Autor: Miguel Angel Montoya Bautista
Fecha: 2-2-25
Decripción: //Evitar el scroll a toda costa//
*/
useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

return (
    <>

    loading ? (<SpinnerComponent loading={loading} />)
         
    <div className="background-container"
          style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", 
          backgroundImage: `url(${LogoAlcaldiaFondo})`, 
          backgroundSize: "1600px", 
          backgroundRepeat: "repeat", 
          backgroundPosition: "center", 
          zIndex: 0, 
          animation: "moveBackground 100s linear infinite" 
        }}>

      </div>

      <div className="container-fluid d-flex min-vh-100 justify-content-center align-items-center">

        <div className="card p-4 shadow-lg" 
          style={{
            maxWidth: "400px",
            width: "90%",
            borderRadius: "10px",
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            transform: "translateY(-10%)" // Elevar formulario
          }}
        >

        <div className="text-center mb-3">
          <img
            src={LogoAlcaldia}
            alt="Logo"
            className="img-fluid"
            style={{ maxWidth: "150px", height: "auto" }}
          />
        </div>

        <h4 className="text-center mb-2 fw-bold" style={{ fontSize: "1rem" }}>
          Sistema de Gestión de Jefatura de la Alcaldía Cuauhtémoc
        </h4>
        
        <h2 className="text-center mb-4" style={{ fontSize: "1.5rem" }}>
          Iniciar Sesión
        </h2>

        <form onSubmit={iniciarSesion}>
          <div className="mb-3" >
            <label className="form-label">Usuario</label>
            <input
              type="text"
              className="form-control"
              style={{ backgroundColor: "white !important" }}
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              style={{ backgroundColor: "white !important" }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
        </form>
        </div>
      </div>

      {/* Animación CSS para el fondo */}
    <style>
        {`
          body, html {
            margin: 0;
            padding: 0;
            position: relative;
            overflow: hidden; /* Para evitar el scroll no deseado */
          }
        
          @keyframes moveBackground {
            from { background-position: 0 0; }
            to { background-position: 500px 500px; } /* Mueve el fondo suavemente */
          }
        `}
    </style>

    <ModalLogin
        show={showModal}
        onHide={() => setShowModal(false)}
        mensaje={mensajeModal}
        esIncorrecto={esIncorrecto}/>
    </>
  );
}

export default Login;