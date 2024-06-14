import React, { useState } from "react";
import { Avatar, Button, Card, Descriptions, Flex } from "antd";
import {
  IconCircleFilled,
  IconPencil,
  IconTrashFilled,
} from "@tabler/icons-react";
const { Meta } = Card;

export default function CardDetalleCita({
  cita,
  editClickAction,
  deleteClickAction,
  height = 140,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [citas, setCitas] = useState([]);

  if (isLoading)
    return (
      <div
        style={{
          borderRadius: 8,
          background: "white",
          border: "1px solid #eee",
          height: height,
          padding: 14,
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );

  const renderEstado = (estado) => {
    const color =
      estado === "Abierto"
        ? "#0884FC"
        : estado === "Pendiente"
          ? "#F6A700"
          : estado === "Realizado"
            ? "#52c41a"
            : estado === "Cancelado"
              ? "#f5222d"
              : "#ffffff";

    return (
      <Flex align="center" gap="small">
        <p>{cita?.estado}</p>
        <IconCircleFilled
          color={color}
          size={18}
          style={{ paddingBottom: 2 }}
        />
      </Flex>
    );
  };

  const items = [
    {
      key: "1",
      label: "Descripción",
      children: <p>{cita?.descripcion}</p>,
      span: 3,
    },
    {
      key: "2",
      label: "Fecha programada",
      children: <p>{cita?.fecha}</p>,
    },
    {
      key: "3",
      label: "Hora programada",
      children: <p>{cita?.hora}</p>,
    },
    {
      key: "4",
      label: "Estado",
      children: renderEstado(cita?.estado),
    },
    {
      key: "5",
      label: "Requerimiento",
      children: <p>{cita?.requerimiento}</p>,
    },
    {
      key: "6",
      label: "Modalidad",
      children: <p>{cita?.modalidad}</p>,
    },
    {
      key: "7",
      label: "Tipo de cita",
      children: <p>{cita?.tipoCita}</p>,
    },
  ];

  return (
    <div
      style={{
        borderRadius: 8,
        background: "white",
        height: height,
        padding: 14,
        overflow: "auto",
        border: "1px solid #eee",
      }}
    >
      <Flex>
        <Descriptions
          layout="vertical"
          items={items}
          colon={false}
          labelStyle={{
            fontWeight: "bold",
            color: "#043B71",
            marginBottom: -10,
          }}
        />
        <Flex gap="small" vertical>
          {cita?.estado !== "Realizado" && (
            <>
              <Button
                type="primary"
                icon={<IconPencil size={20} />}
                onClick={editClickAction}
              />
              <Button
                danger
                type="primary"
                icon={<IconTrashFilled size={20} />}
                onClick={deleteClickAction}
              />
            </>
          )}
        </Flex>
      </Flex>
    </div>
  );
}
