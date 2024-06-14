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

export function CardDetallePlan({plan,cita}) {
  const [isLoading, setIsLoading] = useState(false);
  const [busquedaInput, setBusquedaInput] = useState("");
  const [citas, setCitas] = useState([]);
  

  const items = [
    {
      key: "1",
      label: "Título",
      children: <p>{plan[0]?.titulo}</p>,
      span: 2,
    },
    {
      key: "2",
      label: "Tipo de tutoría",
      children: <p>{cita?.tipoTutoria?.nombre}</p>,
      span: 2,
    },
    {
      key: "3",
      label: "Fecha de creación",
      children: <p>{plan[0]?.fecha_creacion.split("T")[0]}</p>,
    },
    {
      key: "4",
      label: "Fecha de finalización",
      children: <p>{plan[0]?.fechaFinalizacion}</p>,
    },
    {
      key: "5",
      label: "Descripción",
      children: <p>{plan[0]?.descripcion}</p>,
    },
    
  ];
  
 
  return (
    <div
      style={{
        borderRadius: 12,
        background: "white",
        border: "gray",
        //width: "50%",        
        padding: 12
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
            marginBottom: "1px",
          }}
        />
        <Flex gap="small" vertical>
          
        </Flex>
      </Flex>
    </div>
  );
}