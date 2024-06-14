"use client";
//prueba
//prueba
import { notFound, useSearchParams } from "next/navigation";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState, Suspense } from "react";
import {
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Breadcrumb,
  Divider,
  Form,
  Select,
  Spin,
} from "antd";
import axios from "@/utils/axiosConfig";
import { alumnoItems } from "@/utils/menuItems";
import { CardDetallePlan } from "./CardDetallePlan";
import CardCitaAlumno from "@/components/cards/cardCitaAlumno";
import { CardProgresoAlumno } from "./CardProgresoAlumno";
import TableComponentPlanAccionAlumno from "./TableComponentPlanAccionAlumno";
import { IconCirclePlus } from "@tabler/icons-react";
import { CardCitaTutor } from "./../CardCitaTutor";
const { Title } = Typography;

function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const urlParams = useSearchParams();
  const planAccionStr = urlParams.get("planAccion");
  const [planAccion, setPlanAccion] = useState([]);
  const [cita, setCita] = useState([]);
  const citaStr = urlParams.get("cita");
  const [grupoCompromiso, setGrupoCompromiso] = useState([]);
  const [compromisos, setCompromisos] = useState([]);
  const [gruposConCompromiso, setGruposConCompromisos] = useState([]);
  const [progreso, setProgreso] = useState(0);
  const decodeCita = async () => {
    if (citaStr) {
      const citaDecoded = JSON.parse(decodeURIComponent(citaStr));
      setCita(citaDecoded);
    }
  };

  const decodeAlumno = async () => {
    if (planAccionStr) {
      const planDecoded = JSON.parse(decodeURIComponent(planAccionStr));
      setPlanAccion(planDecoded);
    }
  };
  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    setIsLoading(true);
    decodeCita();
    decodeAlumno();
  }, [citaStr, planAccionStr]);

  useEffect(() => {
    get();
  }, []);

  const handlerListarGrupos = async (idPlan) => {
    try {
      const response = await axios.get(
        `/grupoCompromisoApi/ListarGruposCompromisoPorPlanAccion/${idPlan}`,
      );
      setGrupoCompromiso(response.data);
    } catch (error) {
      console.error(
        "Error al obtener datos de la API para el los grupos:",
        error,
      );
      return [];
    }
  };

  useEffect(() => {
    if (planAccion && planAccion[0]) {
      handlerListarGrupos(planAccion[0]?.id);
    }
  }, [planAccion]);

  console.log(grupoCompromiso);

  useEffect(() => {
    if (grupoCompromiso.length > 0) {
      let parcial = 0;
      let total = 0;

      grupoCompromiso.forEach((grupo) => {
        grupo.compromisos.forEach((compromiso) => {
          switch (compromiso.estado) {
            case "Inicio":
              parcial += 0;
              break;
            case "Proceso":
              parcial += 1;
              break;
            case "Terminado":
              parcial += 2;
              break;
            default:
              break;
          }
          total += 2; // Sumar 2 por cada compromiso encontrado
        });
      });

      const progresoCalculado = (parcial / total) * 100;
      setProgreso(progresoCalculado);
    }
  }, [grupoCompromiso]);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={alumnoItems}>
        <Breadcrumb
          items={[
            {
              title: (
                <a href={`/alumno/citas`} style={{ fontSize: "15px" }}>
                  Lista de Citas
                </a>
              ),
            },
            {
              //title: <a href={`/alumno/citas/detalle`} style={{fontSize:"15px"}}>Información cita</a>
              title: (
                <a
                  href={`/alumno/citas/detalle?cita=${encodeURIComponent(JSON.stringify(cita))}`}
                  style={{ fontSize: "15px" }}
                >
                  Información cita
                </a>
              ),
            },
            {
              title: <p style={{ fontSize: "15px" }}>Plan de acción</p>,
            },
          ]}
          separator="/"
          style={{
            marginBottom: "18px",
          }}
        />
        <Title style={{ color: "#043B71" }}>Plan de acción</Title>

        <Flex style={{ width: "100%" }} gap="middle">
          <Flex vertical style={{ width: "50%" }}>
            <Title level={4}>Datos del plan de acción</Title>
            <CardDetallePlan plan={planAccion} cita={cita}></CardDetallePlan>
          </Flex>

          <Flex vertical style={{ width: "50%" }} gap="middle">
            <Flex vertical>
              <Title level={4}>Tutor</Title>
              <CardCitaTutor tutor={cita.tutor} />
            </Flex>
            <Flex vertical>
              <CardProgresoAlumno
                style={{ height: "20px" }}
                plan={planAccion}
                cita={cita}
                progreso={progreso}
                showButton={false}
              />
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        <Flex>
          <Title level={2} style={{ color: "#043B71", width: "100%" }}>
            Compromisos
          </Title>
        </Flex>
        <Flex vertical gap="large">
          {grupoCompromiso.length > 0 &&
            grupoCompromiso.map((grupo, index) => (
              <TableComponentPlanAccionAlumno
                grupoCompromiso={grupo}
                index={index}
              />
            ))}
        </Flex>
      </LayoutComponent>
    </main>
  );
}

function PlanAccionWrapper() {
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

export default PlanAccionWrapper;
