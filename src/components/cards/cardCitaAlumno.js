import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Descriptions,
  Flex,
  Row,
  Space,
  Spin,
} from "antd";
import {
  IconCopy,
  IconCopyCheck,
  IconDownload,
  IconFileInvoice,
  IconLoader,
  IconPencil,
  IconTrashFilled,
  IconUser,
} from "@tabler/icons-react";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import Link from "next/link";
import PDF from "@/app/tutor/citas/detalle/pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
const { Meta } = Card;

export default function CardCitaAlumno({
  usuario,
  historial,
  isLoading,
  route,
  mostrarBotones = true,
  height = 140,
}) {
  const placeholderImage = "/user.png";

  if (isLoading)
    return (
      <div
        style={{
          borderRadius: 8,
          background: "white",
          border: "1px solid #eee",
          height: height,
          padding: 14,
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <div
      style={{
        borderRadius: 8,
        background: "white",
        border: "1px solid #eee",
        height: height,
        padding: 14,
        alignContent: "center",
        width: "100%",
      }}
    >
      <Row style={{ flexWrap: "nowrap" }}>
        <Col flex={1}>
          <Flex>
            <Avatar size={72} src={usuario?.foto || placeholderImage} />
          </Flex>
        </Col>
        <Col flex={9}>
          <Title level={4} style={{ marginBottom: 6 }}>
            {usuario?.firstName} {usuario?.lastName} {usuario?.lastName2}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>{usuario?.codigo}</Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            {usuario?.especialidad}
          </Paragraph>
          <Paragraph
            copyable={{
              icon: [
                <IconCopy key="copy-icon" size={16} />,
                <IconCopyCheck key="copied-icon" size={16} />,
              ],
            }}
            style={{ marginBottom: 0 }}
          >
            {usuario?.correo}
          </Paragraph>
        </Col>
        {mostrarBotones && (
          <Col flex={1}>
            <Flex gap="small" vertical align="flex-end">
              <Link
                href={{
                  pathname: route,
                  query: {
                    user: JSON.stringify(usuario),
                    id: usuario?.idAlumno,
                  },
                }}
              >
                <Button type="primary" icon={<IconUser size={20} />} />
              </Link>
              <Link
                href={{
                  pathname: `/tutor/citas/detalle/perfil/historial-academico`,
                  query: {
                    id: usuario?.idAlumno,
                    nombre: usuario?.firstName,
                    apellido: usuario?.lastName + " " + usuario?.lastName2,
                    codigo: usuario?.codigo,
                  },
                }}
              >
                <Button icon={<IconFileInvoice size={20} />} />
              </Link>
            </Flex>
          </Col>
        )}
      </Row>
    </div>
  );
}

/*A partir de title, colocar (si no me equivoco): 
{alumno.persona.nombre} {alumno.persona.apellidoPaterno} {alumno.persona.apellidoMaterno}
{alumno.codigo}
{alumno.especialidad.nombre}
{alumno.persona.usuario.correo}
{alumno.persona.usuario.foto}*/
