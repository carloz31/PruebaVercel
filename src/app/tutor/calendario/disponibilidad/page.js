"use client";
import LayoutComponent from "@/components/LayoutComponent";
import { useEffect, useState, useRef } from "react";
import { Button, Flex, Typography, message, Radio, Space, Row, Col, Divider, Modal, Select,Spin } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { tutorItems } from "@/utils/menuItems";
import { IconSquareRoundedFilled } from "@tabler/icons-react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import moment from "moment";
import "./horario.css";
import { useUser } from "@/context/UserContext";
import axios from '@/utils/axiosConfig';

const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const { confirm, success } = Modal; 

export default function Home() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [idDisponibilidad, setIdDisponibilidad] = searchParams.get("idDisponibilidad");
  const [idTutor, setIdTutor] = searchParams.get("idTutor");
  const [bloquesTutor, setBloquesTutor] = useState([]);
  const [bloquesAgregados, setBloquesAgregados] = useState([]);
  const [bloquesEliminados, setBloquesEliminados] = useState([]);
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState([]);
  const [currentMonthYear, setCurrentMonthYear] = useState(null);
  const [position, setPosition] = useState(0);
  const [selectedRange, setSelectedRange] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [frequency, setFrequency] = useState("Solo hoy");
  const [applyDuration, setApplyDuration] = useState("Este mes");
  const [semestres, setSemestres] = useState([]);
  const [ultimoCiclo, setUltimoCiclo] = useState(null);
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

  const getSemestres = async () => {
    try {
      const response = await axios.get(`${process.env.backend}/semestreApi/listarTodosSemestres`);
      setSemestres(response.data);
      if (response.data.length > 0) {
        const ultimo = response.data.reduce((max, semestre) => moment(semestre.fechaFin).isAfter(moment(max.fechaFin)) ? semestre : max);
        setUltimoCiclo(`${ultimo.nombre}`);
      }
    } catch (error) {
      console.error("Error al obtener los semestres", error);
    }
  }

  useEffect(() => {
    getSemestres();
  }, []);

  const getBloquesTutor = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${process.env.backend}/bloqueDisponibilidadApi/listarBloquesPorIdDisponibilidad/${idDisponibilidad}`);
      setBloquesTutor(response.data);
    } catch (error) {
      console.error("Error al obtener los bloques de disponibilidad del tutor", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if ( idDisponibilidad!= null) {
      getBloquesTutor();
    }
  }, [idDisponibilidad]);

  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enable", // Habilitar la selección de rangos de tiempo
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
    onTimeRangeSelected: (args) => {
      const start = new Date(args.start.value);
      const end = new Date(args.end.value);
      const blocks = [];

      const now = new Date();
      if (start < now) {
        message.error("No puede ingresar disponibilidad en fechas anteriores.");
        calendarRef.current.control.clearSelection();
        return;
      }

      setSelectedRange({
        start: new Date(args.start.value),
        end: new Date(args.end.value),
        formatted: `${daysOfWeek[start.getDay()]}, ${start.getDate()} de ${months[start.getMonth()]} ${start.getFullYear()} ${moment(start).format("HH:mm")} - ${moment(end).format("HH:mm")}`
      });

      const calendarEvents = calendarRef.current.control.events.list;
      let isOverlap = false;


      for (let time = start; time < end; time.setMinutes(time.getMinutes() + 30)) {
        const blockStart = new Date(time);
        const blockEnd = new Date(time);
        blockEnd.setMinutes(blockEnd.getMinutes() + 30);

        let blockStartRight = moment(blockStart).utcOffset('-05:00').format("YYYY-MM-DDTHH:mm:ss");
        let blockEndRight = moment(blockEnd).utcOffset('-05:00').format("YYYY-MM-DDTHH:mm:ss");

        if (calendarEvents.some(event => {
          const eventStartStr = moment(event.start.value).format("YYYY-MM-DDTHH:mm:ss");
          const eventEndStr = moment(event.end.value).format("YYYY-MM-DDTHH:mm:ss");
          return eventStartStr === blockStartRight && eventEndStr === blockEndRight ;
        })) {
          isOverlap = true;
          break;
        }
    

        blocks.push({
          id: DayPilot.guid(),
          text: "",
          start: new DayPilot.Date(blockStartRight),
          end: new DayPilot.Date(blockEndRight),
          backColor: "#a7eeb8"
        });
      }

      if (isOverlap) {
        message.error("El rango seleccionado contiene bloques con alguna sesion programada o disponibilidad ya registrada.");
        calendarRef.current.control.clearSelection();
        setSelectedRange(null);
        return;
      }

      setBloquesSeleccionados(blocks)
      setModalVisible(true);

      /*
      confirm({
        title: 'Confirmar disponibilidad',
        content: '¿Desea registrar este bloque como disponible?',
        centered: true,
        onOk() {
         const calendar = calendarRef.current.control;
          blocks.forEach(block => {
            calendar.events.add(block);
            setBloquesAgregados(prev => [...prev, block]);
          });

          calendar.clearSelection();
        },
        onCancel() {
          calendarRef.current.control.clearSelection();
        },
      });*/
    },
    onEventClick: (args) => {
      const event = args.e.cache;

      const now = new Date();
      if (new Date(event.end.value) < now) {
        return;
      }

      if(event.backColor === "#a7eeb8"){
        const calendar = calendarRef.current.control;
        calendar.events.remove(event);        
        setBloquesEliminados(prev => [...prev,{
          idBloque: event.id,
          horaInicio: event.start.value,
          horaFin: event.end.value,
          libre: 0,
          fecha: event.start.value.split("T")[0],
        }]);
      }
      
    },
  });  

  const getPreviousSunday = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day;
    return new Date(date.setDate(diff));
  };

  const calculateMonthYear = (startDate) => {
    const start = getPreviousSunday(new Date(startDate));
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


  const updateCalendarEvents = (startDate) => {
    let eventos = [];

    if (bloquesTutor) {
      eventos = bloquesTutor.map(bloque => {
        const color = bloque.libre === 1 ? "#a7eeb8" : "#D4C095";
        const text = bloque.libre === 1 ? "" : "Ocupado";
        const horaInicio = moment(bloque.horaInicio).utcOffset('-00:00').format("YYYY-MM-DDTHH:mm:ss");
        const horaFin = moment(bloque.horaFin).utcOffset('-00:00').format("YYYY-MM-DDTHH:mm:ss");

        return {
          id: bloque.idBloque,
          text,
          start: horaInicio,
          end: horaFin,
          backColor: color
        };
      });
    }

    eventos = eventos.filter(evento => !bloquesEliminados.some(eliminado =>
      moment(evento.start).isSame(eliminado.horaInicio) &&
      moment(evento.end).isSame(eliminado.horaFin)
    ));

    eventos = eventos.concat(bloquesAgregados);

    setCurrentMonthYear(calculateMonthYear(startDate));

    if (calendarRef.current && calendarRef.current.control) {
      calendarRef.current.control.update({ startDate, events: eventos });
    }
  }

  useEffect(() => {
    const startDate = new Date(new Date().setDate(new Date().getDate() + 7 * position)).toISOString().slice(0, 10);
    updateCalendarEvents(startDate);
  }, [bloquesTutor, bloquesAgregados, position]);

  const generarBloquesRecurrentes = (start, end, frequency, applyDuration, existingEvents) => {
    const blocks = [];
  
    const startDate = moment(start);
    const endDate = moment(end);
  
    let currentDate = startDate.clone();
    let currentEndDate = endDate.clone();
  
    const endOfMonth = moment(startDate).endOf("month");
    const endOfYear = moment(startDate).endOf("year");
  
    let limitDate;
  
    if (applyDuration === "Este mes") {
      limitDate = endOfMonth;
    } else if (applyDuration === "Este ciclo") {
      const currentSemester = semestres.find(semestre =>
        moment(startDate).isBetween(moment(semestre.fechaInicio), moment(semestre.fechaFin), null, "[]")
      );
      if (currentSemester) {
        limitDate = moment(currentSemester.fechaFin);
      } else {
        message.error("El rango seleccionado no corresponde a un ciclo registrado.");
        return [];
      }
    } else if (applyDuration === "Este año") {
      limitDate = endOfYear;
    }
  
    while (currentDate.isSameOrBefore(limitDate)) {
      let currentBlockStart = currentDate.clone();
      let currentBlockEnd = currentBlockStart.clone().add(30, 'minutes');
  
      while (currentBlockEnd.isSameOrBefore(currentEndDate)) {
        // Busca si el bloque está ocupado
        const blockStartStr = currentBlockStart.format("YYYY-MM-DDTHH:mm:ss");
        const blockEndStr = currentBlockEnd.format("YYYY-MM-DDTHH:mm:ss");
  
        const isOccupied = existingEvents.some(event => {
          const eventStartStr = moment(event.start.value).format("YYYY-MM-DDTHH:mm:ss");
          const eventEndStr = moment(event.end.value).format("YYYY-MM-DDTHH:mm:ss");
          return (blockStartStr >= eventStartStr && blockStartStr < eventEndStr) || (blockEndStr > eventStartStr && blockEndStr <= eventEndStr);
        });
  
        if (!isOccupied) {
          blocks.push({
            id: DayPilot.guid(),
            text: "",
            start: new DayPilot.Date(blockStartStr),
            end: new DayPilot.Date(blockEndStr),
            backColor: "#a7eeb8"
          });
        }
  
        currentBlockStart.add(30, 'minutes');
        currentBlockEnd.add(30, 'minutes');
      }
  
      if (frequency === "Cada semana") {
        currentDate.add(1, 'week');
        currentEndDate.add(1, 'week');
      } else if (frequency === "Cada mes") {
        currentDate.add(1, 'month');
        currentEndDate.add(1, 'month');
      }
    }
  
    return blocks;
  }

  const handleModalOk = () => {
    
    const calendar = calendarRef.current.control;

    let nuevosBloques = [];

    if(frequency === "Solo hoy"){
      nuevosBloques = bloquesSeleccionados;
    }else{
      const existingEvents = calendar.events.list;
      nuevosBloques = generarBloquesRecurrentes(selectedRange.start, selectedRange.end, frequency, applyDuration, existingEvents);
    }

    const bloques = nuevosBloques;

    bloques.forEach(block => {
      calendar.events.add(block);
      setBloquesAgregados(prev => [...prev, block]);
    });

    console.log(calendar.events.list);

    setBloquesSeleccionados([]);
    setModalVisible(false);
    setFrequency("Solo hoy");
    setApplyDuration("Este mes");
    setSelectedRange(null);
  }

  const handleModalCancel = () => {
    setBloquesSeleccionados([]);
    setModalVisible(false);
    setApplyDuration("Este mes");
    setFrequency("Solo hoy");
    setSelectedRange(null);
  };



  const handleRegresar = () => {
    router.push("/tutor/calendario");
  }

  const limpiarListasBloques = (bloquesAgregados, bloquesEliminados) => {
    const bloquesAgregadosLimpios = bloquesAgregados.filter(agregado => {
      return !bloquesEliminados.some(eliminado => 
        eliminado.fecha === agregado.start.value.split("T")[0] && 
        eliminado.horaInicio === agregado.start.value
      );
    });

    const bloquesEliminadosLimpios = bloquesEliminados.filter(eliminado => {
      return !bloquesAgregados.some(agregado => 
        agregado.start.value.split("T")[0] === eliminado.fecha && 
        agregado.start.value === eliminado.horaInicio
      );
    });

    return {
      bloquesAgregadosLimpios,
      bloquesEliminadosLimpios
    };
  }

  const handleGuardar = () => {
    confirm({
      title: 'Confirmar cambios',
      content: '¿Está seguro de que desea registrar estos cambios en su disponibilidad?',
      onOk() {
        handleGuardarConfirmado();
      },
      onCancel() {
        console.log('Cancelado');
      },
      centered: true,
    });
  }

  const handleGuardarConfirmado = async () => {
    setIsLoading(true);
    const { bloquesAgregadosLimpios, bloquesEliminadosLimpios } = limpiarListasBloques(bloquesAgregados, bloquesEliminados);
    try{
      if (bloquesAgregadosLimpios.length > 0) {
        const disponibilidad = {
          idDisponibilidad: idDisponibilidad,
          tutor: {
            id: idTutor,
          },
          listaBloqueDisponibilidad: bloquesAgregadosLimpios.map(bloque => ({
              idBloque: 0,
              horaInicio: bloque.start.value,
              horaFin: bloque.end.value,
              libre: 1,
              fecha: bloque.start.value.split("T")[0],
          }))
        }
        const response = await axios.post(`${process.env.backend}/disponibilidadApi/agregarBloquesDisponibilidad`, 
          disponibilidad,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (bloquesEliminadosLimpios.length > 0) {
        const disponibilidadEliminada = {
          idDisponibilidad: idDisponibilidad,
          tutor: {
            id: idTutor,
          },
          listaBloqueDisponibilidad: bloquesEliminadosLimpios.map(bloque => ({
            idBloque: bloque.idBloque,
            horaInicio: bloque.horaInicio,
            horaFin: bloque.horaFin,
            libre: bloque.libre,
            fecha: bloque.fecha,
          }))
        }
        const responseEliminar = await axios.post(`${process.env.backend}/disponibilidadApi/eliminarBloquesDisponibilidad`,
          disponibilidadEliminada,
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
      setIsLoading(false);
      success({
        title: 'Cambios realizados exitosamente',
        content: 'Revise los cambios realizados en su calendario personal.',
        centered: true,
        onOk() {
          handleRegresar();
        },
      });
    }catch(error){
      console.error("Error al guardar los cambios en la disponibilidad del tutor", error);
      isLoading(false);
    }
  }

  const fechaActual = `${startDate.getDate()} de ${monthName} de ${year}`;

  const handleCurrentWeek = () => {
    setPosition(0);
  }

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Flex vertical style={{ height: "100%" }}>
          <Row justify="space-between" align="middle" gutter={16} style={{ marginBottom: "4px" }}>
            <Col>
              <Title level={1} style={{ color: "#043B71" }}>
                Modificar disponibilidad
              </Title>
            </Col>
            <Col>
              <Text strong>Fecha: {fechaActual}</Text>
            </Col>
          </Row>
          {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <Spin size="large" />
          </div>
          ) : (
          <>
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
                  console.log(calendarRef.current.control)
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
            <Col flex="auto" />
            <Col>
              <Button onClick={handleRegresar}>
                Cancelar
              </Button>
            </Col>
            <Col>
              <Button type="primary" onClick={handleGuardar} disabled={isLoading}>
                Guardar cambios
              </Button>
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
          </>
          )}
        </Flex>
      </LayoutComponent>
      <Modal
        title="Nueva disponibilidad"
        visible={modalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        centered
      >
        <Row style={{marginBottom: "8px" }}>{selectedRange?.formatted}</Row>
        <Row>
          <Col style={{marginRight: "8px"}}>
            Frecuencia:
          </Col>
          <Col>
            <Select value={frequency} onChange={setFrequency} style={{ width: 200 }}>
              <Option value="Solo hoy">Solo hoy</Option>
              <Option value="Cada semana">Cada semana</Option>
              <Option value="Cada mes">Cada mes</Option>
            </Select>
          </Col>
        </Row>
          {frequency !== "Solo hoy" && (
            <>
            <Row style={{marginTop: "8px"}}>
              <Col style={{marginRight: "8px"}}>
                Aplicar durante:
              </Col>
              <Col>
                <Select value={applyDuration} onChange={setApplyDuration} style={{width: "172px"}}>
                  <Option value="Este mes">Este mes</Option>
                  <Option value="Este ciclo">Este ciclo</Option>
                  <Option value="Este año">Este año</Option>
                </Select>
              </Col>
            </Row>
            {ultimoCiclo && (applyDuration === "Este ciclo") && (
              <Row style={{ marginTop: "16px" }}>
                <Text type="secondary">
                  Último ciclo registrado: {ultimoCiclo}
                  <br />
                  Si selecciona la duración a lo largo del ciclo, recuerde escoger un intervalo de tiempo que corresponda a algún ciclo registrado.
                </Text>
              </Row>
            )}
            </>
          )}
      </Modal>
    </main>
  );
}