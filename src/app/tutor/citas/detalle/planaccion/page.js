"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import React, { useEffect, useState, Suspense } from "react";
import {
  Button,
  Flex,
  Typography,
  Modal,
  Input,
  Divider,
  Select,
  Form,
  Space,
  Spin,
  DatePicker,
  TimePicker,
} from "antd";
import axios from "@/utils/axiosConfig";
import { tutorItems } from "@/utils/menuItems";
import CardCitaAlumno from "@/components/cards/cardCitaAlumno";
import CardDetallePlan from "@/components/cards/cardDetallePlan";
import locale from "antd/lib/locale/es_ES";
import moment from "moment/moment";
import { InfoCircleOutlined } from "@ant-design/icons";
import CardProgreso from "@/components/cards/cardProgreso";
import { IconCirclePlus } from "@tabler/icons-react";
import TableComponentPlanAccion from "@/components/tables/TableComponentPlanAccion";
import { useSearchParams, useRouter } from "next/navigation";
import comparePlans from "@/utils/functions/comparePlans";
import dayjs from "dayjs";
import { useUser } from "@/context/UserContext";

const { Title } = Typography;

function Home() {
  const router = useRouter();

  const urlParams = useSearchParams();
  const usuario = JSON.parse(urlParams.get("usuario"));
  const idCita = urlParams.get("idCita");
  const planAccionFetched = JSON.parse(urlParams.get("planAccion"));

  const [isLoading, setIsLoading] = useState(false);
  const [planAccion, setPlanAccion] = useState(planAccionFetched);

  const [isEditingGrupo, setIsEditingGrupo] = useState({});
  const [gruposCompromisos, setGruposCompromisos] = useState(
    planAccion.gruposCompromisos,
  );
  const [editingGrupos, setEditingGrupos] = useState({});
  const [originalGrupos, setOriginalGrupos] = useState({});
  const [filtroEstado, setFiltroEstado] = useState("");
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const { user } = useUser();

  // Función para manejar el cambio en el select
  const handleSelectChange = (value) => {
    setFiltroEstado(value);
  };

  const get = async () => {
    setIsLoading(true);
  };

  useEffect(() => {
    get();
  }, []);


  const changeEditState = (index, bool) => {
    setIsEditingGrupo({ ...isEditingGrupo, [index]: bool });
  };

  const updatePlanAccionProgress = () => {
    let totalProgress = 0;
    let puntajeIdeal = 0;

    gruposCompromisos.forEach((grupo) => {
      grupo.compromisos.forEach((compromiso) => {
        totalProgress +=
          compromiso.estado === "Terminado"
            ? 2
            : compromiso.estado === "Proceso"
              ? 1
              : 0;

        puntajeIdeal += 2;
      });
    });

    const porcentaje =
      puntajeIdeal > 0 ? (100 * totalProgress) / puntajeIdeal : 0;

    setPlanAccion({ ...planAccion, progreso: porcentaje });
  };

  useEffect(() => {
    updatePlanAccionProgress();
    console.log("Grupos compromisos: ", gruposCompromisos);
  }, [gruposCompromisos]);

  const handleAgregarGrupo = () => {
    const nuevoGrupo = {
      compromisos: [],
      titulo: "Nuevo grupo de compromisos",
      id: null,
      fechaInicio: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
    };
    setGruposCompromisos([...gruposCompromisos, nuevoGrupo]);
  };

  const handleDeleteGrupo = (indexGrupo) => {
    const newGrupos = [...gruposCompromisos];
    newGrupos.splice(indexGrupo, 1);
    setGruposCompromisos(newGrupos);
  };

  const handleEditGrupo = (indexGrupo) => {
    setEditingGrupos({
      ...editingGrupos,
      [indexGrupo]: gruposCompromisos[indexGrupo],
    });
    setOriginalGrupos({
      ...originalGrupos,
      [indexGrupo]: { ...gruposCompromisos[indexGrupo] },
    });
    changeEditState(indexGrupo, true);
  };

  const handleSaveGrupo = (indexGrupo) => {
    setGruposCompromisos(
      gruposCompromisos.map((grupo, index) =>
        index === indexGrupo ? editingGrupos[indexGrupo] : grupo,
      ),
    );
    const { [indexGrupo]: value, ...remaining } = editingGrupos;
    setEditingGrupos(remaining);
    const { [indexGrupo]: originalValue, ...remainingOriginal } =
      originalGrupos;
    setOriginalGrupos(remainingOriginal);
    changeEditState(indexGrupo, false);
  };

  const handleCancelGrupo = (indexGrupo) => {
    setGruposCompromisos(
      gruposCompromisos.map((grupo, index) =>
        index === indexGrupo ? originalGrupos[indexGrupo] : grupo,
      ),
    );
    const { [indexGrupo]: value, ...remaining } = editingGrupos;
    setEditingGrupos(remaining);
    const { [indexGrupo]: originalValue, ...remainingOriginal } =
      originalGrupos;
    setOriginalGrupos(remainingOriginal);
    changeEditState(indexGrupo, false);
  };

  const handleInputGrupoChange = (indexComp, event) => {
    setEditingGrupos({
      ...editingGrupos,
      [indexComp]: {
        ...editingGrupos[indexComp],
        titulo: event.target.value,
      },
    });
  };

  const handleUpdateCompromisos = (updatedCompromisos, groupIndex) => {
    const updatedGruposCompromisos = [...gruposCompromisos];
    updatedGruposCompromisos[groupIndex].compromisos = updatedCompromisos;
    setGruposCompromisos(updatedGruposCompromisos);

    const newPlanAccion = {
      ...planAccion,
      gruposCompromisos: updatedGruposCompromisos,
    };
    setPlanAccion(newPlanAccion);
  };

  const onCancel = () => {
    Modal.confirm({
      title: "¿Está seguro de salir del plan de acción sin guardar cambios?",
      okText: "Salir",
      cancelText: "No salir",
      centered: true,
      onOk() {
        router.back();
      },
    });
  };

  const onRegistro = (exit) => {
    Modal.confirm({
      title: "¿Está seguro de guardar el plan de acción?",
      okText: "Guardar",
      cancelText: "Cancelar",
      centered: true,
      onOk() {
        onSave(exit);
      },
    });
  };

  const onSave = async (exit) => {
    const { seQuedan, seModifican, seEliminan, seCrean } = comparePlans(
      planAccionFetched.gruposCompromisos, //originales
      gruposCompromisos, //editados
    );

    await handleDeleteCall(seEliminan);
    await handleCreateCall(seCrean);
    await handleModifyCall(seModifican);

    console.log("Se quedan: ", seQuedan);
    console.log("Se modifican: ", seModifican);
    console.log("Se eliminan: ", seEliminan);
    console.log("Se crean: ", seCrean);

    await axios.put(`/planDeAccionDTOApi/modificarPlanAccion`, planAccion, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    Modal.success({
      title: "Cita guardada",
      content: "Los cambios han sido guardados exitosamente",
      onOk() {
        if (exit) {
          router.back();
        }
      },
    });
  };

  const handleDeleteCall = async (grupos) => {
    for (let grupo of grupos) {
      for (let compromiso of grupo.compromisos) {
        await handleDeleteCompromiso(compromiso);
      }
      await axios.delete(
        `/grupoCompromisoApi/borrarGrupoCompromiso/${grupo.id}`,
      );
    }
  };

  const handleDeleteCompromiso = async (compromiso) => {
    await axios.delete(`/compromisoApi/borrarCompromiso/${compromiso.id}`);
  };

  const handleCreateCall = async (grupos) => {
    const id = planAccion.id;

    for (let grupo of grupos) {
      const response = await axios.post(
        `/grupoCompromisoApi/crearGrupoCompromiso`,
        {
          id: id,
          titulo: grupo.titulo,
          fecha_creacion: grupo.fecha_creacion,
          fecha_modificacion: grupo.fecha_modificacion,
          planDeAccion: {
            id: id,
          },
          compromisos: null,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      console.log("Response: ", response.data);
      debugger;

      for (let compromiso of grupo.compromisos) {
        await handleCreateCompromiso(compromiso, response.data);
      }
    }
  };

  const handleCreateCompromiso = async (compromiso, idGrupo) => {
    debugger;
    await axios.post(
      `/compromisoApi/crearCompromiso`,
      {
        id: compromiso.id,
        descripcion: compromiso.descripcion,
        estado: compromiso.estado,
        fecha_creacion: compromiso.fecha_creacion,
        fecha_modificacion: compromiso.fecha_modificacion,
        grupoCompromiso: {
          id: idGrupo,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  };

  const handleModifyCall = async (conjunto) => {
    for (let elemento of conjunto) {
      //los elementos poseen compromisos que se modifican, eliminan o crean. Aparte, están los metadatos (nombre) del grupo
      await axios.put(
        `/grupoCompromisoApi/actualizarGrupoCompromiso`,
        elemento.grupo,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      //modificar compromisos
      for (let compromiso of elemento.compromisosSeModifican) {
        await handleModifyCompromiso(compromiso);
      }
      //eliminar compromisos
      for (let compromiso of elemento.compromisosSeEliminan) {
        await handleDeleteCompromiso(compromiso);
      }
      //crear compromisos
      for (let compromiso of elemento.compromisosSeCrean) {
        await handleCreateCompromiso(compromiso, elemento.grupo.id);
      }
    }
  };

  const handleModifyCompromiso = async (compromiso) => {
    await axios.put(`/compromisoApi/actualizarCompromiso`, compromiso, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  //Modal

  const [form] = Form.useForm();
  const handleGuardarDetalles = () => {
    const values = form.getFieldsValue();

    values.titulo = values.titulo ? values.titulo : planAccion.titulo;
    values.descripcion = values.descripcion
      ? values.descripcion
      : planAccion.descripcion;
    values.fechaFinalizacion = values.fechaFinalizacion
      ? values.fechaFinalizacion.format("YYYY-MM-DD")
      : planAccion.fechaFinalizacion;

    const updatedPlanAccion = { ...planAccion, ...values };
    setPlanAccion(updatedPlanAccion);
    setModalEditVisible(false);

    // Pasar updatedPlanAccion a CardDetallePlanAccion
    return updatedPlanAccion;
  };

  const handleCancelarDetalles = () => {
    form.resetFields();
    setModalEditVisible(false);
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Title style={{ color: "#043B71" }}>Plan de acción</Title>
        <Flex gap="small" vertical style={{ width: "100%" }}>
          <Flex gap="middle">
            <Flex vertical style={{ width: "50%" }}>
              <Title level={4}>Datos del plan de acción</Title>
              <CardDetallePlan
                plan={planAccion}
                editClickAction={() => setModalEditVisible(true)}
              />
            </Flex>
            <Flex vertical style={{ width: "50%" }} gap="middle">
              <Flex vertical>
                <Title level={4}>Alumno</Title>
                <CardCitaAlumno usuario={usuario} mostrarBotones={false} />
              </Flex>
              <CardProgreso plan={planAccion} showButton={false} />
            </Flex>
          </Flex>
          <Divider />
          <Flex>
            <Title level={2} style={{ color: "#043B71", width: "100%" }}>
              Compromisos
            </Title>
            <Form>
              <Form.Item label="Mostrar estado:" style={{ width: 225 }}>
                <Select
                  defaultValue={""}
                  id="opcion"
                  onChange={handleSelectChange}
                >
                  <Select.Option value="">Todos</Select.Option>
                  <Select.Option value="Inicio">Inicio</Select.Option>
                  <Select.Option value="Proceso">En Proceso</Select.Option>
                  <Select.Option value="Terminado">Terminado</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Flex>
          <Flex vertical gap="large">
            {gruposCompromisos.length === 0
              ? handleAgregarGrupo()
              : gruposCompromisos.map((grupo, index) => (
                  <TableComponentPlanAccion
                    grupoCompromiso={grupo}
                    index={index}
                    isEditingGrupo={isEditingGrupo}
                    handleCancelGrupo={handleCancelGrupo}
                    handleDeleteGrupo={handleDeleteGrupo}
                    handleEditGrupo={handleEditGrupo}
                    handleSaveGrupo={handleSaveGrupo}
                    handleInputGrupoChange={handleInputGrupoChange}
                    handleUpdateCompromisos={handleUpdateCompromisos}
                    editingGrupos={editingGrupos}
                    estadoSeleccionado={filtroEstado}
                  />
                ))}
            <Button
              type="dashed"
              style={{
                display: "inline-flex",
                alignItems: "center",
                width: "fit-content",
              }}
              icon={<IconCirclePlus size={20} />}
              iconPosition="start"
              onClick={() => {
                handleAgregarGrupo();
              }}
            >
              Crear grupo
            </Button>
          </Flex>

          <Divider />
          <Flex justify="center" gap="middle">
            <Button onClick={onCancel}>Regresar</Button>
            <Button type="primary" onClick={onRegistro}>
              Guardar cambios
            </Button>
          </Flex>
        </Flex>

        {/* MODAL PARA EDITAR PLAN DE ACCIÓN*/}
        <Modal
          centered
          closable={false}
          maskClosable={true}
          open={modalEditVisible}
          title={
            <Title level={2} style={{ color: "#043B71" }}>
              Modificar detalles del plan de acción
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
            <Form.Item
              name="titulo"
              label={<strong>Título</strong>}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Por favor, ingrese un título",
                },
              ]}
            >
              <Input
                value={planAccion.titulo}
                defaultValue={planAccion.titulo}
                style={{ color: "black" }}
              />
            </Form.Item>

            <Form.Item
              name="descripcion"
              label={<strong>Descripción</strong>}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: "Por favor, ingrese una descripción",
                },
              ]}
            >
              <Input
                defaultValue={planAccion.descripcion}
                style={{ color: "black" }}
              />
            </Form.Item>

            <Form.Item
              name="fechaFinalizacion"
              label={<strong>Fecha de finalización</strong>}
              labelAlign="top"
            >
              <DatePicker
                style={{ width: "100%" }}
                defaultValue={dayjs(planAccion.fechaFinalizacion, "YYYY-MM-DD")}
                minDate={dayjs()}
              ></DatePicker>
            </Form.Item>
          </Form>
        </Modal>
      </LayoutComponent>
    </main>
  );
}

function CitaDetallePlanAccionWrapper() {
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

export default CitaDetallePlanAccionWrapper;
