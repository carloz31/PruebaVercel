"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import CardAlumnoTutor from "@/components/cards/cardAlumnoTutor";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input, Card, Row, Col } from "antd";
import axios from "axios";
import { tutorItems } from "@/utils/menuItems";
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

/*
let PlanAccion = {
  titulo: "Plan de Acción",
  descripcion: "Realizar plan de acción para el alumno",
  fechaFin: "2021-12-31",
};
*/

let Programa = {
  nombre: "Tutoria General",
};

export default function Home() {
  const [busquedaInput, setBusquedaInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alumnos, setAlumnos] = useState([]);
  const [idUsuario,setIdUsuario] = useState(null); //se debe leer el id proporcionado por el usuario logueado
  const router = useRouter();

  useEffect(() => {
    
    const id = localStorage.getItem("userID")
    if(id !== null && id !== undefined){
      setIdUsuario(id);
    }
    else{
      console.log("No hay nada");
      router.push('/login');
    }    
  }, [router]);

  useEffect(() => {
    if (idUsuario !== null) {
      getAlumnos();
    }
  }, [idUsuario]);

  const getAlumnos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.backend}/alumnoApi/listarAlumnosAsignados/${idUsuario}`);
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error fetching alumns:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Flex style={{ alignItems: "left" }}>
          <Title style={{ textAlign: "left", color: "#043b71" }}>Alumnos Asignados</Title>
        </Flex>
        <Flex
          gap="middle"
          align="flex-start"
          style={{height: "100%"}}
          vertical
        >
          <Flex gap="middle" style={{ width: "100%" }}>
            <Button type="primary">Buscar</Button>
            <Input
              placeholder="Buscar alumno por nombre o código..."
              onChange={(e) => {
                setBusquedaInput(e.target.value);
              }}
              //onPressEnter={onSearch}
            ></Input>
          </Flex>
          <Flex style={{ width: "100%", flexDirection: 'column' }} gap="middle">
            {alumnos.map((alumno) => (
              <Flex vertical gap="small" key={alumno.id}>
                <CardAlumnoTutor alumno={alumno} programa={Programa} />
              </Flex>
            ))}
          </Flex>
        </Flex>
      </LayoutComponent>
    </main>
  );
}

