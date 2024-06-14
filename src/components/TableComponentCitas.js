"use client";

import React, { useEffect, useState } from "react";
import { Popconfirm, Space, Spin, Table, Tag } from "antd";
import axios from "@/utils/axiosConfig";
const { Column, ColumnGroup } = Table;
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import Link from "next/link";
import { IconEdit, IconEye, IconTrashX } from "@tabler/icons-react";

const TableComponentCitas = ({ isLoading, citas, alumnoVisible = true }) => {
  if (isLoading)
    return (
      <div
        style={{
          borderRadius: 12,
          background: "white",
          border: "gray",
          width: "100%",
          height: 120,
          alignContent: "center",
          textAlign: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );

  const [flag, setFlag] = useState(false);
  const [page, setPage] = useState(1);

  const tamPagina = 20;

  const renderModalidad = (text, record) => {
    const reqColor =
      record.modalidad === "Presencial"
        ? "blue"
        : record.modalidad === "Virtual"
          ? "red"
          : "#ffffff";

    return (
      <Tag
        color={reqColor}
        style={{ borderRadius: 99, fontSize: 14, padding: "4px 8px" }}
      >
        {record.modalidad}
      </Tag>
    );
  };

  const renderEstado = (text, record) => {
    const estadoColor =
      record.estado === "Abierto"
        ? "#0884FC"
        : record.estado === "Pendiente"
          ? "#F6A700"
          : record.estado === "Realizado"
            ? "#52c41a"
            : record.estado === "Cancelado"
              ? "#f5222d"
              : "#ffffff";

    return (
      <Tag
        color={estadoColor}
        style={{ borderRadius: 99, fontSize: 14, padding: "4px 8px" }}
      >
        {record.estado}
      </Tag>
    );
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
    <Table
      dataSource={citas}
      pagination={{
        position: ["none", "bottomCenter"],
        pageSize: tamPagina,
        onChange(current) {
          setPage(current);
        },
      }}
    >
      <Column
        title="Nº"
        dataIndex="index"
        key="index"
        align="center"
        render={(text, record, index) => (page - 1) * tamPagina + index + 1}
      />
      {alumnoVisible && (
        <Column
          title="Alumno"
          dataIndex="nombres"
          key="nombres"
          align="center"
          render={(text, record) =>
            `${record.firstName} ${record.lastName} ${record.lastName2}`
          }
        />
      )}
      <Column title="Fecha" dataIndex="fecha" key="fecha" align="center" />
      <Column title="Hora" dataIndex="hora" key="hora" align="center" />
      <Column
        title="Modalidad"
        dataIndex="modalidad"
        key="modalidad"
        align="center"
        render={renderModalidad}
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
            <Link
              href={{
                pathname: `/tutor/citas/detalle`,
                query: {
                  cita: JSON.stringify(record),
                },
              }}
            >
              <IconEye
                size={20}
                style={{
                  cursor: "pointer",
                  color: "#0884FC",
                }}
              />
            </Link>
            <Popconfirm
              title="¿Estás seguro de eliminar esta cita?"
              onConfirm={() => handleDelete(record.id)}
            >
              <IconTrashX
                size={20}
                style={{ cursor: "pointer", color: "#f5222d" }}
              />
            </Popconfirm>
          </Space>
        )}
      ></Column>
    </Table>
  );
};

export default TableComponentCitas;
