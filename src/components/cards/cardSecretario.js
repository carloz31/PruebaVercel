import React from "react";
import { Avatar, Card, Col, Row, Spin, Typography, Button, Tooltip, message } from "antd";
import { UserOutlined, CopyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function CardSecretario({ secretario, isLoading }) {
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretario.correo)
      .then(() => {
        message.success('Correo copiado al portapapeles');
      })
      .catch(err => {
        message.error('Error al copiar el correo');
      });
  };

  return (
    <Card
      style={{
        borderRadius: 12,
        background: "lightgray",
        border: "1px solid #e8e8e8",
        width: "100%",
        padding: 0,
        margin: "0 auto"
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col flex="none">
          <Avatar size={52} icon={<UserOutlined />} src={placeholderImage} />
        </Col>
        <Col flex="auto">
          <Title level={4} style={{ marginBottom: 0 }}>
            {secretario ? `${secretario.nombre} ${secretario.apellidoPaterno} ${secretario.apellidoMaterno}` : "Cargando..."}
          </Title>
          <Paragraph style={{ marginBottom: 0 }}>Secretario</Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>
            {secretario?.correo} 
            <Tooltip title="Copiar correo">
              <Button 
                type="link" 
                icon={<CopyOutlined />} 
                onClick={copyToClipboard} 
                style={{ marginLeft: 8, padding: 0 }}
              />
            </Tooltip>
          </Paragraph>
          <Paragraph style={{ marginBottom: 0 }}>{secretario?.unidadApoyo?.telefono + " Anexo: " + secretario?.anexo}</Paragraph>
        </Col>
      </Row>
    </Card>
  );
}