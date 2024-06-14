"use client";
//prueba
import { notFound, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import LayoutComponent from "@/components/LayoutComponent";
import React, { Suspense, useEffect, useState } from "react";
import {
  Button,
  Divider,
  Flex,
  Input,
  Modal,
  Radio,
  Typography,
  Form,
  Select,
  DatePicker,
  TimePicker,
  Spin,
  Skeleton,
} from "antd";
import axios from "@/utils/axiosConfig";
import { tutorItems } from "@/utils/menuItems";
import CardDetalleCita from "@/components/cards/cardDetalleCita";
import CardCitaAlumno from "@/components/cards/cardCitaAlumno";
import CardAlumnoMini from "@/components/cards/cardAlumnoMini";
import {
  IconChevronRight,
  IconDownload,
  IconInfoCircle,
  IconLoader,
  IconTrashXFilled,
} from "@tabler/icons-react";
import Paragraph from "antd/es/typography/Paragraph";
import PDF from "@/app/tutor/citas/detalle/pdf";
import Link from "next/link";
import dayjs from "dayjs";
import { FileOutlined } from "@ant-design/icons";
// import { NextApiRequest, NextApiResponse } from "next";
// import { Email...
// import { Resend } from "resend";

const { Title, Text } = Typography;

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((pkg) => pkg.PDFDownloadLink),
  {
    ssr: false,
  },
);

