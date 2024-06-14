import React, { useState } from "react";
import {
  Progress, 
  Button, 
  Card,
  Tag
} from "antd";
const { Meta } = Card;

export  function CardProgresoAlumno({ plan, link ,progreso}) {
  const getEtiqueta = (percent) => {
    if (percent === 0) {
      return "En inicio";
    } else if (percent === 100) {
      return "Terminado";
    } else {
      return "En proceso";
    }
  };

  return (
    <Card style={{ width: "100%", height: 130 }} type="inner">
      <Meta
        title={
          <>
            {"Progreso del alumno"}
            
          </>
        }
        description={
          <>
            <Progress
              percent={progreso}
              size={[, 15]}
              status="active"
              style={{ marginBottom: "0.75rem" }}
            />
            Compromisos cumplidos
            {
              <Tag color={
                  progreso <= 33.3 ? "red" :
                  progreso <= 66.6 ? "yellow" :
                  progreso <= 100 ? "blue" : "green"
                  } 
                
                style={{ float: "right" }}>
                {getEtiqueta(50)}
              </Tag>
            }
          </>
        }
      />
    </Card>
  );
}
