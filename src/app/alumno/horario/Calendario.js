import React, { useState, useRef, useEffect } from "react";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import "./CalendarStyle.css";
import {
  Modal,
  Button,
  Form,
  Input,
  DatePicker,
  ConfigProvider,
  TimePicker,
  Radio,
  Select,
  Space,
  message,
} from "antd";
import {
  InfoCircleOutlined,
  RightOutlined,
  LeftOutlined,
} from "@ant-design/icons";
import locale from "antd/lib/locale/es_ES";
import moment from "moment";
import "moment/locale/es";
import "./modalStyle.css";
import axios from "@/utils/axiosConfig";

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    marginRight: "10px",
  },
  main: {
    flexGrow: "1",
  },
};

export function Calendar({
  bloques,
  idTutorSeleccionado,
  idAlumno,
  onUpdateBloque,
  idTutoria,
  nombreTutoria,
}) {
  const calendarRef = useRef();
  const [tiposTutoria, setTiposTutoria] = useState([]);
  const [usuarioAlumno, setUsuarioAlumno] = useState([]);
  const [position, setPosition] = useState(0);
  const [form] = Form.useForm();
  //Datos del modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tipoPresencialidad, setTipoPresencialidad] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [temaSeleccionado, setTemaSeleccioando] = useState();
  const [horaInicio, setHoraInicio] = useState();
  const [horaFin, setHoraFin] = useState();
  const [fecha, setFecha] = useState();
  const [identificadorTutoria, setIdentificadorTutoria] = useState(idTutoria);
  const [tipoTutoria, setTipoTutoria] = useState(nombreTutoria);
  const [tematica, setTematica] = useState("Solicitada");

  const [eventoSeleccionado, setEventoSeleccionado] = useState({
    id: "",
    inicio: "",
    fin: "",
    fechaEven: "",
  });

  const get = async () => {
    setIsLoading(true);
    if (user?.rolSeleccionado !== 4) {
      router.back();
      return;
    }
  };
  useEffect(() => {
    if (idTutoria) {
      setIdentificadorTutoria(idTutoria);
    }

    if (nombreTutoria) {
      setTipoTutoria(nombreTutoria);
    }
  }, [idTutoria, nombreTutoria]);
  const handlerListarTemasPorTutor = async (idUsuario, idTutor) => {
    try {
      const response = await axios.get(
        `/tipoTutoriaApi/listarTiposTutoriaCompatiblesXTutor/${idUsuario}/${idTutor}`,
      );
      setTiposTutoria(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos de la API: Tipos tutoria", error);
    } finally {
    }
  };

  const handlerBuscarAlumno = async (id) => {
    try {
      const response = await axios.get(
        `/alumnoApi/listarAlumnoPorIdUsuario/${id}`,
      );
      setUsuarioAlumno(response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener datos de la API: Alumno", error);
    } finally {
    }
  };

  useEffect(() => {
    if (idTutorSeleccionado && idAlumno) {
      handlerListarTemasPorTutor(idAlumno, idTutorSeleccionado);
      handlerBuscarAlumno(idAlumno);
    }
  }, [idTutorSeleccionado, idAlumno]);

  const [calendarConfig, setCalendarConfig] = useState({
    viewType: "Week",
    durationBarVisible: false,
    timeRangeSelectedHandling: "Enabled",
    businessBeginsHour: 8, // Set the start time to 8:00 AM
    businessEndsHour: 21,
    scrollToHour: 8,
    heightSpec: "BusinessHoursNoScroll",
    onEventClick: (args) => {
      openEditModal(args.e.data); // Llama a la función para abrir el modal de edición con los datos del evento
    },
    onBeforeEventRender: (args) => {
      // Configuración visual de los eventos
    },
    onBeforeHeaderRender: (args) => {
      args.header.html = args.column.start.toString("dd/MM/yyyy");
      // Configuración visual de los eventos
    },
  });

  const openEditModal = (eventData) => {
    console.log(eventData);
    if (eventData.libre === 1) {
      setIsModalOpen(true);
      const evento = {
        id: eventData.id,
        inicio: eventData.hora_start,
        fin: eventData.hora_end,
        fechaEven: eventData.fecha,
      };
      eventoSeleccionado.id = evento.id;
      eventoSeleccionado.inicio = evento.inicio;
      eventoSeleccionado.fin = evento.fin;
      eventoSeleccionado.fechaEven = evento.fechaEven;
    }
  };

  useEffect(() => {
    setHoraInicio(eventoSeleccionado.inicio.toString().slice(11, 19));
    setHoraFin(eventoSeleccionado.fin.toString().slice(11, 19));
    setFecha(eventoSeleccionado.fechaEven);
  }, [
    eventoSeleccionado.inicio,
    eventoSeleccionado.fin,
    eventoSeleccionado.fechaEven,
  ]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Success:", values);
      const citaData = {
        modalidad: values.presencialidad,
        tematica: "Solicitado",
        tutor: {
          id: idTutorSeleccionado,
        },
        bloqueDisponibilidad: {
          idBloque: eventoSeleccionado.id,
        },
        tipoTutoria: {
          idTipoTutoria: identificadorTutoria,
        },
      };
      const citaResponse = await axios.post(
        `/citaApi/registrarCitaPorAlumno/${citaData.tutor.id}/${values.descripcion}/${usuarioAlumno[0]?.persona?.id}/${citaData.modalidad}/${citaData.bloqueDisponibilidad.idBloque}/${citaData.tipoTutoria.idTipoTutoria}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (citaResponse.status === 200) {
        console.log("hola");
        await form.resetFields();
        message.success("Registro de cita satisfactorio");
        //await handlerModificarBloqueASolicitado(citaData.bloqueDisponibilidad.idBloque);
        await onUpdateBloque(citaData.bloqueDisponibilidad.idBloque);
      } else {
        await form.resetFields();
        message.error("Error al registrar la cita");
      }

      setIsModalOpen(false);
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const handleCancel = async () => {
    await form.resetFields();
    setIsModalOpen(false);
  };

  const handleTipoPresencialidadChange = (e) => {
    setTipoPresencialidad(e.target.value);
  };

  const handleTemaSeleccionado = (estado) => {
    setTemaSeleccioando(estado);
  };

  useEffect(() => {
    let eventos = [];
    if (bloques) {
      bloques.forEach((bloque) => {
        let color =
          bloque.libre === 1
            ? "#a7eeb8"
            : bloque.libre === 2
              ? "#B9D5EF"
              : "#D4C095";
        let text =
          bloque.libre === 1
            ? ""
            : bloque.libre === 2
              ? "Reservado"
              : "Ocupado";
        eventos.push({
          id: bloque.idBloque,
          text: text,
          libre: bloque.libre,
          fecha: bloque.fecha,
          hora_start: bloque.horaInicio.toString(), // Asumiendo que horaInicio es un objeto Date
          hora_end: bloque.horaFin.toString(),
          start: bloque.horaInicio.toString(), // Asumiendo que horaInicio es un objeto Date
          end: bloque.horaFin.toString(), // Asumiendo que horaFin es un objeto Date
          backColor: color,
        });
      });
    }

    const events = [
      // Otros eventos
    ].concat(eventos);

    const startDate = new Date(
      new Date().setDate(new Date().getDate() + 7 * position),
    )
      .toISOString()
      .slice(0, 10);

    calendarRef.current.control.update({ startDate, events });
  }, [bloques, position]);

  return (
    <div>
      <div>
        <Space>
          <Radio.Group
            value={position}
            onChange={(e) => {
              setPosition(Number(e.target.value));
            }}
          >
            <Radio.Button value={position - 1}>
              <LeftOutlined />
            </Radio.Button>
            <Radio.Button value={position + 1}>
              <RightOutlined />
            </Radio.Button>
          </Radio.Group>
        </Space>
      </div>
      <div style={styles.wrap}>
        <div style={styles.main}>
          <DayPilotCalendar
            className="hola"
            {...calendarConfig}
            ref={calendarRef}
            style={{ width: "100%" }}
          />
          <Modal
            title={<span style={{ fontSize: "22px" }}>Registrar cita</span>}
            open={isModalOpen}
            closable={false} // Desactiva la opción de cerrar con la "X"
            footer={null} // Desactiva el pie de página (los botones "OK" y "Cancelar")
            style={{
              maxWidth: "400px",
              maxHeight: "720px",
              margin: "auto",
              border: "2px solid #1f87ef",
              borderRadius: "10px",
              overflow: "hidden",
              top: "8%",
            }}
          >
            <Form form={form} style={{ maxWidth: "400px" }}>
              <Form.Item
                label="Nombre alumno"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="botones-formulario"
                style={{ borderColor: "#1f87ef" }}
              >
                <Input
                  value={`${usuarioAlumno[0]?.persona?.nombre} ${usuarioAlumno[0]?.persona?.apellidoPaterno} ${usuarioAlumno[0]?.persona?.apellidoMaterno}`}
                  disabled
                />
              </Form.Item>

              <Form.Item
                name="fecha"
                label="Fecha"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="botones-formulario"
                style={{ borderColor: "#1f87ef" }}
              >
                <ConfigProvider locale={locale}>
                  <DatePicker
                    key={`${fecha}`}
                    defaultValue={moment(fecha, "YYYY-MM-DD")}
                    disabled
                    style={{ width: "100%" }}
                  />
                </ConfigProvider>
              </Form.Item>

              {
                <Form.Item
                  name="hora"
                  label="Hora"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  className="botones-formulario"
                  style={{ borderColor: "#1f87ef" }}
                >
                  <TimePicker.RangePicker
                    key={`${horaInicio}-${horaFin}`}
                    defaultValue={[
                      moment(horaInicio, "HH:mm"),
                      moment(horaFin, "HH:mm"),
                    ]} // Establece el rango de horas predeterminado
                    disabled // Hace que el RangePicker sea de solo lectura
                    style={{ width: "100%" }} // Ajusta el ancho del RangePicker al 100%
                    separator={"-"}
                  />
                </Form.Item>
              }

              {
                <Form.Item
                  label="Tema"
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                  className="botones-formulario"
                  style={{ borderColor: "#1f87ef" }}
                >
                  <Input value={tipoTutoria} disabled />
                </Form.Item>
              }

              <Form.Item
                name="presencialidad"
                label="Presencialidad"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="botones-formulario"
                rules={[
                  {
                    required: true,
                    message: "Por favor, seleccione una opcion",
                  },
                ]}
              >
                <Radio.Group
                  value={tipoPresencialidad}
                  onChange={handleTipoPresencialidadChange}
                  style={{ width: "100%" }}
                >
                  <Radio
                    style={{ marginLeft: "20px", marginTop: "3px" }}
                    value="Presencial"
                  >
                    Presencial
                  </Radio>
                  <Radio
                    style={{ marginLeft: "90px", marginTop: "3px" }}
                    value="Virtual"
                  >
                    Virtual
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                name="descripcion"
                label="Descripción"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                className="botones-formulario"
                style={{ borderColor: "#1f87ef" }}
                extra={
                  <span>
                    <InfoCircleOutlined /> Este campo es opcional
                  </span>
                }
              >
                <Input.TextArea
                  className="descripcion-input"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                />
              </Form.Item>

              <Form.Item
                wrapperCol={{ offset: 3, span: 18 }}
                style={{ marginTop: "20px", marginLeft: "15px" }}
                className="botones_form"
              >
                <Space size={50}>
                  <Button
                    htmlType="button"
                    onClick={handleCancel}
                    className="cancel-button"
                  >
                    Cancelar
                  </Button>
                  <Button type="primary" htmlType="button" onClick={handleOk}>
                    Guardar
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
}