function Home({}) {
  // Estados usados
  const [cita, setCita] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalPlanAccionVisible, setModalPlanAccionVisible] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [asistencia, setAsistencia] = useState("");
  const [comentarios, setComentarios] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState(null);
  const [hora, setHora] = useState(null);
  const [modalidad, setModalidad] = useState("");
  const [linkReunion, setLinkReunion] = useState("");
  const [idAlumno, setIdAlumno] = useState();
  const [idCita, setIdCita] = useState();
  const [derivaciones, setDerivaciones] = useState([{}]);
  const [derivacionExistente, setDerivacionExistente] = useState(false);
  const [idDerivacion, setIdDerivacion] = useState(0);

  const [planAccion, setPlanAccion] = useState(null);
  const [isPlanAccionCreated, setIsPlanAccionCreated] = useState(false);

  const [file, setFile] = useState();
  const [found, setFound] = useState(true);
  const router = useRouter();

  // Obtener datos de la URL

  const urlParams = useSearchParams();
  const citaStr = urlParams.get("cita");

  const onChangeAsistencia = (e) => {
    setAsistencia(e.target.value);
  };

  // Ejecución de la carga de la página

  const decodeCita = async () => {
    if (citaStr) {
      const citaDecoded = JSON.parse(decodeURIComponent(citaStr));
      setCita(citaDecoded);
      setIdCita(citaDecoded?.citaId);
      setIdAlumno(citaDecoded?.alumnoId);
      setAsistencia(citaDecoded?.asistencia);
      setComentarios(citaDecoded?.comentarios);
      setDescripcion(citaDecoded?.descripcion);
      setFecha(citaDecoded?.fecha);
      setHora(citaDecoded?.hora);
      setModalidad(citaDecoded?.modalidad);
      setLinkReunion(citaDecoded?.linkReunion);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    decodeCita();
  }, [citaStr]);

  const fetchUsuario = async (idPersona) => {
    if (idPersona !== undefined) {
      try {
        const response = await axios.get(
          `/alumnoApi/buscarUsuarioAlumnoPorIdPersona/${idPersona}`,
        );

        const usuario = response.data;

        const data = {
          foto: usuario.foto,
          codigo: usuario.codigo,
          correo: usuario.correo,
          idPersona: usuario.persona.id,
          firstName: usuario.persona.nombre,
          lastName: usuario.persona.apellidoPaterno,
          lastName2: usuario.persona.apellidoMaterno,
          especialidad: usuario.persona.especialidad.nombre,
          idAlumno: usuario.persona.id,
          //dni: usuario.persona.dni,
          telefono: usuario.persona.telefono,
          tipoAlumno: usuario.persona.tipoAlumno.nombre,
        };

        setUsuario(data);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchUsuario(idAlumno);
  }, [idAlumno]);

  const fetchPlanAccion = async (idCita, idAlumno) => {
    if (idCita !== undefined || idAlumno !== undefined) {
      try {
        const response = await axios.get(
          `/planDeAccionApi/listarPlanesDeAccionPorCitaAlumno/${idCita}/${idAlumno}`,
        );

        const planAccionStr = response.data;
        const data = {
          id: planAccionStr.id,
          idCita: idCita,
          idAlumno: idAlumno,

          titulo: planAccionStr.titulo,
          descripcion: planAccionStr.descripcion,
          fechaCreacion: planAccionStr.fecha_creacion,
          fechaFinalizacion: planAccionStr.fechaFinalizacion,
          estado: planAccionStr.estado,
          gruposCompromisos: planAccionStr.grupoCompromiso,
          progreso: planAccionStr.progreso,
          tipoTutoria: cita?.tipoTutoria,
        };

        setPlanAccion(data);
        return Promise.resolve(data);
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    }
  };

  console.log(planAccion);

  const fetchDerivaciones = async (idCita, idAlumno) => {
    if (idCita !== undefined && idAlumno !== undefined) {
      try {
        const response = await axios.get(
          `/fichaDerivacionApi/listarFichasPorCitaXAlumno/${idCita}/${idAlumno}`,
        );
        const derivaciones = response.data;
        setDerivaciones(derivaciones);
        console.log(derivaciones);
        if (derivaciones.length > 0) {
          setDerivacionExistente(true);
          setIdDerivacion(derivaciones[0].id);
        }
      } catch (error) {
        console.error("Error al obtener datos de la API:", error);
      }
    }
  };

  useEffect(() => {
    fetchPlanAccion(idCita, idAlumno);
    fetchDerivaciones(idCita, idAlumno);
  }, [idCita, idAlumno]);

  // Modales típicos

  const onRegistro = (exit) => {
    Modal.confirm({
      title: "¿Está seguro de registrar los resultados de la cita?",
      content: (
        <Flex gap="small">
          <IconInfoCircle size={25} />
          <Text>
            Al confirmar el registro, se enviará un correo electrónico al alumno
            para que pueda revisar sus resultados.
          </Text>
        </Flex>
      ),
      okText: "Registrar",
      cancelText: "Cancelar",
      onOk() {
        //Aquí se debe enviar el correo
        onSave(exit);
      },
    });
  };

  const onSave = async (exit) => {
    const citaXAlumnoData = {
      idCita: cita?.citaId,
      idAlumno: usuario?.idAlumno,

      descripcion: descripcion,
      estado: cita?.estado,
      asistencia: asistencia,
      comentarios: comentarios,
      modalidad: modalidad,
    };

    await axios.post(
      `/citaxalumnoDTOApi/publicarResultadoCita`,
      citaXAlumnoData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    Modal.success({
      title: "Cita guardada",
      content: "Los cambios han sido guardados exitosamente",
      onOk() {
        if (exit) {
          router.push("/tutor/citas");
        }
      },
    });
  };

  // Handles

  const [form] = Form.useForm();
  const handleGuardarDetalles = () => {
    const values = form.getFieldsValue();

    values.fecha = values.fecha ? values.fecha.format("YYYY-MM-DD") : fecha;
    values.hora = values.hora ? values.hora.format("HH:mm:ss") : hora;
    values.modalidad = values.modalidad || modalidad;

    const updatedCita = { ...cita, ...values };
    setCita(updatedCita);
    setModalEditVisible(false);

    // Pasar updatedCita a CardDetalleCita
    return updatedCita;
  };

  const handleCancelarDetalles = () => {
    form.resetFields();
    setModalEditVisible(false);
  };

  useEffect(() => {
    if (isPlanAccionCreated) {
      redirectToPlanAccionPage();
    }
  }, [planAccion, isPlanAccionCreated]);

  const redirectToPlanAccionPage = () => {
    if (planAccion) {
      router.push(
        `/tutor/citas/detalle/planaccion?idCita=${cita?.citaId}` +
          `&usuario=${encodeURIComponent(JSON.stringify(usuario))}` +
          `&planAccion=${encodeURIComponent(JSON.stringify(planAccion))}`,
      );
    }
  };

  const handleGuardarPlan = async (exit) => {
    const values = form.getFieldsValue();

    const data = {
      id: 0,
      idCita: cita?.citaId,
      idAlumno: usuario?.idAlumno,

      titulo: values.titulo,
      descripcion: values.descripcion,
      fechaCreacion: dayjs().toISOString(),
      fechaFinalizacion: values.fechaFinalizacion.format("YYYY-MM-DD"),
      estado: "Inicio",
      progreso: 0.0,
      tipoTutoria: cita.tipoTutoria,
      gruposCompromisos: [],
    };

    try {
      const response = await axios.post(
        `/planDeAccionDTOApi/crearPlanAccion`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    } catch (error) {
      console.error("Error al obtener datos de la API:", error);
    } finally {
      await fetchPlanAccion(cita.citaId, usuario.idAlumno);
      setModalPlanAccionVisible(false);
      Modal.success({
        title: "Plan de acción creado exitosamente",
        onOk() {
          setIsPlanAccionCreated(true);
        },
      });
    }
  };

  const handleCancelarPlan = () => {
    form.resetFields();
    setModalPlanAccionVisible(false);
  };

  const handlePlanAccion = () => {
    if (planAccion == null) {
      setModalPlanAccionVisible(true);
    } else {
      redirectToPlanAccionPage();
    }
  };

  const { confirm } = Modal;
  const mostrarModalEliminar = () => {
    confirm({
      title: "¿Estás seguro de eliminar esta cita?",
      icon: (
        <IconTrashXFilled
          size={24}
          style={{ color: "#f5222d", marginRight: 8 }}
        />
      ),
      okType: "danger",
      onOk() {
        console.log("OK");
      },
    });
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Title style={{ color: "#043B71" }}>Detalle de Cita</Title>
        <Flex gap="small" vertical style={{ width: "100%" }}>
          {/* CARDS DE CITA Y ALUMNO */}

          <Flex gap="middle">
            <div style={{ width: "50%" }}>
              <CardDetalleCita
                cita={cita}
                editClickAction={() => setModalEditVisible(true)}
                deleteClickAction={mostrarModalEliminar}
                height={200}
              ></CardDetalleCita>
            </div>
            <div style={{ width: "50%" }}>
              <CardCitaAlumno
                usuario={usuario}
                isLoading={isLoading}
                route="/tutor/citas/detalle/perfilAl"
                height={200}
              ></CardCitaAlumno>
            </div>
          </Flex>
          <Divider />
          {/* RESULTADOS */}

          <Flex vertical>
            <Title level={2} style={{ color: "#043B71", marginBottom: 0 }}>
              Resultados
            </Title>
            <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
              Asistencia
            </Title>
            <Radio.Group
              onChange={onChangeAsistencia}
              buttonStyle="solid"
              value={asistencia}
            >
              <Radio.Button value="Presente">Presente</Radio.Button>
              <Radio.Button value="Ausente">Ausente</Radio.Button>
            </Radio.Group>
            <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
              Comentarios
            </Title>
            <Input.TextArea
              rows={4}
              placeholder="Añade una breve descripción u observaciones"
              style={{ resize: "none" }}
              onChange={(e) => setComentarios(e.target.value)}
              value={comentarios}
            />
            <Paragraph style={{ color: "gray", marginTop: 6 }}>
              Nota: el contenido de estos comentarios es completamente privado
              para el tutor
            </Paragraph>
            <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
              Toma de acciones
            </Title>
            <Flex gap="small">
              {isLoading ? (
                <>
                  <Skeleton.Button active />
                  <Skeleton.Button active />
                </>
              ) : (
                <>
                  <Button
                    icon={
                      planAccion != null ? (
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <IconChevronRight size={20} />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "24px",
                              height: "24px",
                              borderRadius: "80%",
                              backgroundColor: "lightgray",
                              marginLeft: "8px",
                            }}
                          >
                            <FileOutlined style={{ color: "black" }} />
                          </div>
                        </span>
                      ) : (
                        <IconChevronRight size={20} />
                      )
                    }
                    iconPosition="end"
                    style={{ display: "inline-flex", alignItems: "center" }}
                    onClick={handlePlanAccion}
                  >
                    Plan de Acción
                  </Button>
                  <Button
                    icon={
                      derivacionExistente ? (
                        <span style={{ display: "flex", alignItems: "center" }}>
                          <IconChevronRight size={20} />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "24px",
                              height: "24px",
                              borderRadius: "80%",
                              backgroundColor: "lightgray",
                              marginLeft: "8px",
                            }}
                          >
                            <FileOutlined style={{ color: "black" }} />
                          </div>
                        </span>
                      ) : (
                        <IconChevronRight size={20} />
                      )
                    }
                    iconPosition="end"
                    style={{ display: "inline-flex", alignItems: "center" }}
                  >
                    <Link
                      href={{
                        pathname: "/tutor/citas/detalle/derivacion",
                        query: {
                          alumno: JSON.stringify(usuario),
                          idCita: idCita,
                          idDerivacion: idDerivacion,
                        },
                      }}
                    >
                      Derivación a unidades de apoyo
                    </Link>
                  </Button>
                </>
              )}
            </Flex>
            <Divider />
            <Flex justify="center" gap="middle">
              <Button>
                <Link href={{ pathname: "/tutor/citas" }}>Regresar</Link>
              </Button>
              <Button type="primary" onClick={onRegistro}>
                Registrar resultado
              </Button>
            </Flex>
          </Flex>
        </Flex>

        {/* MODAL PARA EL PLAN DE ACCIÓN */}
        <Modal
          centered
          closable={false}
          maskClosable={true}
          open={modalPlanAccionVisible}
          title={
            <Title level={2} style={{ color: "#043B71" }}>
              Plan de acción
            </Title>
          }
          footer={[
            <Button onClick={handleGuardarPlan} type="primary">
              Guardar
            </Button>,
            <Button onClick={handleCancelarPlan}>Cancelar</Button>,
          ]}
        >
          <Form form={form} autoComplete="off" layout="vertical">
            <Form.Item
              label={<Text style={{ fontWeight: 700 }}>Título</Text>}
              required
              name={"titulo"}
              rules={[
                {
                  required: true,
                  message: "Por favor, ingrese un título",
                },
              ]}
            >
              <Input placeholder="Título del plan de acción"></Input>
            </Form.Item>

            <Form.Item label={<Text style={{ fontWeight: 700 }}>Alumno</Text>}>
              <CardAlumnoMini
                nombre={usuario?.firstName}
                apellido={usuario?.lastName + " " + usuario?.lastName2}
                codigo={usuario?.codigo}
              />
            </Form.Item>

            <Form.Item
              label={<Text style={{ fontWeight: 700 }}>Tipo de tutoría</Text>}
              name={"tipoTutoria"}
              value={cita?.tipoTutoria}
            >
              <Text>{cita?.tipoTutoria}</Text>
            </Form.Item>

            <Form.Item
              label={
                <Text style={{ fontWeight: 700 }}>Fecha de finalización</Text>
              }
              required
              name={"fechaFinalizacion"}
              rules={[
                {
                  required: true,
                  message: "Por favor, ingrese una fecha de finalización",
                },
              ]}
            >
              <DatePicker
                style={{ width: "100%" }}
                minDate={dayjs()}
              ></DatePicker>
            </Form.Item>

            <Form.Item
              label={<Text style={{ fontWeight: 700 }}>Descripción</Text>}
              required
              name={"descripcion"}
            >
              <Input.TextArea
                placeholder="Descripción del plan de acción"
                style={{ resize: "none" }}
              ></Input.TextArea>
            </Form.Item>
          </Form>
        </Modal>

        {/* MODAL PARA EDITAR CITA */}
        <Modal
          centered
          closable={false}
          maskClosable={true}
          open={modalEditVisible}
          title={
            <Title level={2} style={{ color: "#043B71" }}>
              Modificar cita
            </Title>
          }
          footer={[
            <Button onClick={handleGuardarDetalles} type="primary">
              Guardar
            </Button>,
            <Button onClick={handleCancelarDetalles}>Cancelar</Button>,
          ]}
        >
          <Form form={form} autoComplete="off" layout="vertical">
            <Flex gap="middle">
              <Flex vertical style={{ width: "50%" }}>
                <Form.Item
                  label={<strong>Modalidad</strong>}
                  name="modalidad"
                  labelAlign="top"
                >
                  <Select defaultValue={modalidad}>
                    <Select.Option value="Presencial">Presencial</Select.Option>
                    <Select.Option value="Virtual">Virtual</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="fecha"
                  label={<strong>Fecha programada</strong>}
                  labelAlign="top"
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    defaultValue={dayjs(fecha, "YYYY-MM-DD")}
                  ></DatePicker>
                </Form.Item>
              </Flex>
              <Flex vertical style={{ width: "50%" }}>
                <Form.Item
                  name="hora"
                  label={<strong>Hora de inicio</strong>}
                  labelAlign="top"
                >
                  <TimePicker
                    style={{ width: "100%" }}
                    defaultValue={dayjs(hora, "HH:mm:ss")}
                  ></TimePicker>
                </Form.Item>
                {linkReunion != null && (
                  <Form.Item
                    name="Link de reunión"
                    label={<strong>Link de reunión</strong>}
                    labelAlign="top"
                  >
                    <Input>{linkReunion}</Input>
                  </Form.Item>
                )}
              </Flex>
            </Flex>
          </Form>
        </Modal>
      </LayoutComponent>
    </main>
  );
}

function detalleWrapper() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spin size="large" />
        </div>
      }
    >
      <Home />
    </Suspense>
  );
}

export default detalleWrapper;
