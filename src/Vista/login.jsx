
//DECLARACION DE LIBRERIAS Y HOOKS//
import React, {useState,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios';
import LogoAlcaldia from "./Utils/Images/LogoAlcaldiaHorizontal.png";
import LogoAlcaldiaFondo from "./Utils/Images/wall_proyecto.png";

//MODALES O COMPONENTES//
import ModalLogin from "./Modales/modalLogin";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState(""); 
  const [spinnerActivo, setActivar] = useState(false);
  const navigate = useNavigate(); // Hook para redirigir

  //VARIABLES MODAL//
  const [showModal,setShowModal]= useState(false);
  const [mensajeModal, setMensajeModal] = useState ("");
  const [esIncorrecto,setEsIncorrecto]= useState(false);


  /*const handleSubmit = (event) => {
    event.preventDefault();

    // Simulación de validación (User: maik, Password: 1234)
    if (usuario === "maik" && password === "1234") {
        setShowModal(true);
        setMensajeModal("Inicio de sesión exitoso 🎉");
      console.log("Login exitoso");
      console.log("Usuario",usuario,"Contraseña",password);
      setTimeout(() => {
        setShowModal(false);
        navigate("/dashboard");
      }, 2000);
    } else {
        setMensajeModal("Usuario o contraseña incorrectos ❌");
        setShowModal(true);
    }
  };*/
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {

        console.log(usuario, password);
        setActivar(true);
        const response = await axios.post("http://127.0.0.1:8000/login", null, {
          params: { usuario, password }
        });
      
        console.log("Respuesta del backend:", response);
      
        if (response.data.status ==="success") {
            setEsIncorrecto(false);
            setShowModal(true);
            setMensajeModal("Inicio de sesión exitoso 🎉 \n Accediendo al sistema...");
          console.log("Login exitoso");
          console.log("Usuario",usuario,"Contraseña",password);
          localStorage.setItem("token", response.data.access_token); //GUARDA EL TOKEN ANTES DE HACER EL REDIRECCIONAMIENTO//
          setTimeout(() => {
            setShowModal(false);
            navigate("/dashboard");
          }, 1000);
          //navigate("/dashboard");
        }
      } catch (error) {
        //console.error("Error en la solicitud:", error);
        console.error("Error en la solicitud se uvicorn:", error.response?.data || error.message);
        //alert("Usuario o contraseña incorrectos");
        setMensajeModal("Usuario o contraseña incorrectos ❌");
        setEsIncorrecto(true);
        setShowModal(true);
        
      }


};

//Evitar el scroll a toda costa//
useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);


  return (
    <>
      <div
  className="background-container"
  style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100vh",
    backgroundImage: `url(${LogoAlcaldiaFondo})`,
    backgroundSize: "1600px", // Ajusta el tamaño del patrón
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
    zIndex: 0, // Asegura que sea visible
    animation: "moveBackground 100s linear infinite"
  }}
></div>

      <div
        className="container-fluid d-flex min-vh-100 justify-content-center align-items-center"
      >
        <div
          className="card p-4 shadow-lg"
          style={{
            maxWidth: "400px",
            width: "90%",
            borderRadius: "10px",
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

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
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
