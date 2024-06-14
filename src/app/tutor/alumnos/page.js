"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import CardAlumnoTutor from "@/components/cards/cardAlumnoTutor";
import { useEffect, useState } from "react";
import { Button, Flex, Typography, Modal, Input, Card, Row, Col } from "antd";
import axios from "@/utils/axiosConfig";
import { tutorItems } from "@/utils/menuItems";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

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
  const [filteredAlumnos, setFilteredAlumnos] = useState([]);
  const [idUsuario, setIdUsuario] = useState(null); //se debe leer el id proporcionado por el usuario logueado
  const router = useRouter();
  const { user } = useUser();

  

  useEffect(() => {
    if (user && user.id) {
      getAlumnos();
    }
  }, [user]);

  const getAlumnos = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/alumnoApi/listarAlumnosAsignados/${user.id}`,
      );
      setAlumnos(response.data);
    } catch (error) {
      console.error("Error fetching alumns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setBusquedaInput(value);

    const words = value.split(" ").filter(Boolean);

    const filtered = alumnos.filter((alumno) => {
      const fullName =
        `${alumno.nombre} ${alumno.apellido_paterno} ${alumno.apellido_materno}`.toLowerCase();
      return words.every((word) => fullName.includes(word));
    });

    setFilteredAlumnos(filtered);
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Flex style={{ alignItems: "left" }}>
          <Title style={{ textAlign: "left", color: "#043b71" }}>
            Alumnos Asignados
          </Title>
        </Flex>
        <Flex
          gap="middle"
          align="flex-start"
          style={{ height: "100%" }}
          vertical
        >
          <Flex gap="middle" style={{ width: "100%" }}>
            <Button type="primary">Buscar</Button>
            <Input
              placeholder="Buscar alumno por nombre o código..."
              onChange={handleSearch}
              value={busquedaInput}
            />
          </Flex>
          <Flex style={{ width: "100%", flexDirection: "column" }} gap="middle">
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
