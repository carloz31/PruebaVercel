import React, { useEffect, useState } from "react";
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
  IconPencil,
  IconTrashFilled,
  IconUser,
} from "@tabler/icons-react";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
const { Meta } = Card;
import axios from "@/utils/axiosConfig";

export function CardCitaTutor({ tutor, virtual }) {
  const placeholderImage = "/user.png";
  const [usuarioTutor, setUsuarioTutor] = useState();

  const handlerBuscarUsuarioTutor = async (idTutor) => {
    try {
      const response = await axios.get(
        `/usuarioApi/buscarUsuarioPorIdPersona/${idTutor}`,
      );
      setUsuarioTutor(response.data);
    } catch (error) {
      console.error("Error al obtener datos de la API: usuario Tutor", error);
    } finally {
    }
  };

  useEffect(() => {
    if (tutor?.id) {
      handlerBuscarUsuarioTutor(tutor.id);
    }
  }, [tutor?.id]);

  console.log();
  return (
    <div
      style={{
        borderRadius: 12,
        background: "white",
        border: "gray",
        width: "100%",
        padding: 12,
      }}
    >
      <Row style={{ flexWrap: "nowrap" }}>
        <Col flex={1}>
          <Flex>
            <Avatar size={72} src={placeholderImage} />
          </Flex>
        </Col>
        <Col flex={9}>
          <Title level={4} style={{ marginBottom: 6 }}>
            {tutor?.nombre} {tutor?.apellidoPaterno} {tutor?.apellidoMaterno}
          </Title>

          {usuarioTutor?.persona?.especialidad && (
            <Paragraph style={{ marginBottom: 0 }}>
              Especialidad : {usuarioTutor?.persona?.especialidad}
            </Paragraph>
          )}

          {usuarioTutor?.codigo && (
            <Paragraph style={{ marginBottom: 0 }}>
              Código : {usuarioTutor?.codigo}
            </Paragraph>
          )}

          <Paragraph style={{ marginBottom: 0 }}>
            Teléfono : {tutor?.telefono}
          </Paragraph>

          {usuarioTutor?.correo && (
            <Paragraph
              copyable={{
                icon: [
                  <IconCopy key="copy-icon" size={16} />,
                  <IconCopyCheck key="copied-icon" size={16} />,
                ],
              }}
              style={{ marginBottom: 0 }}
            >
              Correo : {usuarioTutor?.correo}
            </Paragraph>
          )}

          {virtual && (
            <Paragraph
              copyable={{
                icon: [
                  <IconCopy key="copy-icon" size={16} />,
                  <IconCopyCheck key="copied-icon" size={16} />,
                ],
              }}
              style={{ marginBottom: 0 }}
            >
              Link zoom : {tutor?.linkReunion}
            </Paragraph>
          )}
        </Col>
      </Row>
    </div>
  );
}
