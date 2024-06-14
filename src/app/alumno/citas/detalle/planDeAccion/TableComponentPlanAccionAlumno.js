"use client";

import React, { useEffect, useState } from "react";
import {
  Popconfirm,
  Row,
  Space,
  Spin,
  Table,
  Tag,
  Col,
  Flex,
  Typography,
  Button,
} from "antd";
import axios from "@/utils/axiosConfig";
import {
  IconChevronRight,
  IconCirclePlus,
  IconEdit,
  IconInfoCircle,
  IconSquareRounded,
  IconSquareRoundedFilled,
  IconTrashX,
} from "@tabler/icons-react";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import Column from "antd/es/table/Column";
import "./TableComponentPlanAccionAlumno.css";

const { Title, Text } = Typography;

const colorArray = ["#0663BD", "#049ECD", "#16C1B7", "#26C387", "#33BB55"];

const TableComponentPlanAccionAlumno = ({
  isLoading,
  grupoCompromiso,
  index,
}) => {
  if (isLoading) return <Spin size="large" />;

  const [flag, setFlag] = useState(false);

  const renderEstado = (text, record) => {
    const estadoStyle = {
      padding: "4px 8px",
      borderRadius: "999px",
      color: "#fff",
      textAlign: "center", // Centro de texto
      display: "inline-block", // Para que el span no ocupe el ancho completo
    };

    if (record.estado === "Inicio") {
      estadoStyle.backgroundColor = "#f5222d"; // rojo para estado en inicio
    } else if (record.estado === "Proceso") {
      estadoStyle.backgroundColor = "#F6A700"; // amarillo para estado en proceso
    } else if (record.estado === "Terminado") {
      estadoStyle.backgroundColor = "#52c41a"; // verde para estado terminado
    }
    return <span style={estadoStyle}>{record.estado}</span>;
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.post(`/citaApi/eliminarCita/${id}`);
      if (response.status == 200) {
        setFlag(true);
        flagtable && flagtable(flag);
      } else {
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <Flex vertical>
      <Row
        align="middle"
        justify="center"
        className={"fila"}
        style={{ borderLeft: `20px solid ${colorArray[index % 5]}` }}
      >
        <Col span={14} style={{ textAlign: "center" }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            {grupoCompromiso.titulo}
          </Title>
        </Col>
        <Col span={5} style={{ textAlign: "center" }}>
          <Title level={5} style={{ marginBottom: 0 }}>
            Estado
          </Title>
        </Col>
      </Row>
      {grupoCompromiso.compromisos.map((compromiso, indexComp) => (
        <Row
          align="middle"
          justify="center"
          className={"fila"}
          style={{
            borderLeft: `5px solid ${colorArray[index % 5]}`,
            paddingLeft: "390px",
          }}
        >
          <Col span={10} style={{ textAlign: "left", paddingLeft: "5.5%" }}>
            {compromiso.descripcion}
          </Col>
          <Col style={{ paddingLeft: "20%" }} span={6}>
            {renderEstado("", compromiso)}
          </Col>
          <Col span={4}>
            <Space size="middle"></Space>
          </Col>
        </Row>
      ))}
    </Flex>
  );
};

export default TableComponentPlanAccionAlumno;
