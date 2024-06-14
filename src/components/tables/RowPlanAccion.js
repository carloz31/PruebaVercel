import React from "react";
import { Col, Input, Row, Select, Space, message } from "antd";
import {
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
  IconEdit,
  IconTrashX,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { Popconfirm } from "antd";

const RowPlanAccion = ({
  compromiso,
  index,
  isEditing,
  handleInputChange,
  handleSelectChange,
  handleEditCompromiso,
  handleSaveCompromiso,
  handleCancelCompromiso,
  handleDeleteCompromiso,
  color,
  editingCompromisos,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const renderEstado = (estado) => {
    const estadoStyle = {
      padding: "4px 8px",
      borderRadius: "999px",
      color: "#fff",
      textAlign: "center", // Centro de texto
      display: "inline-block", // Para que el span no ocupe el ancho completo
    };

    if (estado === "Inicio") {
      estadoStyle.backgroundColor = "#f5222d"; // rojo para estado en inicio
    } else if (estado === "Proceso") {
      estadoStyle.backgroundColor = "#F6A700"; // amarillo para estado en proceso
    } else if (estado === "Terminado") {
      estadoStyle.backgroundColor = "#52c41a"; // verde para estado terminado
    }

    return <span style={estadoStyle}>{estado}</span>;
  };

  return (
    <Row
      align="middle"
      justify="center"
      className={"fila"}
      style={{
        borderLeft: `5px solid ${color}`,
        paddingLeft: 15,
      }}
    >
      <Col span={14} style={{ textAlign: "left" }}>
        <Input
          variant={isEditing[index] ? "outlined" : "borderless"}
          disabled={!isEditing[index]}
          value={
            isEditing[index]
              ? editingCompromisos[index].descripcion
              : compromiso.descripcion
          }
          style={{ color: "black" }}
          status={editingCompromisos[index]?.descripcion ? "success" : "error"}
          onChange={(event) => handleInputChange(index, event)}
        />
      </Col>
      <Col span={5}>
        {isEditing[index] ? (
          <Select
            defaultValue={compromiso.estado}
            style={{ width: 120, paddingLeft: 8 }}
            onChange={(value) => handleSelectChange(index, value)}
          >
            <Select.Option value="Inicio">Inicio</Select.Option>
            <Select.Option value="Proceso">En Proceso</Select.Option>
            <Select.Option value="Terminado">Terminado</Select.Option>
          </Select>
        ) : (
          renderEstado(compromiso.estado)
        )}
      </Col>
      <Col span={5}>
        {isEditing[index] ? (
          <Space size="middle">
            {contextHolder}
            <IconCircleCheck
              size={20}
              style={{
                cursor: "pointer",
                color: "#0884FC",
              }}
              onClick={() => {
                editingCompromisos[index]?.descripcion
                  ? handleSaveCompromiso(index)
                  : messageApi.open({
                      type: "error",
                      content: "El campo descripción no puede estar vacío",
                    });
              }}
            />
            <IconCircleX
              size={20}
              style={{
                cursor: "pointer",
                color: "#f5222d",
              }}
              onClick={() => {
                handleCancelCompromiso(index);
              }}
            />
          </Space>
        ) : (
          <Space size="middle">
            <IconInfoCircle
              size={20}
              style={{
                cursor: "pointer",
                color: "#0884FC",
              }}
            />
            <IconEdit
              size={20}
              style={{
                cursor: "pointer",
                color: "#0884FC",
              }}
              onClick={() => handleEditCompromiso(index)}
            />
            <Popconfirm
              title="¿Estás seguro de eliminar este compromiso?"
              onConfirm={() => handleDeleteCompromiso(index)}
              icon={
                <IconExclamationCircle
                  size={20}
                  style={{ color: "red", marginRight: 2 }}
                />
              }
            >
              <IconTrashX
                size={20}
                style={{ cursor: "pointer", color: "#f5222d" }}
              />
            </Popconfirm>
          </Space>
        )}
      </Col>
    </Row>
  );
};

export default RowPlanAccion;
