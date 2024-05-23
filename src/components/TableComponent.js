import React from "react";
import { Space, Spin, Table } from "antd";
import {
  EditOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const { Column } = Table;

const TableComponent = ({ isLoading, usuarios, handleChangeEstado }) => {
  const renderEstado = (text, record) => {
    const estadoStyle = {
      padding: "4px 8px",
      borderRadius: "999px",
      color: "#fff",
      textAlign: "center",
      display: "inline-block",
    };

    if (record.estado === "Activo") {
      estadoStyle.backgroundColor = "#52c41a";
    } else if (record.estado === "Inactivo") {
      estadoStyle.backgroundColor = "#f5222d";
    }

    return <span style={estadoStyle}>{record.estado}</span>;
  };

  if (isLoading) return <Spin size="large" />;

  return (
    <Table dataSource={usuarios}>
      <Column title="Nº" dataIndex="key" key="key" align="center" />
      <Column
        title="Nombres"
        dataIndex="nombres"
        key="nombres"
        align="center"
      />
      <Column title="Correo" dataIndex="correo" key="correo" align="center" />
      <Column
        title="Tipo de Usuario"
        dataIndex="tipoUsuario"
        key="tipoUsuario"
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
        dataIndex="Acción"
        key="Acción"
        render={(text, record) => (
          <Space size="middle">
            <EditOutlined style={{ fontSize: "16px", color: "#0884FC" }} />
            {record.estado === "Activo" ? (
              <MinusCircleOutlined
                style={{ fontSize: "16px", color: "#0884FC" }}
                onClick={() => handleChangeEstado(record)}
              />
            ) : (
              <PlusCircleOutlined
                style={{ fontSize: "16px", color: "#0884FC" }}
                onClick={() => handleChangeEstado(record)}
              />
            )}
          </Space>
        )}
      />
    </Table>
  );
};

export default TableComponent;
