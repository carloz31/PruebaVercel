import React, { useState } from "react";
import { 
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex
} from "antd";
import { IconPencil, IconTrashFilled } from "@tabler/icons-react";
const { Meta } = Card;

export default function CardDetalleCita(cita) {
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [citas, setCitas] = useState([]);

  const items = [
    {
      key: '1',
      label: 'Fecha programada',
      children: <p>{cita.fechaProgramada}</p>,
    },
    {
      key: '2',
      label: 'Hora programada',
      children: <p>{cita.horaProgramada}</p>,
    },
    {
      key: '3',
      label: 'Estado',
      children: <p>{cita.estado}</p>,
    },
    {
      key: '4',
      label: 'Requerimiento',
      children: <p>{cita.requerimiento}</p>,
    },
    {
      key: '5',
      label: "Modalidad",
      children: <p>{cita.modalidad}</p>,
    },
    {
      key: '6',
      label: "Tipo de cita",
      children: <p>{cita.tipoCita}</p>,
    },
  ];
  
  
  return (
    <div
      style={{
        borderRadius: 12,
        background: "white",
        border: "gray",
        width: "50%",
        height: 140,
        padding: 12
      }}
    >
      <Flex>
        <Descriptions layout="vertical" items={items} colon={false} labelStyle={{fontWeight: "bold", color: "#043B71",  marginBottom: -10}}/>
        <Flex gap="small" vertical>
          <Button type="primary" icon={<IconPencil size={20} />} />
          <Button danger type="primary" icon={<IconTrashFilled size={20} />} />
        </Flex>
      </Flex>
    </div>
  );
}