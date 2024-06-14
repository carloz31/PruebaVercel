import React, { useState } from "react";
import { Progress, Button, Card, Tag } from "antd";
const { Meta } = Card;

export default function CardProgreso({ plan, link, showButton = true }) {
  const getEtiqueta = (percent) => {
    return percent === 0
      ? "En inicio"
      : percent === 100
        ? "Terminado"
        : "En proceso";
  };

  const getGradientColor = (percent) => {
    if (percent <= 20) {
      return {
        from: "#cb0606", // Rojo
        to: "#d91908", // Bermellón
      };
    } else if (percent <= 40) {
      return {
        from: "#ff6a00", // Naranja
        to: "#ff8800", // Naranja oscuro
      };
    } else if (percent <= 60) {
      return {
        from: "#f6b000", // Amarillo
        to: "#f6d500", // Oro
      };
    } else if (percent <= 80) {
      return {
        from: "#a9c204", // Verde limón
        to: "#71ad0a", // Verde hoja
      };
    } else {
      return {
        from: "#328f08", // Verde limón
        to: "#057c0b", // Verde hoja
      };
    }
  };

  const color = getGradientColor(plan.progreso);

  return (
    <Card style={{ height: 130, justifyItems: "center" }} type="inner">
      <Meta
        title={
          <>
            {"Progreso del alumno"}
            {showButton && (
              <Button
                type="primary"
                style={{ float: "right", marginBottom: "0.5em" }}
                link={link}
              >
                Ver progreso
              </Button>
            )}
          </>
        }
        description={
          <div style={{ width: "100%" }}>
            <Progress
              percent={Math.round(plan.progreso)}
              size={[, 15]}
              status="active"
              style={{
                marginBottom: "0.75rem",
                paddingRight: 10,
              }}
              strokeColor={color}
            />
            Compromisos cumplidos
            {
              <Tag
                color={color.from}
                style={{ float: "right", borderRadius: 16, marginRight: 4 }}
              >
                {getEtiqueta(plan.progreso)}
              </Tag>
            }
          </div>
        }
      />
    </Card>
  );
}
