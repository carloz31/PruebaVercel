"use client";
//prueba
import { notFound, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import LayoutComponent from "@/components/LayoutComponent";
import React, { Suspense, useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  Radio,
  Typography,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Spin,
  Breadcrumb,
} from "antd";
import axios from "@/utils/axiosConfig";
import { alumnoItems } from "@/utils/menuItems";

import { FilePdfOutlined, LinkOutlined } from "@ant-design/icons";
import {
  IconChevronRight,
  IconDownload,
  IconLoader,
  IconTrashFilled,
  IconTrashXFilled,
} from "@tabler/icons-react";
import Paragraph from "antd/es/typography/Paragraph";
import Link from "next/link";
import dayjs from "dayjs";
import { CardInfoCita } from "./CardInfoCita";
import { CardCitaTutor } from "./CardCitaTutor";

const { Title } = Typography;

function Home() {
  const urlParams = useSearchParams();
  const citaStr = urlParams.get("cita");
  const alumnoStr = urlParams.get("alumno");
  const [isLoading, setIsLoading] = useState(false);
  const [cita, setCita] = useState([]);
  const [alumno, setAlumno] = useState();
  const [virtual, setVirtual] = useState(false);
  const [planAccion, setPlanAccion] = useState([]);
  const [derivaciones, setDerivaciones] = useState([]);
  const [derivacionExistente, setDerivacionExistente] = useState(false);
  const [documentoDerivacion, setDocumentoDerivacion] = useState();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
    setPreviewFile(null);
  };

  const handlerListarPlanAccion = async (idAlumno, idCita, idTutor) => {
    try {
      const response = await axios.get(
        `/planDeAccionApi/listarPlanesAccionPorIdAlumnoIdCitaIdTutor/${idAlumno}/${idCita}/${idTutor}`,
      );
      setPlanAccion(response.data);
    } catch (error) {
      console.error(
        "Error al obtener datos de la API para el planAccion:",
        error,
      );
      return [];
    }
  };

  const fetchDerivaciones = async (idCita, idAlumno) => {
    if (idCita !== undefined && idAlumno !== undefined) {
      try {
        const response = await axios.get(
          `/fichaDerivacionApi/listarFichasDerivacionPorIdCitaIdAlumno/${idCita}/${idAlumno}`,
        );
        const listaDerivaciones = response.data;
        setDerivaciones(listaDerivaciones);

        if (listaDerivaciones?.length > 0) {
          setDerivacionExistente(true);
        } else {
          setDerivacionExistente(false);
        }
      } catch (error) {
        console.error(
          "Error al obtener datos de la API ficha derivacion:",
          error,
        );
      }
    }
  };

  const obtenerFichaDerivacion = async (idFichaDerivacion) => {
    try {
      //busca documentacion
      setPreviewVisible(true);
      setIsLoading(true);
      const responseDoc = await axios.get(
        `/fichaDerivacionApi/obtenerFichaGenerada/${idFichaDerivacion}`,
        {
          responseType: "blob",
        },
      );
      //console.log(responseDoc.data);
      if (responseDoc.status === 200 && responseDoc.data.size > 0) {
        const url = URL.createObjectURL(
          new Blob([responseDoc.data], { type: "application/pdf" }),
        );
        setPreviewFile(url);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error al obtener la ficha de derivación", error);
    }
  };

  /* const get = async () => {
      setIsLoading(true);
    };

    useEffect(() => {
      get();
    }, []);*/

  /*useEffect(() => {
      if(previewFile)
        window.open(previewFile, '_blank');
    }, [previewFile]);*/

  const decodeCita = async () => {
    if (citaStr) {
      const citaDecoded = JSON.parse(decodeURIComponent(citaStr));
      setCita(citaDecoded);
    }
  };

  const decodeAlumno = async () => {
    if (alumnoStr) {
      const alumnoDecoded = JSON.parse(decodeURIComponent(alumnoStr));
      setAlumno(alumnoDecoded);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    decodeCita();
    decodeAlumno();
    setIsLoading(false);
  }, [citaStr, alumnoStr]);

  useEffect(() => {
    if (cita?.modalidad === "Virtual") {
      setVirtual(true);
    }
  }, [cita]);

  useEffect(() => {
    if (cita && cita.citaXAlumnos && cita.citaXAlumnos[0].alumno) {
      handlerListarPlanAccion(
        cita.citaXAlumnos[0].alumno.id,
        cita.id,
        cita.tutor.id,
      );
      fetchDerivaciones(cita.id, cita.citaXAlumnos[0].alumno.id);
    }
  }, [cita]);

  /*  if (isLoading) {
      return (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}>
          <Spin size="large" />
        </div>
      );
    }
*/
  console.log({ previewFile });
  console.log(previewVisible);

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
              title: <p style={{ fontSize: "15px" }}>Información cita</p>,
            },
          ]}
          separator="/"
          style={{
            marginBottom: "18px",
          }}
        />
        <Title style={{ color: "#043B71" }}>Detalle de Cita</Title>
        <Flex style={{ width: "100%" }} gap="middle">
          <Flex gap="middle" style={{ width: "50%" }}>
            {cita && <CardInfoCita citaInfo={cita}> </CardInfoCita>}
          </Flex>
          <Flex style={{ width: "50%" }}>
            {cita?.tutor && (
              <CardCitaTutor tutor={cita?.tutor} virtual={virtual}>
                {" "}
              </CardCitaTutor>
            )}
          </Flex>
        </Flex>

        <Divider />
        <Flex style={{ flexDirection: "column" }}>
          <Title style={{ color: "#043B71", marginBottom: 0 }}>
            Resultados de la cita
          </Title>
          <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
            Plan de acción
          </Title>
          <div
            style={{
              borderRadius: 12,
              background: "white",
              border: "gray",
              width: "548px",

              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "15px",
              paddingBottom: "15px",
            }}
          >
            <Link
              href={{
                pathname: `/alumno/citas/detalle/planDeAccion`,
                query: {
                  planAccion: JSON.stringify(planAccion),
                  cita: JSON.stringify(cita),
                },
              }}
            >
              <Button
                style={{
                  width: "510px",
                  height: "44.9px",
                  backgroundColor: "#f2f3f7",
                  textAlign: "left",
                  paddingLeft: "8%",
                }}
                disabled={planAccion?.length <= 0}
              >
                {" "}
                <LinkOutlined />
                {planAccion?.length > 0
                  ? planAccion[0].titulo
                  : "Aún no se ha registrado un plan de acción"}
              </Button>
            </Link>
          </div>

          <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
            Derivaciones
          </Title>
          <div
            style={{
              borderRadius: 12,
              background: "white",
              width: "548px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: "20px", // Añad
              paddingBottom: "10px",
            }}
          >
            {!derivacionExistente && (
              <Button
                style={{
                  width: "510px",
                  height: "44.9px",
                  backgroundColor: "#f2f3f7",
                  marginBottom: "10px",
                  textAlign: "left",
                  paddingLeft: "8%",
                }}
                disabled={true}
              >
                <FilePdfOutlined /> No hay una ficha derivación{" "}
              </Button>
            )}
            {derivaciones?.map((derivacion, index) => (
              <Button
                style={{
                  width: "510px",
                  height: "44.9px",
                  backgroundColor: "#f2f3f7",
                  marginBottom: "10px",
                  textAlign: "left",
                  paddingLeft: "8%",
                }}
                onClick={() => obtenerFichaDerivacion(derivacion?.id)}
              >
                <FilePdfOutlined />
                {derivacion?.unidadApoyo?.nombre}
              </Button>
            ))}
          </div>
        </Flex>
        {previewFile !== null ? (
          <Modal
            title="Ficha de derivación"
            open={previewVisible}
            footer={null}
            onCancel={handlePreviewCancel}
            maskClosable={false}
            width="80%"
            style={{ top: 20 }} // Ajusta el espaciado superior
          >
            <iframe
              src={previewFile}
              style={{ width: "100%", height: "85vh" }}
            />
          </Modal>
        ) : (
          <Modal
            title="Ficha de derivación"
            open={previewFile === null && previewVisible}
            footer={null}
            closable={false}
            maskClosable={false}
            centered
            style={{
              top: 20,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spin size="large" />
            </div>
          </Modal>
        )}
      </LayoutComponent>
    </main>
  );
}

function DetallCitaWrapper() {
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

export default DetallCitaWrapper;
