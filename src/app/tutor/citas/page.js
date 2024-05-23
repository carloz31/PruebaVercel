"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input, Table } from "antd";
import axios from "axios";
import { tutorItems } from "@/utils/menuItems";
import TableComponentCitas from "@/components/TableComponentCitas";
import { IconSearch } from "@tabler/icons-react";

const { Column, ColumnGroup } = Table;
const { Title } = Typography;

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [citas, setCitas] = useState([]);
  const [idUsuario,setIdUsuario] = useState();

  useEffect(() => {
    // Leer los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    
    if (id !== 0) {
      setIdUsuario(id);
    }
    else{
      console.log("habia 0 no guarde");
    }
   
    
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("userID")
    if(id != null && id !==undefined){
      const numero = parseInt(id, 10);
      setIdUsuario(numero);
      //console.log("sacando del logal storage");
      //console.log(numero);
    }
    else{
      console.log("No hay nada");
    }    
    
  }, []);

  useEffect(() => {
    if (idUsuario !== null && idUsuario !== undefined) {
      
      localStorage.setItem('userID', idUsuario.toString());    
    }
  }, [idUsuario]);



  /*
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");*/

  const onSearch = async () => {
    console.log("Se está realizando una búsqueda...");
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.backend}/citaApi/listarCitasPorTutorAlumno/10/${busquedaInput}`
      );

      const data = response.data.map((cita, index) => ({
        key: index,
        firstName: cita.citaXAlumnos[0]?.alumno.nombre,
        lastName: cita.citaXAlumnos[0]?.alumno.apellidoPaterno,
        lastName2: cita.citaXAlumnos[0]?.alumno.apellidoMaterno,
        fecha: cita.bloqueDisponibilidad.horaInicio.split('T')[0],
        requerimiento: cita.tipoTutoria.obligatoriedad,
        modalidad: cita.modalidad,
        tipoCita: cita.tipoTutoria.modalidad,
        estado: cita.citaXAlumnos[0]?.estado,
      }));
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const get = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.backend}/citaApi/listarCitasPorTutorAlumno/10/%20`
      );

      const data = response.data.map((cita, index) => ({
        key: index,
        firstName: cita.citaXAlumnos[0]?.alumno.nombre,
        lastName: cita.citaXAlumnos[0]?.alumno.apellidoPaterno,
        lastName2: cita.citaXAlumnos[0]?.alumno.apellidoMaterno,
        fecha: cita.bloqueDisponibilidad.horaInicio.split('T')[0],
        requerimiento: cita.tipoTutoria.obligatoriedad,
        modalidad: cita.modalidad,
        tipoCita: cita.tipoTutoria.modalidad,
        estado: cita.citaXAlumnos[0]?.estado,
      }));
      console.log(data);
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    get();
  }, []);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
      <Title style={{ color: "#043B71" }}>Lista de citas</Title>
        <Flex vertical gap="middle">
          <Flex style={{ alignItems: "center" }} gap="small">
            <Input
              placeholder="Buscar"
              value={busquedaInput}
              onChange={(e) => {
                setBusquedaInput(e.target.value);
              }}
              onPressEnter={onSearch}
              prefix={<IconSearch size={20} color="#aaa" />}
            ></Input>
          </Flex>
          <TableComponentCitas isLoading={isLoading} citas={citas} />
        </Flex>
      </LayoutComponent>
    </main>
  );
}
