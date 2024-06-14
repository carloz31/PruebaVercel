import React from "react";
import { Avatar, Card, Col, Row, Spin, Typography, Button } from "antd";
import Link from "next/link";

const {Text, Paragraph} = Typography;

export default function CardSolicitudDerivacion({ solicitud }) {

  const getColorByEstado = (estado) => {
    switch (estado) {
      case "Pendiente":
        return '#F6A700';
      case "Aprobada":
        return '#0884FC';
      case "Aceptada":
        return '#33BB55';
      case "Rechazada":
        return '#D70E17';
      default:
        return '#000000';
    }
  };

  return(
      <Row align="middle" gutter={[16, 16]}>
        <Col flex = 'none'>
          <Avatar size={40} src="/user.png" />
        </Col>
        <Col flex = 'auto'>
          <Row>
            <Text strong>{solicitud.alumno.nombre} {solicitud.alumno.apellidoPaterno} {solicitud.alumno.apellidoMaterno}</Text>
          </Row>
          <Row>
            <Text type="secondary">Derivado hacia: <Text strong>{solicitud.fichaDerivacion.unidadApoyo.nombre}</Text></Text>
            
          </Row>
        </Col>
        <Col flex='none' style={{ marginRight: 156 }}>
          <Row>
            <Text type="secondary">Estado:</Text>
          </Row>
          <Row>
            <Text style={{ color: getColorByEstado(solicitud.fichaDerivacion.estado) }}>{solicitud.fichaDerivacion.estado}</Text>
          </Row>
        </Col>
        <Col flex='none' style={{ marginRight: 156 }}>
          <Row>
            <Text type="secondary">Fecha de registro:</Text>
          </Row>
          <Row>
            <Text>{solicitud.fichaDerivacion.fecha_modificacion}</Text>
          </Row>
        </Col>
        <Col flex='none'>
          <Link
          href={{
            pathname: `/coordinador/derivaciones/detalle`,
            query: {
              solicitud: JSON.stringify(solicitud),
            },
          }}>
            <Button type="primary">Ver detalle</Button>
          </Link>
          
        </Col>
      </Row>
  )


}