"use client";

import React, { useEffect, useState } from "react";
import { Popconfirm, Space, Spin, Table, Tag, message, Button } from "antd";
import axios from '@/utils/axiosConfig';
const { Column, ColumnGroup } = Table;
import { LinkOutlined } from "@ant-design/icons";
import Link from "next/link";
import { IconEdit, IconTrashX } from "@tabler/icons-react";
import { EyeOutlined } from "@ant-design/icons";

export function TablaCitasAlumno ({citas, alumno, onUpdateCitas}){

  const handleDeleteCita = async (
    idCita,
    idAlumno,
    horaInicio,
    obligatoriedad,
  ) => {
    const citaHoraInicio = new Date(horaInicio);

    // Obtener la fecha y hora actuales
    const now = new Date();

    if (citaHoraInicio < now) {
      message.error("No se puede eliminar una cita pasada.");
      return; // Salir de la función si la hora de inicio es pasada
    }
    if (obligatoriedad === "Obligatorio") {
      message.error("No se puede eliminar una cita obligatoria.");
      return; // Salir de la función si la hora de inicio es pasada
    }

    // Verificar si la hora de inicio de la cita es anterior a la hora actual

    try {
      const response = await axios.post(
        `/citaApi/eliminarCitaPorAlumno/${idCita}/${idAlumno}`,
      );
      if (response.status === 200) {
        message.success("Cita eliminada satisfactoriamente.");
        await onUpdateCitas();
      } else {
        message.error("No se pudo eliminar la cita.");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

    

    const renderEstado = (text, record) => {
        const estadoStyle = {
          padding: "4px 8px",
          borderRadius: "999px",
          color: "#fff",
          textAlign: "center", // Centro de texto
          display: "inline-block", // Para que el span no ocupe el ancho completo
        };
    
        if (record.citaXAlumnos[0]?.estado === "Abierto") {
          estadoStyle.backgroundColor = "#0884FC"; // azul para estado abierto
        } else if (record.citaXAlumnos[0]?.estado === "Pendiente") {
          estadoStyle.backgroundColor = "#F6A700"; // amarillo para estado pendiente
        } else if (record.citaXAlumnos[0]?.estado === "Realizado") {
          estadoStyle.backgroundColor = "#52c41a"; // verde para estado realizado
        } else if (record.citaXAlumnos[0]?.estado === "Cancelado") {
          estadoStyle.backgroundColor = "#f5222d"; // rojo para estado cancelado
        }
        return <span style={estadoStyle}>{record.citaXAlumnos[0]?.estado}</span>;
    };
    console.log(citas);
    return(
        <Table
        dataSource={citas}
        pagination={{ position: ["none", "bottomCenter"], pageSize: 20 }}
        >
        <Column
            title="Nº"
            dataIndex="index"
            key="index"
            align="center"
            render={(text, record, index) => index + 1}
        />
        <Column
            title="Tutor"
            dataIndex="tutor"
            key="tutor"
            align="center"
            render={(text, record) =>
                `${record.tutor.nombre} ${record.tutor.apellidoPaterno} ${record.tutor.apellidoMaterno}`
            }
        />
        <Column
            title="Fecha"
            dataIndex="bloqueDisponibilidad"
            key="bloqueDisponibilidad"
            align="center"
            render={(text, record) => 
                `${record.bloqueDisponibilidad.horaInicio.split('T')[0]}` // Formato de fecha
            }
        />
        <Table.Column
            title="Hora inicio"
            dataIndex="horaInicio"
            key="horaInicio"
            align="center"
            render={(text, record) => 
              `${record.bloqueDisponibilidad.horaInicio.split('T')[1].split('.')[0]}`
            } 
        />
        <Table.Column
            title="Modalidad"
            dataIndex="modalidad"
            key="modalidad"
            align="center"
            render={(text, record) => record.modalidad == "Presencial"? record.modalidad :
              <Button type="link" block href={record?.tutor?.linkReunion} target="_blank" rel="noopener noreferrer">
                <LinkOutlined /> Vitual
              </Button>
            }
        />
        <Table.Column
            title="Tipo de cita"
            dataIndex="tipoCita"
            key="tipoCita"
            align="center"
            render={(text, record) => record.tipoTutoria.modalidad}
        />
        <Table.Column
            title="Estado"
            dataIndex="citaXAlumnos"
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
                pathname: `/alumno/citas/detalle`,
                query: {
                  cita: JSON.stringify(record),
                  alumno: JSON.stringify(alumno),
                },
              }}
            >
              <EyeOutlined
                style={{
                  fontSize: "22px",
                  cursor: "pointer",
                  color: "#0884FC",
                  marginTop: "6px",
                }}
              />
            </Link>
            <Popconfirm
              title="¿Estás seguro de eliminar esta cita?"
              onConfirm={() =>
                handleDeleteCita(
                  record.id,
                  alumno[0]?.persona?.id,
                  record.bloqueDisponibilidad.horaInicio,
                  record.tipoTutoria.obligatoriedad,
                )
              }
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
}
