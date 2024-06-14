"use client";
import { useUser } from "@/context/UserContext";
import LayoutComponent from "@/components/LayoutComponent";
import React, { Suspense, useEffect, useState } from "react";
import { Button, Divider, Flex, Input, Spin, Typography } from "antd";
import axios from "@/utils/axiosConfig";
import { tutorItems } from "@/utils/menuItems";
import TableComponentCitas from "@/components/TableComponentCitas";
import { IconSearch } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import CardAlumnoMini from "@/components/cards/cardAlumnoMini";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

const { Title } = Typography;

function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const nombre = searchParams.get("nombre");
  const apellido = searchParams.get("apellido");
  const codigo = searchParams.get("codigo");

  const [isLoading, setIsLoading] = useState(false);
  const [idAlumno, setIdAlumno] = useState(id);
  const [citas, setCitas] = useState([]);
  const router = useRouter();
  const { user } = useUser();

  // Función para la carga de la página

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `/citaApi/listarCitasPorTutorIDAlumnoID/${user.id}/${idAlumno}`,
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
    console.log(user);
    if (user && user.id) {
      fetchData();
    }
  }, [user, idAlumno]);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Title style={{ color: "#043B71" }}>Histórico de citas</Title>
        <Button style={{ marginBottom: 8 }} onClickCapture={router.back}>
          Regresar
        </Button>
        <CardAlumnoMini nombre={nombre} apellido={apellido} codigo={codigo} />
        <TableComponentCitas
          isLoading={isLoading}
          citas={citas}
          alumnoVisible={false}
        />
        <Divider />
      </LayoutComponent>
    </main>
  );
}

function HistoricoWrapper() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}

export default HistoricoWrapper;
