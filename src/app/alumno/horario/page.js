"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";

import { useEffect, useState, Suspense } from "react";
import {
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Select,
  Form,
  notification,
} from "antd";
import axios from "@/utils/axiosConfig";
import { alumnoItems } from "@/utils/menuItems";
import { Calendar } from "./Calendario";
const { Title, Text } = Typography;
import "./horario.css";
import { MinusCircleFilled } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const [disponibilidad, setDisponibilidad] = useState([]);
  const [bloquesDisponibilidad, setBloqueDisponibilidad] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filtro, setFiltro] = useState("");
  const [tutores, setTutores] = useState([]);
  const [tutorSelccionado, setTutorSeleccionado] = useState();
  const [tutorId, setTutorId] = useState();
  const [idDispo, setIdDispo] = useState();
  //const [idUsuario,setIdUsuario] = useState();
  const [idTutoria, setIdTutoria] = useState(-1);
  const [tiposTutoriaPorAlumno, setTiposTutoriaAlumno] = useState([]);
  const [tutoriaSeleccionada, setTutoriaSeleccionada] = useState();
  const router = useRouter();
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const startDate = new Date();
  const monthName = months[startDate.getMonth()]; // Obtén el nombre del mes actual
  const year = startDate.getFullYear();
  const formattedDate = `${monthName} ${year}`;
  const [tutoriaFija, setTutoriaFija] = useState(false);
  const [isCliente, setIsClient] = useState(false);
  const [esSolicitado, setEsSolicitado] = useState(false);
  const [citaReprogramada, setCitaReprogramada] = useState();

  const { user } = useUser();
  const get = async () => {
    setIsLoading(true);
    if (user?.rolSeleccionado !== 4) {
      router.back();
      return;
    }
  };

  //LEER EL ID DEL LOCAL STORAGE
  /*useEffect(() => {

    const id = localStorage.getItem("userID")
    if(id !== null && id !== undefined){
      setIdUsuario(id);
    } else {
      console.log("No hay nada");
      //router.push('/login');
    }
  }, [router]);*/

  useEffect(() => {
    // Leer los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const idTutor = Number(params.get("id1"));
    const idTutoria = Number(params.get("id2"));
    const cita = params.get("cita");
    setTutorId(idTutor);
    setIdTutoria(idTutoria);
    setCitaReprogramada(cita);
  }, []);
  // Ejecutar solo una vez al cargar la página
  useEffect(() => {
    get();
  }, []);

  //FUNCIONES AXIOS

  //ACTUALIZAR BLOQUE A SOLICITADO
  const handlerModificarBloqueASolicitado = async (idBloqueSolicitado) => {
    try {
      const response = await axios.get(
        `/bloqueDisponibilidadApi/cambiarBloqueASolicitado/${idBloqueSolicitado}`,
      );
      setBloqueDisponibilidad([]);
      await handlerElementosPorDisponibilidad(idDispo);
    } catch (error) {
      console.error(
        "Error al actualizar datos de la API: BloqueSolicitado",
        error,
      );
    } finally {
    }
  };

  //LISTAR DISPONIBILIDAD
  const handleListarDisponibilidad = async (idTutor) => {
    try {
      const response = await axios.get(
        `/disponibilidadApi/listarDisponibilidadPorTutor/${idTutor}`,
      );
      setDisponibilidad(response.data);
      setIdDispo(response.data[response.data.length - 1].idDisponibilidad);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
      return [];
    }
  };

  //LISTAR BLOQUES DISPONIBILIDAD POR DISPONIBILIDAD
  const handlerElementosPorDisponibilidad = async (idDisponibilidad) => {
    try {
      const response = await axios.get(
        `/bloqueDisponibilidadApi/listarBloqueDisponibilidadPorDisponibilidad/${idDisponibilidad}`,
      );
      setBloqueDisponibilidad(response.data);
      return response.data; // Devuelve la lista de elementos
    } catch (error) {
      console.error("Error al obtener datos de la API: ", error);
      return []; // Devuelve un arreglo vacÃo en caso de error
    }
  };

  //LISTAR TUTORIAS POR ALUMNO
  const handlerListarTutoriasPorAlumno = async (idUsuario) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/tipoTutoriaApi/listarTiposTutoriaXAlumno/${idUsuario}`,
      );
      setTiposTutoriaAlumno(response.data);
      return response.data;
    } catch (error) {
      console.error(
        "Error al obtener datos de la API: Tipos tutoria por alumno",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlerListarTutores = async (id, nombre, idTipo) => {
    setIsLoading(true);

    if (tutoriaSeleccionada) {
      console.log("hola");
      try {
        if (tutoriaSeleccionada.tipoTutor === "Fijo") {
          const response = await axios.get(
            `/tutorApi/listarTutorFijo/${id}/${idTipo}`,
          );
          setEsSolicitado(false);
          setTutoriaFija(true);
          if (response.data.length <= 0) {
            setTutores([]);
          } else {
            setTutores(response.data);
            setTutorSeleccionado(response.data[0]);
            setEsSolicitado(false);
          }
        } else {
          const response = await axios.get(
            `/tutorApi/listarTutorPorAlumno/${id}/${nombre}/${idTipo}`,
          );
          //bloquesDisponibilidad.
          setTutores(response.data);
          setEsSolicitado(false);
          setTutoriaFija(false);
        }
      } catch (error) {
        console.error(
          "Error al obtener datos de la API: listar tutores",
          error,
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (tutorSelccionado?.persona?.id) {
      handleListarDisponibilidad(tutorSelccionado.persona.id);
    }
  }, [tutorSelccionado]);

  useEffect(() => {
    if (idDispo > 0) handlerElementosPorDisponibilidad(idDispo);
  }, [idDispo]);

  useEffect(() => {
    if (user?.id !== 0 && user !== null && user?.id != undefined) {
      handlerListarTutoriasPorAlumno(user?.id);
    }
  }, [user, idTutoria]);

  useEffect(() => {
    const textoInicial = "%20";
    if (idTutoria && tiposTutoriaPorAlumno.length > 0) {
      const tutoriaSelccionada = tiposTutoriaPorAlumno.find(
        (tutoria) => tutoria.idTipoTutoria === idTutoria,
      );

      if (tutoriaSelccionada) {
        setTutoriaSeleccionada(tutoriaSelccionada);

        setIdTutoria(tutoriaSelccionada.idTipoTutoria);
        handlerListarTutores(user?.id, textoInicial, idTutoria);
      }
    }
  }, [user, idTutoria, tiposTutoriaPorAlumno]);

  useEffect(() => {
    const textoInicial = "%20";

    if (tutoriaSeleccionada) {
      setTutoriaSeleccionada(tutoriaSeleccionada);

      setIdTutoria(tutoriaSeleccionada.idTipoTutoria);
      handlerListarTutores(
        user?.id,
        textoInicial,
        tutoriaSeleccionada.idTipoTutoria,
      );
    }
  }, [tutoriaSeleccionada, user]);

  useEffect(() => {
    if (tutorId) {
      const tutor = tutores.find((tutor) => tutor.persona.id === tutorId);
      if (tutor) {
        setTutorSeleccionado(tutor);
      }
    }
  }, [tutores, tutorId]);

  function handleChangeCmbBoxTutoria(value) {
    const tutoria = tiposTutoriaPorAlumno.find(
      (tutoria) => tutoria.idTipoTutoria === value,
    );
    if (tutoria) {
      setTutoriaSeleccionada(tutoria);

      if (tutoria.tipoTutor === "Variable" || tutoria.tipoTutor === "Fijo") {
        setTutorId(-1);
        setTutorSeleccionado(null);
        setBloqueDisponibilidad([]);
        setIdDispo(-1);
      }
    }
    setIdTutoria(value);
  }

  function handleChangeCmbBoxTutor(value) {
    const seleccionadoTutor = tutores.find(
      (tutor) => tutor.persona.id === value,
    );
    if (seleccionadoTutor) {
      setTutorSeleccionado(seleccionadoTutor);
      setTutorId(seleccionadoTutor.persona.id);
    }
  }

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (citaReprogramada) {
      notification["info"]({
        message: "Seleccione otro horario",
        description:
          "Seleccione algún horario disponible (verde) para reagendar su cita.",
      });
    }
  }, [citaReprogramada]);

  console.log(tutoriaSeleccionada);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={alumnoItems}>
        <div>
          <h1 className="titulo-principal">Agendar citas</h1>
        </div>
        <div className="fila-1">
          <div className="dropdownContainerStyle">
            <Text strong className="titleText">
              Tipo tutoría:
            </Text>
            {tiposTutoriaPorAlumno.length > 0 && (
              <Select
                value={
                  tutoriaSeleccionada?.idTipoTutoria || idTutoria || undefined
                }
                placeholder="Seleccione el tipo de tutoría" // Establecer el valor predeterminado, por ejemplo, el primer elemento del arreglo.
                style={{
                  width: "400px",
                }}
                className="dropdownStyle"
                onChange={handleChangeCmbBoxTutoria}
                options={tiposTutoriaPorAlumno.map((tutoria) => {
                  return {
                    value: tutoria.idTipoTutoria,
                    label: `${tutoria.nombre}`,
                  };
                })}
              ></Select>
            )}
          </div>
          <div className="contenedor-fecha">
            <p style={{ fontSize: 18 }}>
              {" "}
              {monthName} {year}
            </p>
          </div>
        </div>

        <div className="fila-2">
          <div className="dropdownContainerStyle">
            <Text strong className="titleText">
              Tutor:
            </Text>
            {
              <Select
                className="dropdownStyle"
                value={tutorSelccionado?.persona?.id || undefined}
                //placeholder="Seleccione el tutor"
                placeholder={
                  tutores.length <= 0
                    ? idTutoria <= 0
                      ? "Seleccione al tutor"
                      : "No hay tutores disponibles"
                    : "Seleccione el tutor"
                }
                style={{
                  width: "400px",
                }}
                disabled={tutoriaFija || idTutoria <= 0}
                onChange={handleChangeCmbBoxTutor}
                options={tutores.map((tutor) => {
                  return {
                    value: tutor.persona.id,
                    label: `${tutor.persona.nombre} ${tutor.persona.apellidoPaterno} ${tutor.persona.apellidoMaterno}`,
                  };
                })}
              />
            }
          </div>
          <ul className="horizontal-list">
            <div className="opcion">
              <MinusCircleFilled
                style={{
                  color: "#a7eeb8",
                  marginRight: "10px",
                }}
              />

              <li className="palabra"> Disponible </li>
            </div>
            <div className="opcion">
              <MinusCircleFilled
                style={{
                  color: "#D4C095",
                  marginRight: "10px",
                }}
              />

              <li className="palabra"> Ocupado </li>
            </div>
            <div className="opcion">
              <MinusCircleFilled
                style={{
                  color: "#B9D5EF",
                  marginRight: "10px",
                }}
              />
              <li className="palabra"> Reservado</li>
            </div>
          </ul>
        </div>
        <div className="calendario-contenedor">
          {isCliente && (
            <Calendar
              bloques={bloquesDisponibilidad}
              idTutorSeleccionado={tutorSelccionado?.persona?.id}
              idAlumno={user?.id}
              onUpdateBloque={handlerModificarBloqueASolicitado}
              idTutoria={idTutoria}
              nombreTutoria={tutoriaSeleccionada?.nombre}
            />
          )}
        </div>
      </LayoutComponent>
    </main>
  );
}
