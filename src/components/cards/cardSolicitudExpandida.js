import React, { useState } from "react";
import { Avatar, Card, Col, Row, Spin, Typography, Input, Button, Modal,Tooltip, message, Divider, Space } from "antd";
import { UserOutlined } from '@ant-design/icons';
import CardSecretario from "@/components/cards/cardSecretario";
import { FilePdfOutlined, CopyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;
const {TextArea} = Input;

export default function cardSolicitudExpandida({ solicitud, fichaDerivacion, secretario, isLoading, archivos }) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);

  const handlePreview = (file) => {
    setPreviewFile(URL.createObjectURL(file.originFileObj));
    setPreviewVisible(true);
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
    setPreviewFile(null);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretario.correo)
      .then(() => {
        message.success('Correo copiado al portapapeles');
      })
      .catch(err => {
        message.error('Error al copiar el correo');
      });
  };

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

  return (
    <Card
      style={{marginTop: 25, marginRight: 40}}
      >
       <Row gutter={[16, 16]} align="middle" style={{width: '100%'}}>
        <Col flex="none" style={{width: '100%'}}>
          <Row gutter={[16, 16]} align="middle" style={{width: '100%'}}>
            <Col>
              <Title level={4} style={{ color: "#043B71" }}>
                Unidad de apoyo
              </Title>
              <Paragraph strong style={{ marginBottom: 0 }}>{fichaDerivacion?.unidadApoyo?.nombre}</Paragraph>
              <Title level={5} style={{ color: "black", marginTop: 10 }}>
                Secretario de la unidad
              </Title>
              <Paragraph style={{ marginBottom: 0 }}>{secretario?.nombre} {secretario?.apellidoPaterno} {secretario?.apellidoMaterno}</Paragraph>
              <Paragraph style={{ marginBottom: 0 }}> Correo: {secretario?.correo} 
                  <Tooltip title="Copiar correo">
                    <Button 
                      type="link" 
                      icon={<CopyOutlined />} 
                      onClick={copyToClipboard} 
                      style={{ marginLeft: 5, padding: 0 }}
                    />
                  </Tooltip>
              </Paragraph>
              <Paragraph style={{ marginBottom: 0 }}> Telefono: {secretario?.unidadApoyo?.telefono} Anexo: {secretario?.anexo}</Paragraph>
            </Col>
            <Divider type="vertical" ></Divider>
            <Col>
              <Title level={5} style={{ color: "black", marginTop: 10 }}>
                Fecha de registro de solicitud
              </Title>
              <Paragraph style={{ marginBottom: 0 }}>{solicitud?.fichaDerivacion.fecha_modificacion}</Paragraph>
              <Title level={5} style={{ color: "black", marginTop: 10 }}>
                Cita de registro
              </Title>
              <Paragraph style={{ marginBottom: 0 }}>{solicitud?.tipoTutoria?.descripcion} - {solicitud?.especialidad?.nombre}</Paragraph>
              <Title level={5} style={{ color: "black", marginTop: 10 }}>
                Estado de solicitud
              </Title>
              <Paragraph style={{ marginBottom: 0 }}>{fichaDerivacion?.estado}</Paragraph>
            </Col>
          </Row>
          <Title level={4} style={{ color: "#043B71", marginTop: 10 }}>
            Motivo de derivación
          </Title>
          <TextArea
            rows={4}
            value={fichaDerivacion?.motivo}
            resize="false"
            style={{ resize: "false", color: "black", backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            disabled={true} 
          />
          <Title level={4} style={{ color: "#043B71", marginTop: 10 }}>
            Sugerencias
          </Title>
          <TextArea
            rows={4}
            value={fichaDerivacion?.sugerencias}
            resize="false"
            style={{ resize: "false", color: "black", backgroundColor: "#f5f5f5", cursor: "not-allowed" }}
            disabled={true} 
          />
          <Title level={4} style={{ color: "#043B71", marginTop: 10 }}>
            Documentos adicionales
          </Title>
          <Paragraph style={{ marginBottom: 10 }}>
            {archivos.length > 0 
              ? `Se ha registrado ${archivos.length} documento(s):`
              : "No se ha registrado documentos"}
          </Paragraph>
          <div>
            {archivos.map((file, index) => (
              <div key={index} style={{ marginTop: 10 }}>
                <Button type="link" onClick={() => handlePreview(file)} style={{ display: 'flex', alignItems: 'center' }}>
                  <FilePdfOutlined style={{ marginRight: 8 }} />
                  {file.name}
                </Button>
              </div>
            ))}
          </div>        
        </Col>
      </Row>
      <Modal
        visible={previewVisible}
        title="Documento subido"
        footer={null}
        onCancel={handlePreviewCancel}
        width="80%"
      >
        {previewFile && (
          <iframe
            src={previewFile}
            style={{ width: '100%', height: '80vh' }}
            frameBorder="0"
          />
        )}
      </Modal>
    </Card>
  );
}