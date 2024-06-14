import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Tooltip
} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined} from "@ant-design/icons";
import './cardAlumnoCoordiSolicitud.css';

const { Meta } = Card;

export default function CardAlumnoCoordi({ solicitud, onReject, onApprove, disabled=false }) {
  const placeholderImage = "/user.png";

  const alumnoFullName = `${solicitud.alumno.nombre} ${solicitud.alumno.apellidoPaterno}`;
  const tutorFullName = `${solicitud.tutor.nombre} ${solicitud.tutor.apellidoPaterno}`;
  return (
    <Card className="card" style={{ opacity: disabled ? 0.5 : 1 }}>
    <div className="card-button-container">
        <Tooltip title="Aprobar Solicitud">
          <Button
            shape="circle"
            icon={<CheckCircleOutlined style={{ color: 'green' }} />}
            onClick={() => onApprove(solicitud.id)}
            style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
          />
        </Tooltip>
        <Tooltip title="Rechazar Solicitud">
          <Button
            shape="circle"
            icon={<CloseCircleOutlined style={{ color: 'red' }} />}
            onClick={() => onReject(solicitud.id)}
            style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
          />
        </Tooltip>
      </div>
    <Meta
      title={
        <div className="card-title">
          Solicitante: {alumnoFullName}
          <div className="card-subtitle">Tutor: {tutorFullName}</div>
          <div className="card-subtitle">Tipo de Tutoría: {solicitud.tipoTutoria.nombre}</div>
          <div className="card-subtitle">Fecha de Solicitud: {solicitud.fecha_creacion.substring(0,10)}</div>
        </div>
      }
      //description={alumno.correo}
    />
  </Card>
  );
}