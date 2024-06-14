import React, { useState } from "react";
import Link from "next/link";
import { Avatar, Button, Card, Typography } from "antd";

const { Meta } = Card;
const { Paragraph, Title } = Typography;

export default function CardAlumno({ alumno, programa }) {
  return (
    <Card
      style={{
        width: 400,
        height: 130,
        overflow: "hidden",
        alignItems: "center",
        padding: "8px 0 8px 0",
      }}
      type="inner"
    >
      <Meta
        avatar={
          <Avatar
            size="large"
            style={{
              backgroundColor: "lightgray",
              verticalAlign: "middle",
              color: "black",
            }}
          >
            {alumno.persona.nombre.charAt(0) +
              alumno.persona.apellidoPaterno.charAt(0)}
          </Avatar>
        }
        title={
          <>
            {alumno.persona.nombre} {alumno.persona.apellidoPaterno}{" "}
            {alumno.persona.apellidoMaterno}
            <Link
              href={{
                pathname: `/tutor/alumnos/perfil`,
                query: {
                  user: JSON.stringify(alumno),
                  id: alumno.persona.id,
                },
              }}
            >
              <Button type="primary" style={{ float: "right" }}>
                Ver perfil
              </Button>
            </Link>
          </>
        }
        description={
          <>
            <Paragraph style={{ marginBottom: 0, marginTop: -8 }}>
              {alumno.codigo}
            </Paragraph>
            <Paragraph style={{ marginBottom: 0 }}>{programa.nombre}</Paragraph>
          </>
        }
      />
    </Card>
  );
}
