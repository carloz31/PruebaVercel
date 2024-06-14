"use client";
import { useUser } from "@/context/UserContext";
import React, { useState, useEffect, Suspense } from "react";
import { Typography, Flex, Spin, Card, Avatar } from "antd";
import axios from "@/utils/axiosConfig";
import { useSearchParams } from "next/navigation";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import LayoutComponent from "@/components/LayoutComponent";
import CardAlumnoMini from "@/components/cards/cardAlumnoMini";
import { tutorItems } from "@/utils/menuItems";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

const { Title, Text } = Typography;

function HistorialAcademico() {
  const user = useUser();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const nombre = searchParams.get("nombre");
  const apellido = searchParams.get("apellido");
  const codigo = searchParams.get("codigo");

  const [file, setFile] = useState();
  const [found, setFound] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    downloadPlugin: {
      fileNameGenerator: () => `${codigo}.pdf`,
    },
  });


  useEffect(() => {
    const fetchAlumno = async (id) => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `/alumnoApi/descargarHistorialAcademico/${id}`,
          {
            responseType: "blob",
          },
        );
        if (response.status === 200) {
          const blob = new Blob([response.data], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);
          if (blob.size === 0) {
            setFound(false);
          } else {
            setFound(true);
          }
          setFile(url);
        }
      } catch (error) {
        console.error("Error buscando historial academico:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAlumno(id);
  }, [id]);

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems} showFooter={false}>
        <Flex style={{ alignItems: "center" }}>
          <Title
            style={{
              color: "rgba(4, 59, 113, 0.8)",
              textAlign: "center",
              padding: "0 20px",
              fontSize: "36px",
              fontWeight: "bold",
            }}
          >
            Historial Académico
          </Title>
        </Flex>
        <Flex>
          <CardAlumnoMini nombre={nombre} apellido={apellido} codigo={codigo} />
        </Flex>
        {isLoading ? (
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
        ) : found ? (
          <Flex
            style={{
              display: "flex",
              justifyContent: "flex-start",
              minHeight: "800px",
              height: "auto",
              marginBottom: "20px",
              overflow: "auto",
            }}
          >
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              <Viewer
                fileUrl={file}
                plugins={[defaultLayoutPluginInstance]}
                theme="dark"
              />
            </Worker>
          </Flex>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <img
              src="/eliminar-documento.png"
              alt="Eliminar Documento"
              style={{ width: "100%", maxWidth: "100px", marginBottom: "30px" }}
            />
            <Text
              style={{
                fontSize: "24px",
                color: "rgba(4, 59, 113, 0.8)",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              No se ha registrado el historial academico de este alumno
            </Text>
          </div>
        )}
      </LayoutComponent>
    </main>
  );
}

function HistorialAcademicoWrapper() {
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
      <HistorialAcademico />
    </Suspense>
  );
}

export default HistorialAcademicoWrapper;

/*
npm install pdfjs-dist@3.4.120
npm install @react-pdf-viewer/core@3.12.0
npm install '@react-pdf-viewer/default-layout';
*/
