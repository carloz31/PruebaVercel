"use client";
//prueba

import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Form, Modal, Input } from "antd";
import axios from "@/utils/axiosConfig";
import { alumnoItems } from "@/utils/menuItems";
import { useRouter } from "next/navigation";
const { Title } = Typography;
import { TablaCitasAlumno } from "./TablaCitasAlumno";
import { useUser } from "@/context/UserContext";

export default function Home() {
  //Para conseguir el Id
  const [isLoading, setIsLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState();
  const router = useRouter();
  const { user } = useUser();
  const [form] = Form.useForm();
  //Listado de citas
  const [listaCitas, setListaCitas] = useState([]);
  const [usuarioAlumno, setUsuarioAlumno] = useState([]);
  const [grupoCompromiso, setGrupoCompromiso] = useState([]);

  const get = async () => {
    setIsLoading(true);
    if (user?.rolSeleccionado !== 4) {
      router.back();
      return;
    }
  };

  //Para conseguir el ID
  /*useEffect(() => {
    const id = localStorage.getItem("userID")
    if(id !== null && id !== undefined){
      setIdUsuario(id);
    }
    else{
      console.log("No hay nada");
      //router.push('/login');
    }
  }, [router]);*/

  /*useEffect(() => {
    if (idUsuario !== null && idUsuario !== undefined) {
      localStorage.setItem('userID', idUsuario.toString());
    }
  }, [idUsuario]);

  useEffect(() => {
    get();
  }, []);*/

  const handleListarCitas = async (idAlumnoPersona) => {
    try {
      const response = await axios.get(
        `/citaApi/obtenerCitasPorAlumno/${idAlumnoPersona}`,
      );
      setListaCitas(response.data);
    } catch (error) {
      console.error("Error al obtener datos de la API para la cita:", error);
      return [];
    }
  };

  /*useEffect(() =>{
    if(planAccion && planAccion[0])
      handlerListarGrupos(planAccion[0]?.id)
  },[planAccion]); */

  const handlerBuscarAlumno = async (idUsuario) => {
    try {
      //console.log({user});
      const response = await axios.get(
        `/alumnoApi/listarAlumnoPorIdUsuario/${idUsuario}`,
      );
      setUsuarioAlumno(response.data);
    } catch (error) {
      console.error("Error al obtener datos de la API: Alumno", error);
    } finally {
    }
  };

  const handleRenderizaListaCitas = async () => {
    setListaCitas([]);
    await handleListarCitas(usuarioAlumno[0].persona.id);
  };

  //Buscar alumno y citas
  useEffect(() => {
    if (user !== null && user?.id !== undefined) handlerBuscarAlumno(user?.id);
  }, [user]);

  useEffect(() => {
    if (usuarioAlumno[0]?.persona?.id) {
      handleListarCitas(usuarioAlumno[0]?.persona?.id);
    }
  }, [usuarioAlumno[0]?.persona?.id]);

  console.log({ user });
  console.log({ usuarioAlumno });

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={alumnoItems}>
        <Title style={{ color: "#043B71" }}>Lista de Citas</Title>
        <TablaCitasAlumno
          citas={listaCitas}
          alumno={usuarioAlumno}
          onUpdateCitas={handleRenderizaListaCitas}
        />
      </LayoutComponent>
    </main>
  );
}
