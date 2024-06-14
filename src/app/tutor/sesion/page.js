"use client";
import { useUser } from "@/context/UserContext";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Input, message, Modal } from "antd";
import axios from "@/utils/axiosConfig";
import { tutorItems } from "@/utils/menuItems";
import CardAlumnoSesion from "@/components/cards/cardAlumnoSesion";
import "./App.css";
import { useRouter } from "next/navigation";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const get = async () => {
    setIsLoading(true);
  };

  const { id: tutorId } = useParams();
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [valorInput, setValorInput] = useState("");
  const router = useRouter();
  const { user } = useUser();

  
  useEffect(() => {
    if (user && user.id) {
      get();
    }
  }, [user]);

  useEffect(() => {
    const obtenerFechaYHora = () => {
      const ahora = new Date();
      const fechaFormateada = ahora.toLocaleDateString();
      const horaFormateada = ahora.toLocaleTimeString();

      setFecha(fechaFormateada);
      setHora(horaFormateada);
    };

    obtenerFechaYHora();

    const intervalo = setInterval(obtenerFechaYHora, 1000);

    return () => clearInterval(intervalo);
  }, []);

  const siderStyle = {
    color: "black",
    backgroundColor: "#fff",
    width: "50%",
    marginLeft: "1%",
    marginTop: "1%",
    marginBottom: "1%",
  };

  const containerStyle = {
    backgroundColor: "white",
    height: "80%",
    marginTop: "1%",
    borderRadius: "5px",
  };

  const fixedListStyle = {
    top: "102px",
    left: "270px",
    backgroundColor: "white",
    padding: "10px",
    borderRadius: "5px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  };

  const labelStyleSesion = {
    height: "100%",
    marginLeft: "0%",
    color: "#043B71",
    fontWeight: "semiBold",
    fontSize: "20px",
  };
  const bttnStyle = {
    marginLeft: "20%",
    width: "20%",
    height: "auto",
    border: "2px #4096ff",
    color: "white",
    backgroundColor: "#0663BD",
    fontSize: "12px",
    cursor: "pointer",
    borderRadius: "10px",
  };

  const contenedorStyle = {
    display: "flex",
    alignItems: "center",
  };
  const fechaStyle = {
    color: "#043B71",
    fontWeight: "Bold",
    marginBottom: "0rem",
  };

  const horaStyle = {
    color: "#043B71",
    fontWeight: "Bold",
    marginBottom: "0rem",
  };
  const contenedorFecha = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "10%",
  };

  const contenedorHora = {
    display: "flex",
    flexDirection: "column",
    marginLeft: "10%",
  };

  const handleInputChange = (event) => {
    const nuevoValor = event.target.value;
    setValorInput(nuevoValor);
  };

  const [alumnos, setAlumnos] = useState([]);
  const [alumnosSeleccionados, setAlumnosSeleccionados] = useState([]);
  const [resetSelection, setResetSelection] = useState(false);

  const handleToggleSelection = (alumno, selected) => {
    if (selected) {
      setAlumnosSeleccionados([...alumnosSeleccionados, alumno]);
    } else {
      setAlumnosSeleccionados(
        alumnosSeleccionados.filter((a) => a.persona.id !== alumno.persona.id),
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (valorInput.trim() !== "") {
          const url = `/alumnoApi/listarAlumnosPorNombre/${valorInput}`;
          const response = await axios.get(url);
          setAlumnos(response.data);
        } else {
          setAlumnos([]);
        }
      } catch (error) {
        console.error(
          "Error al obtener datos de la API: Listar alumnos por nombre",
          error,
        );
      }
    };

    fetchData();
  }, [valorInput]);

  const handleCrearSesion = async () => {
    if (!alumnosSeleccionados || alumnosSeleccionados.length === 0) {
      message.error("Se debe seleccionar al menos un alumno.");
      return;
    }

    Modal.confirm({
      title: "Confirmar acción",
      icon: <ExclamationCircleOutlined />,
      content: (
        <>
          <p>
            ¿Estás seguro de que deseas crear la sesión con los siguiente
            alumnos?
          </p>
          {alumnosSeleccionados.length > 0 && (
            <>
              <ul>
                {alumnosSeleccionados.map((alumno, index) => (
                  <li key={index}>
                    {`${index + 1}) ${alumno.persona.nombre} ${alumno.persona.apellidoPaterno} ${alumno.persona.apellidoMaterno}`}
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ),
      okText: "Confirmar",
      cancelText: "Cancelar",
      onOk() {
        const hide = message.loading("Creando cita...", 0);
        // Lógica para crear la sesión
        const dataPayload = {
          idTutor: user.id,
          idAlumnos: alumnosSeleccionados.map((alumno) => alumno.persona.id),
        };
        debugger;
        axios
          .post(`/crearCitaSinBloqueDisponibilidad`, dataPayload)
          .then(() => {
            hide();
            message.success("Cambios guardados exitosamente.");
            setAlumnosSeleccionados([]);
            setResetSelection(!resetSelection);
          })
          .catch((error) => {
            hide();
            console.error("Error saving data:", error);
            message.error("Hubo un error al guardar los cambios.");
          });
      },
      onCancel() {
        // Lógica cuando se cancela la acción
      },
    });
  };

  const filteredAlumnos =
    valorInput.trim() !== ""
      ? alumnos.filter((alumno) =>
          alumnosSeleccionados.some(
            (sel) => sel && sel.persona && sel.persona.id === alumno.persona.id,
          ),
        )
      : [];

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <div className="contenedor" style={contenedorStyle}>
          <Title
            className="font-semibold"
            style={{ color: "#043b71", textAlign: "left" }}
          >
            Sesión de Tutoría
          </Title>
          <div className="contenedorFecha" style={contenedorFecha}>
            <label className="fecha" style={fechaStyle}>
              Fecha
            </label>
            <p>{fecha}</p>
          </div>
          <div className="contenedorHora" style={contenedorHora}>
            <label className="horaInicio" style={horaStyle}>
              Hora Inicio
            </label>
            <p>{hora}</p>
          </div>
          <div className="buttonContainerStyle">
            <Button className="buttonStyle" onClick={handleCrearSesion}>
              Crear Sesión
            </Button>
          </div>
        </div>
        <div style={fixedListStyle}>
          <h2 style={{ display: "inline" }}>Alumnos seleccionados: </h2>
          <span style={{ display: "inline" }}>
            {alumnosSeleccionados.map((alumno, index) => (
              <span key={alumno.persona.id}>
                {index > 0 && ", "}
                {`${alumno.persona.nombre} ${alumno.persona.apellidoPaterno} ${alumno.persona.apellidoMaterno} (${alumno.persona.id})`}
              </span>
            ))}
          </span>
        </div>
        <div className="container" style={containerStyle}>
          <Input
            style={siderStyle}
            value={valorInput}
            onInput={handleInputChange}
            placeholder="Buscar alumnos por nombre"
          />
          {valorInput.trim() !== "" && (
            <div className="cards-container">
              {alumnos.map((alumno) => (
                <CardAlumnoSesion
                  key={alumno.persona.id}
                  alumno={alumno}
                  onToggleSelection={handleToggleSelection}
                  selected={alumnosSeleccionados.some(
                    (sel) => sel.persona.id === alumno.persona.id,
                  )}
                  resetSelection={resetSelection}
                />
              ))}
            </div>
          )}
          {alumnosSeleccionados.length === 0 && (
            <div className="cards-container">
              {filteredAlumnos.map((alumno) => (
                <CardAlumnoSesion
                  key={alumno.persona.id}
                  alumno={alumno}
                  onToggleSelection={handleToggleSelection}
                  selected={alumnosSeleccionados.some(
                    (sel) => sel.persona.id === alumno.persona.id,
                  )}
                  resetSelection={resetSelection}
                />
              ))}
            </div>
          )}
        </div>
      </LayoutComponent>
    </main>
  );
}
