"use client";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import { Button, Flex, Typography, Modal, Input, message } from "antd";
import axios from "axios";
import { tutorItems } from "@/utils/menuItems";
import CardAlumnoSesion from "@/components/cards/cardAlumnoSesion";
import './App.css';

const { Title } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const get = async () => {
    setIsLoading(true);
  };

  const { id: tutorId } = useParams(); // Obtenemos el ID del tutor de los parámetros de la ruta
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [valorInput, setValorInput] = useState('');
  

  useEffect(() => {
    const obtenerFechaYHora = () => {
      const ahora = new Date();
      const fechaFormateada = ahora.toLocaleDateString(); // Obtiene la fecha en formato local
      const horaFormateada = ahora.toLocaleTimeString(); // Obtiene la hora en formato local

      setFecha(fechaFormateada); // Actualiza el estado con la fecha
      setHora(horaFormateada); // Actualiza el estado con la hora
    };

    // Llama a la función para obtener la fecha y la hora actual cuando el componente se monta
    obtenerFechaYHora();

    // Actualiza la fecha y hora cada segundo
    const intervalo = setInterval(obtenerFechaYHora, 1000);

    // Limpia el intervalo cuando el componente se desmonta para evitar fugas de memoria
    return () => clearInterval(intervalo);
  }, []);

  const siderStyle = {
    color: "black",
    backgroundColor: "#fff",
    width: "50%",
    marginLeft: "1%",
    marginTop: "2%"
  };

  const containerStyle = {
    backgroundColor: "white",
    height: "80%"
  }

  const labelStyleSesion = {
    height: "100%",
    marginLeft: "0%",
    color: "#043B71",
    fontWeight: "semiBold",
    fontSize: "20px"
  }
  const bttnStyle = {
    marginLeft: "20%",
    width: "20%",
    height: "auto",
    border: "2px #4096ff", /* Borde de color azul */
    color: "white", /* Texto con color azul */
    backgroundColor: "#0663BD", /* Fondo transparente */
    fontSize: "12px", /* Tamaño de fuente */
    cursor: "pointer", /* Cambia el cursor al pasar el ratón */
    borderRadius: "10px" /* Bordes redondeados */
  }

  const contenedorStyle = {
    display: "flex", /* Utiliza flexbox */
    alignItems: "center", /* Alinea verticalmente los elementos al centro */
  }
  const fechaStyle = {
    color: "#043B71",
    fontWeight: "Bold",
    marginBottom: "0rem", // Puedes ajustar el margen inferior según tus necesidades
  };
  
  const horaStyle = {
    color: "#043B71",
    fontWeight: "Bold",
    marginBottom: "0rem", // Puedes ajustar el margen inferior según tus necesidades
  };
  const contenedorFecha = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "10%"
  };
  
  const contenedorHora = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "10%"
  };
  
  const handleInputChange = (event) => {
    const nuevoValor = event.target.value;
    setValorInput(nuevoValor);

  };

  const [alumnos, setAlumnos] = useState([]);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [resetSelection, setResetSelection] = useState(false);


  //NUEVO: Para obtener el id de URL --> idTutor ya no hardcodeado
  // useEffect(() => {
  //   const idPrueba = localStorage.getItem("userID")
  //   if(idPrueba != null && idPrueba!==undefined){
  //     const numero = parseInt(idPrueba, 10);
  //     setUsuarioSeleccionado(numero)
  //   }
  //   else{
  //     console.log("No hay nada");
  //   }
  // }, [])
  // console.log(usuario);


  const handleToggleSelection = (alumnoId, selected) => {
    if (selected) {
      // Si el alumno está seleccionado, lo deselecciona y lo remueve del arreglo de alumnos seleccionados
      setAlumnosSeleccionados(alumnosSeleccionados.filter(id => id !== alumnoId));
    } else {
      // Si el alumno no está seleccionado, lo selecciona y lo agrega al arreglo de alumnos seleccionados
      setAlumnosSeleccionados([...alumnosSeleccionados, alumnoId]);
    }
  };


  useEffect(() => {
    // Define una función asincrónica para hacer la solicitud a la API
  const fetchData = async () => {
    try {  
      if (valorInput.trim() !== '') {
        const url = `${process.env.backend}/alumnoApi/listarAlumnosPorNombre/${valorInput}`;
        const response = await axios.get(url);
        setAlumnos(response.data);
        return response.data;
      }
    } catch (error) {
      console.error("Error al obtener datos de la API: Listar alumnos por nombre", error);
    }
  };

  // Llama a la función fetchData
  fetchData();
  }, [valorInput]);


  //NUEVO PARA PASAR DATA DTO
  const handleCrearSesion = async () => {
    if (!alumnosSeleccionados || alumnosSeleccionados.length === 0) {
      message.error("Se debe seleccionar al menos un alumno.");
      return;
    }
  
    const dataPayload = {
      idTutor: 4, //probe en json el id_persona = 4
      idAlumnos: alumnosSeleccionados,
    };
  
    try {
      //${process.env.backend}
      await axios.post(`${process.env.backend}/crearCitaSinBloqueDisponibilidad`, dataPayload);
      message.success("Cambios guardados exitosamente.");
      setAlumnosSeleccionados([]);
      setResetSelection(!resetSelection); // Cambia el estado para forzar la actualización
    } catch (error) {
      console.error('Error saving data:', error);
      message.error("Hubo un error al guardar los cambios.");
    }
  };



  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
      <div className="contenedor" style={contenedorStyle}>
        <Title className="font-semibold" style={{ color: '#043b71', textAlign: 'left' }}>Sesión de Tutoría</Title>
        <div className="contenedorFecha" style={contenedorFecha}>
          <label className="fecha" style={fechaStyle}>Fecha</label>
          <p>{fecha}</p>
        </div>
        <div className="contenedorHora" style={contenedorHora}>
          <label className="horaInicio" style={horaStyle}>Hora Inicio</label>
          <p>{hora}</p>
        </div>
        <div className="buttonContainerStyle">
          <Button className="buttonStyle" onClick={handleCrearSesion}>Crear Sesión</Button>
        </div>
      </div>
        <div className="container"  style={containerStyle} >
          <Input style={siderStyle} value={valorInput}  onInput={handleInputChange} placeholder="Buscar alumnos por nombre" />
          <div>
            {alumnos.map(alumno => (
              <CardAlumnoSesion 
                key={alumno.persona.id}
                alumno={alumno} 
                onToggleSelection={handleToggleSelection}
                resetSelection={resetSelection}
              />
            ))}
          </div>
        </div>
      </LayoutComponent>
    </main>
  );
}