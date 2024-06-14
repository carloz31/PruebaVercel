"use client";
import LayoutComponent from "@/components/LayoutComponent";
import React, { useEffect, useState } from "react";
import { Flex, Input, Spin, Typography } from "antd";
import axios from "@/utils/axiosConfig";
import { tutorItems } from "@/utils/menuItems";
import TableComponentCitas from "@/components/TableComponentCitas";
import { IconSearch } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

const { Title } = Typography;

export default function Home() {
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [citas, setCitas] = useState([]);
  const router = useRouter();

  
  // Función para la carga de la página

  const fetchData = async (searchTerm = "%20") => {
    searchTerm = searchTerm.trimStart();
    searchTerm = searchTerm === "" ? "%20" : searchTerm;

    setIsLoading(true);
    try {
      const response = await axios.get(
        `/citaApi/listarCitasPorTutorAlumno/${user.id}/${searchTerm}`,
      );

      const data = response.data.map((cita, index) => ({
        key: index,
        citaId: cita.id,
        alumnoId: cita.citaXAlumnos[0]?.alumno.id,
        firstName: cita.citaXAlumnos[0]?.alumno.nombre,
        lastName: cita.citaXAlumnos[0]?.alumno.apellidoPaterno,
        lastName2: cita.citaXAlumnos[0]?.alumno.apellidoMaterno,
        fecha:
          new Date(cita.bloqueDisponibilidad?.horaInicio).getFullYear() < 2000
            ? cita.fecha_creacion.split("T")[0]
            : cita.bloqueDisponibilidad.horaInicio.split("T")[0],
        hora:
          new Date(cita.bloqueDisponibilidad?.horaInicio).getFullYear() < 2000
            ? cita.fecha_creacion.split("T")[1].substring(0, 8)
            : cita.bloqueDisponibilidad.horaInicio
                .split("T")[1]
                .substring(0, 8),
        requerimiento: cita.tipoTutoria.obligatoriedad,
        modalidad: cita.modalidad,
        tipoCita: cita.tipoTutoria.modalidad,
        estado: cita.citaXAlumnos[0]?.estado,
        asistencia: cita.citaXAlumnos[0]?.asistencia,
        descripcion: cita.citaXAlumnos[0]?.descripcion,
        comentarios: cita.citaXAlumnos[0]?.comentarios,
        tipoTutoria: cita.tipoTutoria.nombre,
      }));
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ejecución de la carga de la página
  useEffect(() => {
    if (user && user?.id) {
      fetchData();
    }
  }, [user]);

  console.log("Citas: ", citas);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Title style={{ color: "#043B71" }}>Lista de citas</Title>
        <Flex vertical gap="middle">
          <Flex style={{ alignItems: "center" }} gap="small">
            <Input
              placeholder="Buscar"
              onPressEnter={(e) => fetchData(e.target.value)}
              prefix={<IconSearch size={20} color="#aaa" />}
            ></Input>
          </Flex>
          <TableComponentCitas isLoading={isLoading} citas={citas} />
        </Flex>
      </LayoutComponent>
    </main>
  );
}
