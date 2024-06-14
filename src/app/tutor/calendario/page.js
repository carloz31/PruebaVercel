"use client";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState, useRef } from "react";
import { Button, Flex, Typography, message, Radio, Space, Row, Col, Divider } from "antd";
import { useRouter } from "next/navigation";
import { tutorItems } from "@/utils/menuItems";
import { IconSquareRoundedFilled } from "@tabler/icons-react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import moment from "moment";
import "./horario.css";
import Link from "next/link"
import { useUser } from "@/context/UserContext";
import axios from '@/utils/axiosConfig';

const { Title, Text } = Typography;


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [idDisponibilidad, setIdDisponibilidad] = useState(null);
  const [idTutor, setIdTutor] = useState(null);
  const [bloquesTutor, setBloquesTutor] = useState([]);
  const [bloquesAgregados, setBloquesAgregados] = useState([]);
  const [bloquesEliminados, setBloquesEliminados] = useState([]);
  const [currentMonthYear, setCurrentMonthYear] = useState(null);
  const [position, setPosition] = useState(0);
  const calendarRef = useRef();
  const router = useRouter();
  const { user } = useUser();

  const startDate = new Date();
  const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const monthName = months[startDate.getMonth()];
  const year = startDate.getFullYear();

  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  const getIdTutor = async () => {
    try{
      const response = await axios.get(`${process.env.backend}/tutorApi/buscarTutorPorUsuario/${user.id}`);
      setIdTutor(response.data);
    } catch (err) {
      console.error("Error al buscar la información del tutor", err);
    }
  };

  useEffect(() => {
    if (user != null) {
      getIdTutor();
    }
  }, [user]);

  const getDisponibilidad = async () => {
    try {
      const response = await axios.get(
        `/disponibilidadApi/listarDisponibilidadPorTutor/${idTutor}`,
      );
      setIdDisponibilidad(response.data[0].idDisponibilidad);
    } catch (error) {
      console.error("Error al obtener la disponibilidad del tutor", error);
    }
  };

  useEffect(() => {
    if (idTutor != null) {
      getDisponibilidad();
    }
  }, [idTutor]);

  const getBloquesTutor = async () => {
    try {
      const response = await axios.get(
        `/bloqueDisponibilidadApi/listarBloquesPorIdDisponibilidad/${idDisponibilidad}`,
      );
      setBloquesTutor(response.data);
    } catch (error) {
      console.error(
        "Error al obtener los bloques de disponibilidad del tutor",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idDisponibilidad != null) {
      getBloquesTutor();
    }
  }, [idDisponibilidad]);

  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Disabled", // Deshabilitar la selección de rangos de tiempo
    eventResizeHandling: "Disabled", // Deshabilitar el redimensionamiento de eventos
    eventMoveHandling: "Disabled", // Deshabilitar el movimiento de eventos
    businessBeginsHour : 8, // Set the start time to 8:00 AM
    businessEndsHour: 21,
    scrollToHour: 8,
    heightSpec: "BusinessHoursNoScroll",
    onBeforeEventRender: (args) => {
      // Configuración visual de los eventos
    },
    onBeforeHeaderRender: (args) => {
      const today = new Date();
      const headerDate = new Date(args.header.start);

      if (today.toDateString() === headerDate.toDateString()) {
        args.header.cssClass = "daypilot-today";
      }

      args.header.html = daysOfWeek[headerDate.getDay()] + " " + headerDate.getDate();
    },
  });

  const getPreviousSunday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const calculateMonthYear = (startDate) => {
    const start = getPreviousSunday(new Date(startDate));
    console.log(start);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const startMonth = months[start.getMonth()];
    const endMonth = months[end.getMonth()];
    const year = start.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    } else {
      return `${startMonth} - ${endMonth} ${year}`;
    }
  };


  useEffect(() => {
    let eventos = [];
    if (bloquesTutor) {
      console.log(bloquesTutor);
      bloquesTutor.forEach(bloque => {
        let color = bloque.libre === 1 ? "#a7eeb8" : bloque.libre === 2 ? "#D4C095" : "#D4C095";
        let text = bloque.libre === 1 ? "" : bloque.libre === 2 ? "Sesion" : "Sesion";

        // Ajuste de la hora usando moment
        const horaInicio = moment(bloque.horaInicio).utcOffset('-00:00').format("YYYY-MM-DDTHH:mm:ss");
        const horaFin = moment(bloque.horaFin).utcOffset('-00:00').format("YYYY-MM-DDTHH:mm:ss");

        eventos.push({
          id: bloque.idBloque,
          text: text,
          start: horaInicio,
          end: horaFin,
          backColor: color,
        });
      });
      console.log(eventos);
    }

    const startDate = new Date(
      new Date().setDate(new Date().getDate() + 7 * position),
    )
      .toISOString()
      .slice(0, 10);
    
    setCurrentMonthYear(calculateMonthYear(startDate));

    if (calendarRef.current && calendarRef.current.control) {
      calendarRef.current.control.update({ startDate, events: eventos });
    }
  }, [bloquesTutor, position]);

  const handleCurrentWeek = () => {
    setPosition(0);
  }

  const fechaActual = `${startDate.getDate()} de ${monthName} de ${year}`;

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Flex vertical style={{ height: "100%" }}>
        <Row justify="space-between" align="middle" gutter={16} style={{ marginBottom: "4px" }}>
            <Col>
              <Title level={1} style={{ color: "#043B71" }}>
                Calendario personal
              </Title>
            </Col>
            <Col>
              <Text strong>Fecha: {fechaActual}</Text>
            </Col>
          </Row>
          <Row justify="start" align="middle" gutter={16} style={{ marginBottom: "4px" }}>
            <Col>
              <Button onClick={handleCurrentWeek}>
                Esta semana
              </Button>
            </Col>
            <Col>
              <Radio.Group
                value={position}
                onChange={(e) => {
                  setPosition(Number(e.target.value));
                }}
              >
                <Radio.Button value={position - 1}>{"<"}</Radio.Button>
                <Radio.Button value={position + 1}>{">"}</Radio.Button>
              </Radio.Group>
            </Col>
            <Col>
              <Text strong style={{ fontSize: 18 }}>
                {currentMonthYear}
              </Text>
            </Col>
            <Col flex="auto" style={{ textAlign: 'right' }}>
            {idTutor && idDisponibilidad && (
              <Col>
                <Link href={{
                  pathname: `/tutor/calendario/disponibilidad`,
                  query: {
                    idTutor: idTutor,
                    idDisponibilidad: idDisponibilidad,
                  },
                }} passHref>
                  <Button type="primary">
                    Modificar disponibilidad
                  </Button>
                </Link>
              </Col>
            )}
            </Col>
          </Row>
          <Divider />
          <Row justify="end" align="middle" gutter={16} style={{ marginBottom: "24px" }}>
            <Col style={{ display: 'inline-flex', alignItems: 'center' }}>
              <IconSquareRoundedFilled
                size={20}
                style={{
                  color: "#a7eeb8",
                  marginRight: "10px",
                }}
              />
              Disponible
            </Col>
            <Col style={{ display: 'inline-flex', alignItems: 'center' }}>
              <IconSquareRoundedFilled
                size={20}
                style={{
                  color: "#D4C095",
                  marginRight: "10px",
                }}
              />
              Ocupado
            </Col>
          </Row>
          <div style={{ flexGrow: "1" }}>
            <DayPilotCalendar
              {...calendarConfig}
              ref={calendarRef}
              style={{ width: "100%" }}
            />
          </div>
        </Flex>
      </LayoutComponent>
    </main>
  );
}
