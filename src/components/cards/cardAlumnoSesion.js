import React, { useState, useEffect } from "react";
import {Avatar, Button, Card, Tooltip} from "antd";
import { PlusCircleOutlined, MinusCircleOutlined  } from "@ant-design/icons";
const { Meta } = Card;

export default function CardAlumnoSesion({ alumno, onToggleSelection, resetSelection  }) {
  const placeholderImage = "/user.png";
  const [selected, setSelected] = useState(true);

  //Restablece estado Inicial una vez que se creo la sesion
  useEffect(() => {
    setSelected(true);
  }, [resetSelection]);

  //Llama a la función de callback con el alumno y su estado de selección
  const handleToggle = () => {
    setSelected(!selected);
    onToggleSelection(alumno.persona.id, !selected);
  };


  return (
    <Card style={{ width: 300, margin: '10px' }} type="inner">
      <Meta
        avatar={<Avatar size={48} src={alumno.foto || placeholderImage} />}
        title={
          <>
            {alumno.persona.nombre} {alumno.persona.apellidoPaterno} {alumno.persona.apellidoMaterno}
            <Tooltip title={selected ? "Seleccionar" : "Deseleccionar"}>
              <Button
                shape="circle"
                icon={selected ? 
                  (<PlusCircleOutlined style={{ color: "green" }}/>) : 
                  (<MinusCircleOutlined style={{ color: "red" }}/>)
                }
                onClick={handleToggle}
                style={{ borderColor: selected ? "green" : "red",float: "right", }}
              />
            </Tooltip>
          </>
        }
        description={alumno.correo}
      />
    </Card>
  );
}