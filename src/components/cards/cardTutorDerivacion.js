import React from "react";
import { Avatar, Card, Col, Row, Spin, Typography  } from "antd";
import { UserOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function CardTutorDerivacion({ tutor, especialidades, isLoading }) {
  const placeholderImage = "/user.png";

  if (isLoading) {
    return (
      <div
        style={{
          borderRadius: 12,
          background: "white",
          border: "gray",
          width: "100%",
          height: 120,
          padding: 12,
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  const especialidad = especialidades.length > 0 ? especialidades[0] : { nombre: "Sin especialidad registrada", facultad: { nombre: "Sin facultad registrada" } };

  return (
    <Card
      style={{
        borderRadius: 12,
        background: "white",
        border: "1px solid #e8e8e8",
        width: "100%",
        maxWidth: 900,
        padding: 10,
        margin: "0 auto"
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col flex="none">
          <Avatar size={64} icon={<UserOutlined />} src={placeholderImage} />
        </Col>
        <Col flex="auto">
          <Title level={4} style={{ marginBottom: 0 }}>
            {tutor ? `${tutor.nombre} ${tutor.apellidoPaterno} ${tutor.apellidoMaterno}` : "Cargando..."}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>{especialidad?.nombre}</Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>{especialidad?.facultad?.nombre}</Paragraph>
        </Col>
      </Row>
    </Card>
  );
}