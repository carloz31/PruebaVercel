import React, { useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Tooltip
} from "antd";
import { MinusCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import './cardAlumnoCoordi.css';

const { Meta } = Card;

export default function CardAlumnoCoordi({ alumno, onRemove, onReAdd, disabled=false }) {
  const placeholderImage = "/user.png";
  const firstName = alumno.persona.nombre.split(' ')[0];
  const fullName = `${firstName} ${alumno.persona.apellidoPaterno} ${alumno.persona.apellidoMaterno}`;

  return (
    <Card className="card" style={{ opacity: disabled ? 0.5 : 1 }}>
    <div className="card-button-container">
      {disabled ? (
        <Tooltip title="Mantener asignación">
          <Button
            shape="circle"
            icon={<PlusCircleOutlined style={{ color: 'green' }} />}
            onClick={() => onReAdd(alumno.persona.id)}
            style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Eliminar asignación">
          <Button
            shape="circle"
            icon={<MinusCircleOutlined style={{ color: 'red' }} />}
            onClick={() => onRemove(alumno.persona.id)}
            style={{ border: 'none', backgroundColor: 'transparent', boxShadow: 'none' }}
          />
        </Tooltip>
      )}
    </div>
    <Meta
      avatar={<Avatar size={48} src={alumno.foto || placeholderImage} />}
      title={
        <div className="card-title">
          {fullName}
          <div className="card-subtitle">Código: {alumno.codigo}</div>
        </div>
      }
      description={alumno.correo}
    />
  </Card>
  );
}