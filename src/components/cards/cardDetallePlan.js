import React, { useState } from "react";
import { Avatar, Button, Card, Descriptions, Flex } from "antd";
import { IconPencil, IconTrashFilled } from "@tabler/icons-react";
const { Meta } = Card;

export default function CardDetallePlan({ plan, editClickAction }) {
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [citas, setCitas] = useState([]);

  const items = [
    {
      key: "1",
      label: "Título",
      children: <p>{plan.titulo}</p>,
      span: 2,
    },
    {
      key: "2",
      label: "Tipo de tutoría",
      children: <p>{plan.tipoTutoria}</p>,
      span: 2,
    },
    {
      key: "3",
      label: "Fecha de creación",
      children: <p>{plan.fechaCreacion.split("T")[0]}</p>,
    },
    {
      key: "4",
      label: "Fecha de finalización",
      children: <p>{plan.fechaFinalizacion}</p>,
    },
    {
      key: "5",
      label: "Descripción",
      children: <p>{plan.descripcion}</p>,
    },
  ];

  return (
    <div
      style={{
        borderRadius: 8,
        background: "white",
        border: "1px solid #eee",
        height: 286,
        padding: 12,
      }}
    >
      <Flex>
        <Descriptions
          layout="vertical"
          items={items}
          colon={false}
          column={2}
          labelStyle={{
            fontWeight: "bold",
            color: "#043B71",
            marginBottom: -10,
          }}
        />
        <Flex gap="small" vertical>
          <Button
            type="primary"
            icon={<IconPencil size={20} />}
            onClick={editClickAction}
          />
        </Flex>
      </Flex>
    </div>
  );
}
