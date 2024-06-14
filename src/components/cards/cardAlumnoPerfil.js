import React, { useState } from "react";
import { Avatar, Button, Card, Col, Flex, Row, Spin, message } from "antd";
import {
  IconChevronRight,
  IconCopy,
  IconCopyCheck,
  IconDownload,
  IconFileInvoice,
  IconFileStack,
} from "@tabler/icons-react";
import Title from "antd/es/typography/Title";
import axios from "@/utils/axiosConfig";
import Paragraph from "antd/es/typography/Paragraph";
import Link from "next/link"; // Importar Link de Next.js
const { Meta } = Card;

export default function CardAlumnoPerfil({
  usuario,
  isLoading,
  mostrarBotones = true,
}) {
  const placeholderImage = "/user.png";

  if (isLoading)
    return (
      <div
        style={{
          borderRadius: 8,
          background: "white",
          border: "1px solid #eee",
          width: "100%",
          height: 140,
          padding: 12,
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );

  const descargarHistorialAcademico = async (idPersona) => {
    try {
      debugger;
      const response = await axios.get(
        `/alumnoApi/descargarHistorialAcademico/${idPersona}`,
        {
          responseType: "blob",
        },
      );

      if (response != null) {
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: "application/pdf" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "historial_academico.pdf"); // or whatever file name you want
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Historial Academico is NULL", error);
        message.warning("Alumno no cuenta con un Historial Academico.");
      }
    } catch (error) {
      console.error("Error downloading file", error);
      message.error("Hubo un error al descargar el historial academico.");
    }
  };

  return (
    <Card
      title={
        <Title level={3} style={{ textAlign: "left", marginBottom: 0 }}>
          {usuario.firstName} {usuario.lastName} {usuario.lastName2}
        </Title>
      }
      style={{ width: "100%", color: "black" }}
    >
      <Flex style={{ display: "flex", justifyContent: "flex-start" }}>
        <Flex>
          <Avatar
            size={100}
            style={{
              backgroundColor: "lightgray",
              verticalAlign: "middle",
              color: "black",
            }}
          >
            {`${usuario.firstName.charAt(0)}${usuario.lastName.charAt(0)}`}
          </Avatar>
        </Flex>
        <div style={{ textAlign: "left", marginLeft: "50px" }}>
          <p>Código:</p>
          <p>Especialidad:</p>
          <p>Correo académico:</p>
          <p>Celular:</p>
          <p>Condición:</p>
        </div>
        <div style={{ textAlign: "left", marginLeft: "50px" }}>
          <p style={{ fontWeight: "bold" }}>{usuario.codigo}</p>
          <p style={{ fontWeight: "bold" }}>{usuario.especialidad}</p>
          <p style={{ fontWeight: "bold" }}>{usuario.correo}</p>
          <p style={{ fontWeight: "bold" }}>{usuario.telefono}</p>
          <p style={{ fontWeight: "bold" }}>{usuario.tipoAlumno}</p>
        </div>
      </Flex>
      <Flex
        gap="small"
        style={{
          marginTop: "30px",
        }}
      >
        <Button
          icon={<IconDownload size={20} />}
          onClick={() => descargarHistorialAcademico(usuario?.idAlumno)}
        ></Button>
        <Link
          href={{
            pathname: `/tutor/alumnos/perfil/historial-academico`,
            query: {
              id: usuario.idAlumno,
              nombre: usuario.firstName,
              apellido: usuario.lastName + " " + usuario.lastName2,
              codigo: usuario.codigo,
            },
          }}
          style={{ display: "flex", flex: 1 }}
        >
          <Button
            icon={<IconFileInvoice size={20} />}
            iconPosition="start"
            style={{
              display: "flex",
              flex: 1,
              width: "100%",
              justifyContent: "center",
            }}
          >
            Ver Historial Académico
          </Button>
        </Link>
        <Link
          href={{
            pathname: `/tutor/citas/detalle/perfil/historico-citas`,
            query: {
              id: usuario.idAlumno,
              nombre: usuario.firstName,
              apellido: usuario.lastName + " " + usuario.lastName2,
              codigo: usuario.codigo,
            },
          }}
          style={{ display: "flex", flex: 1 }}
        >
          <Button
            type="primary"
            icon={<IconFileStack size={20} />}
            iconPosition="start"
            style={{ display: "flex", flex: 1, justifyContent: "center" }}
          >
            Historial de citas
          </Button>
        </Link>
      </Flex>
    </Card>
  );
}
