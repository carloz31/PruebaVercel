"use client";
//import { useRouter } from 'next/router';
import LayoutComponent from "@/components/LayoutComponent";
import React, { useEffect, useState, useRef, Suspense } from "react";
import { tutorItems } from "@/utils/menuItems";
import CardAlumnoPerfil from "@/components/cards/cardAlumnoPerfil";
import {
  Flex,
  Typography,
  Input,
  Button,
  message,
  error,
  Spin,
  Card,
} from "antd";
import axios from "@/utils/axiosConfig";
import { useSearchParams } from "next/navigation";
import Paragraph from "antd/es/skeleton/Paragraph";
import TableComponentDocumentos from "@/components/TableComponentDocumentos";
import Documentos from "@/components/Expediente";
import { useUser } from "@/context/UserContext";

const { Title } = Typography;

function Home() {
  const containerStyle = {
    backgroundColor: "white",
    height: "80%",
    marginTop: "1%",
    borderRadius: "5px",
  };
  const siderStyle = {
    color: "black",
    backgroundColor: "#fff",
    width: "50%",
    marginLeft: "1%",
  };
  const contenedorStyle = {
    display: "flex",
    alignItems: "center",
  };

  const urlParams = useSearchParams();
  const usuarioStr = urlParams.get("user");
  const [usuario, setUsuario] = useState(null);
  const [idAlumno, setIdAlumno] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  const [flagSelectedFile, setFlagSelectedFile] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (usuarioStr) {
      const usuarioDecoded = JSON.parse(decodeURIComponent(usuarioStr));
      setUsuario(usuarioDecoded);
    }
  }, [usuarioStr]);

  useEffect(() => {
    if (usuario?.persona?.idAlumno) {
      setIdAlumno(usuario.persona.idAlumno);
    }
  }, [usuario]);

  //Guardar el archivo
  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
    setFlagSelectedFile(true);
  };
  //Llamar al explorador de archivos
  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleCargarArchivo = async () => {
    // const dataPayload = {
    //     idAlumno: usuario?.idAlumno,
    //     archivo: selectedFile,
    // };
    const formData = new FormData();
    formData.append("idAlumno", usuario?.idAlumno);
    formData.append("archivo", selectedFile);

    // if(selectedFile !== null){
    //     //debugger
    //     axios.post(`/cargarArchivoAlumno`, dataPayload)
    //     .then(() => {
    //         message.success("Cambios guardados exitosamente.");
    //         //setAlumnosSeleccionados([]);
    //         //setResetSelection(!resetSelection);
    //         setSelectedFile(null);
    //     })
    //     .catch((error) => {
    //         console.error('Error saving data:', error);
    //         message.error("Hubo un error al cargar el dicho archivo.");
    //     });
    // }
    // else{
    //     console.error('Error saving data:', error);
    //     message.error("No se selecciono ningun archivo.");
    // }

    debugger;
    console.log("FormData:", formData);
    try {
      const response = await axios.post(`/cargarArchivoAlumno`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Archivo cargado con éxito:", response.data);
      message.success("Archivo guardado exitosamente.");
      setSelectedFile(null);
    } catch (error) {
      console.error("Error al cargar el archivo:", error);
      message.error("Hubo un error cargar el archivo.");
    } finally {
      setFlagSelectedFile(false);
    }
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Title style={{ color: "#043B71" }}>Perfil del Estudiante</Title>
        <Flex gap="small" vertical>
          {/* CARD DE ALUMNO */}
          <CardAlumnoPerfil usuario={usuario} isLoading={!usuario} />
        </Flex>
        <Card
          title={
            <Title
              level={2}
              style={{ textAlign: "left", color: "#043b71", marginBottom: 0 }}
            >
              Expediente
            </Title>
          }
          style={{
            color: "#043b71",
            width: "100%",
            marginTop: "20px",
          }}
        >
          <Flex gap="small" style={{ width: "100%" }}>
            <Input
              style={siderStyle}
              //value={valorInput}
              //onInput={handleInputChange}
              placeholder="Buscar documento"
            />
            <Button onClick={handleButtonClick}>Cargar Comentario</Button>
            <input
              type="file"
              style={{ display: "none" }}
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <Button onClick={handleCargarArchivo} disabled={!flagSelectedFile}>
              Subir Comentario
            </Button>
          </Flex>
          <TableComponentDocumentos idAlumno={idAlumno} />
        </Card>
      </LayoutComponent>
    </main>
  );
}

function DetallePerfilAlumnoWrapper() {
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

export default DetallePerfilAlumnoWrapper;
