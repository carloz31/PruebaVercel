"use client";

import React, { useEffect, useState } from "react";
import { Space, Spin, Table, Tag } from "antd";
import axios from "axios";
const { Column, ColumnGroup } = Table;
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";


const TableComponentCitas = ({ isLoading, citas }) => {
  if (isLoading) return <Spin size="large" />;

  const renderRequerimiento = (text, record) => {
    const estadoStyle = {
      padding: "4px 8px",
      borderRadius: "999px",
      color: "#fff",
      textAlign: "center", // Centro de texto
      display: "inline-block", // Para que el span no ocupe el ancho completo
    };

    if (record.requerimiento === "Opcional") {
      estadoStyle.backgroundColor = "#0884FC"; // azul para estado opcional
    } else if (record.requerimiento === "Obligatorio") {
      estadoStyle.backgroundColor = "#f5222d"; // rojo para estado obligatorio
    }
    return <span style={estadoStyle}>{record.requerimiento}</span>;
  };

  const renderEstado = (text, record) => {
    const estadoStyle = {
      padding: "4px 8px",
      borderRadius: "999px",
      color: "#fff",
      textAlign: "center", // Centro de texto
      display: "inline-block", // Para que el span no ocupe el ancho completo
    };

    if (record.estado === "Pendiente") {
      estadoStyle.backgroundColor = "#F6A700"; // amarillo para estado pendiente
    } else if (record.estado === "Realizado") {
      estadoStyle.backgroundColor = "#52c41a"; // verde para estado realizado
    }
    return <span style={estadoStyle}>{record.estado}</span>;
  };

  return (
    <Table dataSource={citas} pagination={{ position: ["none","bottomCenter"] }}>
      <Column
        title="Nº"
        dataIndex="index"
        key="index"
        align="center"
        render={(text, record, index) => index + 1}
      />
      <Column
        title="Alumno"
        dataIndex="nombres"
        key="nombres"
        align="center"
        render={(text, record) =>
          `${record.firstName} ${record.lastName} ${record.lastName2}`
        }
      />
      <Column 
        title="Fecha"
        dataIndex="fecha"
        key="fecha"
        align="center"
      />
      <Column
        title="Requerimiento"
        dataIndex="requerimiento"
        key="requerimiento"
        align="center"
        render={renderRequerimiento}
      />
      <Column
        title="Modalidad"
        dataIndex="modalidad"
        key="modalidad"
        align="center"
      />
      <Column
        title="Tipo de Cita"
        dataIndex="tipoCita"
        key="tipoCita"
        align="center"
      />
      <Column
        title="Estado"
        dataIndex="estado"
        key="estado"
        align="center"
        render={renderEstado}
      />
      <Column
        title="Acción"
        dataIndex="accion"
        key="accion"
        align="center"
        render={(text, record) => (
          <Space size="middle">
            <Link href={'/tutor/citas/detalle'}>
            <EditOutlined
              style={{ fontSize: "16px", color: "#0884FC", cursor: "pointer" }}
            /></Link>
            <DeleteOutlined
              style={{ fontSize: "16px", color: "#0884FC" }}
              onClick={() => handleDelete(record.id)}
            />
          </Space>
        )}
      ></Column>
    </Table>
  );
};

export default TableComponentCitas;
