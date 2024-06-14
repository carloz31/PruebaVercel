import React, { useState, useEffect } from "react";
import { Avatar, Button, Card, Tooltip, Typography } from "antd";
import { PlusCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

const { Meta } = Card;

export default function CardAlumnoSesion({ alumno, onToggleSelection, selected, resetSelection }) {
  const placeholderImage = "/user.png";
  const [isSelected, setIsSelected] = useState(selected);

  useEffect(() => {
    setIsSelected(selected);
  }, [selected, resetSelection]);

  const handleToggle = () => {
    const newSelected = !isSelected;
    setIsSelected(newSelected);
    onToggleSelection(alumno, newSelected);
  };

  return (
    <Card
      size="small"
      style={{ width: 300, margin: "10px", padding: "8px" }}
      type="inner"
    >
      <Meta
        avatar={<Avatar size={48} src={alumno.foto || placeholderImage} />}
        title={
          <div
            style={{
              display: "flex",
            }}
          >
            <Title
              level={5}
              style={{
                width: "100%",
                whiteSpace: "initial",
                paddingRight: "6px",
              }}
            >
              {alumno.persona.nombre} {alumno.persona.apellidoPaterno}{" "}
              {alumno.persona.apellidoMaterno}
            </Title>
            <Tooltip title={isSelected ? "Deseleccionar" : "Seleccionar"}>
              <Button
                shape="circle"
                icon={
                  isSelected ? (
                    <MinusCircleOutlined style={{ color: "red" }} />
                  ) : (
                    <PlusCircleOutlined style={{ color: "green" }} />
                  )
                }
                onClick={handleToggle}
                style={{
                  borderColor: isSelected ? "red" : "green",
                  float: "right",
                }}
              />
            </Tooltip>
          </div>
        }
        description={
          <Text ellipsis style={{ color: "gray" }}>
            {alumno.correo}
          </Text>
        }
      />
    </Card>
  );
}