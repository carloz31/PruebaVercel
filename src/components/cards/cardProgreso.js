import React, { useState } from "react";
import {
  Progress, 
  Button, 
  Card,
  Tag
} from "antd";
const { Meta } = Card;

export default function CardProgreso({ progreso, link }) {
  return (
    <Card style={{ width: 400, height: 130 }} type="inner">
      <Meta
        title={
          <>
            {"Progreso del alumno"}
            <Button
              type="primary"
              style={{ float: "right", marginBottom: "0.5em" }}
              link={link}
            >
              Ver progreso
            </Button>
          </>
        }
        description={
          <>
            <Progress
              percent={30}
              size={[, 15]}
              status="active"
              style={{ marginBottom: "0.75rem" }}
            />
            Compromisos cumplidos
            {
              <Tag color="blue" style={{ float: "right" }}>
                Completado
              </Tag>
            }
          </>
        }
      />
    </Card>
  );
}
