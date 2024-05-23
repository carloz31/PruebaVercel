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

export default function CardCitaAlumno({alumno}) {
  const [isLoading, setIsLoading] = useState(false);
  const placeholderImage = "/user.png";

  return (
    <div
      style={{
        borderRadius: 12,
        background: "white",
        border: "gray",
        width: "50%",
        height: 140,
        padding: 12,
      }}
    >
      <Row style={{ flexWrap: "nowrap" }}>
        <Col flex={1}>
          <Flex>
            <Avatar size={72} src={alumno.foto || placeholderImage} />
          </Flex>
        </Col>
        <Col flex={9}>
          <Title level={4} style={{ marginBottom: 6 }}>
            {alumno.nombre}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>{alumno.codigo}</Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>{alumno.especialidad}</Paragraph>
          <Paragraph 
            copyable={{
              icon: [
                <IconCopy key="copy-icon" size={16}/>,
                <IconCopyCheck key="copied-icon" size={16}/>,
              ]
            }}
            style={{ marginBottom: 0}}
          >
            {alumno.correo}
          </Paragraph>
        </Col>
        <Col flex={1}>
          <Flex gap="small" vertical align="flex-end">
            <Button type="primary" icon={<IconUser size={20} />} />
            <Button icon={<IconDownload size={20} />} />
          </Flex>
        </Col>
      </Row>
    </div>
  );
}

/*A partir de title, colocar (si no me equivoco): 
{alumno.persona.nombre} {alumno.persona.apellidoPaterno} {alumno.persona.apellidoMaterno}
{alumno.codigo}
{alumno.especialidad.nombre}
{alumno.persona.usuario.correo}*/
