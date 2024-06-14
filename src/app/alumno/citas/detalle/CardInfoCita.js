"use client";
import React, { useState } from "react";
import axios from "@/utils/axiosConfig";
import {
  Popconfirm,
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  message,
} from "antd";
import { IconPencil, IconTrashFilled } from "@tabler/icons-react";
const { Meta } = Card;
import { CalendarFilled, DeleteFilled } from "@ant-design/icons";

export function CardInfoCita({ citaInfo }) {
  const recienCreado =
    new Date(citaInfo?.bloqueDisponibilidad?.horaInicio).getFullYear() < 2000;

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
      } else {
        message.error("No se pudo eliminar la cita.");
      }
    } catch (error) {
      console.error("Error: ", error);
    }

    window.location.href = `../citas`;
  };

  const handleReagendarCita = async (cita, idCita, idAlumno) => {
    const citaHoraInicio = new Date(cita.bloqueDisponibilidad.horaInicio);
    // Obtener la fecha y hora actuales
    const now = new Date();
    console.log(citaHoraInicio);
    console.log(now);
    if (citaHoraInicio < now) {
      message.error("No se puede reagendar esta cita.");
      return; // Salir de la función si la hora de inicio es pasada
    } else {
      try {
        const response = await axios.post(
          `/citaApi/eliminarCitaPorAlumno/${idCita}/${idAlumno}`,
        );
        if (response.status === 200) {
          console.log("Cita para reagendar");
        } else {
          message.error("No se pudo reagendar la cita.");
        }
      } catch (error) {
        console.error("Error: ", error);
      }
      window.location.href = `../horario?id1=${cita?.tutor?.id}&id2=${cita?.tipoTutoria?.idTipoTutoria}&cita=${encodeURIComponent(cita)}`;
    }
  };

  const items = [
    {
      key: "1",
      label: "Fecha programada",
      children: (
        <p>
          {recienCreado
            ? `${citaInfo?.fecha_creacion.split("T")[0]}` // Formato de fecha
            : `${citaInfo?.bloqueDisponibilidad?.horaInicio.split("T")[0]}`}
        </p>
      ),
    },
    {
      key: "2",
      label: "Hora programada",
      children: (
        <p>
          {recienCreado
            ? `${citaInfo?.fecha_creacion.split("T")[1].substring(0, 8)}` // Formato de fecha
            : `${citaInfo?.bloqueDisponibilidad?.horaInicio.split("T")[1].substring(0, 8)}`}
        </p>
      ),
    },
    {
      key: "3",
      label: "Estado",
      children: (
        <p>
          {citaInfo?.citaXAlumnos &&
            citaInfo?.citaXAlumnos.length > 0 &&
            citaInfo?.citaXAlumnos[0].estado}
        </p>
      ),
    },
    {
      key: "4",
      label: "Obligatoriedad",
      children: <p>{citaInfo?.tipoTutoria?.obligatoriedad}</p>,
    },
    {
      key: "5",
      label: "Modalidad",
      children: <p>{citaInfo?.modalidad}</p>,
    },
    {
      key: "6",
      label: "Tipo de cita",
      children: <p>{citaInfo?.tipoTutoria?.modalidad}</p>,
    },
    {
      key: "7",
      label: "Tipo tutoría",
      children: <p>{citaInfo?.tipoTutoria?.nombre}</p>,
    },
  ];
  console.log({ citaInfo });
  return (
    <div
      style={{
        borderRadius: 12,
        background: "white",
        border: "gray",

        height: 180,
        padding: 12,
      }}
    >
      <Flex>
        <Descriptions
          layout="vertical"
          items={items}
          colon={false}
          labelStyle={{
            fontWeight: "bold",
            color: "#043B71",
            marginBottom: -10,
          }}
        />
        <Flex gap="small" vertical>
          <Button
            type="text"
            icon={
              <Popconfirm
                title="¿Desea reagendar la cita?"
                onConfirm={() =>
                  handleReagendarCita(
                    citaInfo,
                    citaInfo?.id,
                    citaInfo?.citaXAlumnos[0]?.alumno?.id,
                  )
                }
              >
                <CalendarFilled
                  style={{
                    fontSize: "22px",
                    cursor: "pointer",
                    color: "#0884FC",
                  }}
                />
              </Popconfirm>
            }
          />
          <Button
            type="text"
            danger
            icon={
              <Popconfirm
                title="¿Desea eliminar la cita?"
                onConfirm={() =>
                  handleDeleteCita(
                    citaInfo?.id,
                    citaInfo?.citaXAlumnos[0]?.alumno?.id,
                    citaInfo?.bloqueDisponibilidad?.horaInicio,
                    citaInfo?.tipoTutoria?.obligatoriedad,
                  )
                }
              >
                <DeleteFilled
                  style={{
                    fontSize: "22px",
                    cursor: "pointer",
                    color: "#f5222d",
                  }}
                />
              </Popconfirm>
            }
          />
        </Flex>
      </Flex>
    </div>
  );
}
