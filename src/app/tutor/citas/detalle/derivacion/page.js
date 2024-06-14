"use client";
import LayoutComponent from "@/components/LayoutComponent";
import React, { useEffect, useState, Suspense } from "react";
import {
  Upload,
  Button,
  Typography,
  Divider,
  Spin,
  Row,
  Col,
  Input,
  Checkbox,
  message,
  Modal,
} from "antd";
import axios from "@/utils/axiosConfig";
import { useSearchParams, useRouter } from "next/navigation";
import { tutorItems } from "@/utils/menuItems";
import { useUser } from "@/context/UserContext";
import CardCitaAlumno from "@/components/cards/cardCitaAlumno";
import CardTutorDerivacion from "@/components/cards/cardTutorDerivacion";
import UnidadApoyoSelect from "@/components/UnidadApoyoSelect";
import CardSecretario from "@/components/cards/cardSecretario";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";
import FormatoDerivacion from "@/components/FormatoDerivacion";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((pkg) => pkg.PDFDownloadLink),
  {
    ssr: false,
  },
);

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

function Derivacion() {
  const searchParams = useSearchParams();
  const { user } = useUser();
  const idCita = searchParams.get('idCita');
  const alumno = JSON.parse(searchParams.get('alumno'));
  const idDerivacion = searchParams.get('idDerivacion');
  const [isLoading, setIsLoading] = useState(false);
  const [idUsuario, setIdUsuario] = useState(null); //se debe leer el id proporcionado por el usuario logueado
  const [idTutor, setIdTutor] = useState(null);
  const [tutor, setTutor] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [motivo, setMotivo] = useState("");
  const [sugerencias, setSugerencias] = useState("");
  const [unidadApoyo, setUnidadApoyo] = useState(null); //se debe leer el id de la unidad de apoyo seleccionada por el usuario
  const [secretario, setSecretario] = useState(null); //se debe leer el id del secretario proporcionado por el usuario logueado
  const [incluirHistorial, setIncluirHistorial] = useState(false); //se debe leer el valor del checkbox proporcionado por el usuario
  const [fileList, setFileList] = useState([]); // Lista de archivos subidos
  const [previewVisible, setPreviewVisible] = useState(false); // Estado para controlar la visibilidad de la vista previa
  const [formDisabled, setFormDisabled] = useState(false); // Nuevo estado para controlar si el formulario está deshabilitado
  const [cambiosRealizados, setCambiosRealizados] = useState(false); // Nuevo estado para controlar si se han realizado cambios en el formulario
  const [showDownloadLink, setShowDownloadLink] = useState(false);
  const [nombreUnidad, setNombreUnidad] = useState(""); //se debe leer el nombre de la unidad de apoyo seleccionada por el usuario
  const [isModalVisible, setIsModalVisible] = useState(false); // Nuevo estado para controlar la visibilidad del modal
  const [estadoEditar, setEstadoEditar] = useState(false);
  const [modificarEnable, setModificarEnable] = useState(false);
  const [estado, setEstado] = useState(null);
  const [dataCita, setDataCita] = useState(null);
  const [dataCitaLoaded, setDataCitaLoaded] = useState(false);
  const router = useRouter();

  
  
  useEffect(() => {
    
    if (user && user?.id) {
      getIdTutor();
    }
  }, [user]);

  const getDataCita = async () => {
    try {
      const responseCita = await axios.get(
        `/citaApi/listarCitaPorIDyAlumnoID/${idCita}/${alumno.idPersona}`,
      );
      const datos = responseCita.data;
      const alumnoCita = datos.citaXAlumnos.find(cita => cita.alumno.id === alumno.idPersona);

      if (!alumnoCita) {
        console.error("No se encontró un alumno con el ID proporcionado en los datos de la cita.");
        return; // Salir de la función si no encontramos el alumno
      }

      const cita = {
        citaId: datos.id,
        alumnoId: alumnoCita.alumno.id,
        firstName: alumnoCita.alumno.nombre,
        lastName: alumnoCita.alumno.apellidoPaterno,
        lastName2: alumnoCita.alumno.apellidoMaterno,
        fecha:
          datos.bloqueDisponibilidad.horaInicio.split("T")[0] === "1999-01-01"
            ? datos.fecha_creacion.split("T")[0]
            : datos.bloqueDisponibilidad.horaInicio.split("T")[0],
        hora:
          datos.bloqueDisponibilidad.horaInicio.split("T")[0] === "1999-01-01"
            ? datos.fecha_creacion.split("T")[1].substring(0, 8)
            : datos.bloqueDisponibilidad.horaInicio
                .split("T")[1]
                .substring(0, 8),
        requerimiento: datos.tipoTutoria.obligatoriedad,
        modalidad: datos.modalidad,
        tipoCita: datos.tipoTutoria.modalidad,
        estado: alumnoCita.estado,
        asistencia: alumnoCita.asistencia,
        descripcion: alumnoCita.descripcion,
        comentarios: alumnoCita.comentarios,
        tipoTutoria: datos.tipoTutoria.nombre,
      };
      console.log(cita);
      setDataCita(cita);
      setDataCitaLoaded(true);
    }catch(error){
      console.error("Error al obtener la cita", error);
    }
}

  useEffect(() => {
    if(idCita && alumno.idPersona && dataCita === null && !dataCitaLoaded){
      console.log('Llamando método getDataCita');
      getDataCita();
    }
  }, [idCita, alumno.idPersona]);

  const getIdTutor = async () => {
    setIsLoading(true);
    try {
      const responseIdTutor = await axios.get(
        `/tutorApi/buscarTutorPorUsuario/${user.id}`,
      );
      setIdTutor(responseIdTutor.data);
      console.log(responseIdTutor.data);
    } catch (error) {
      console.error("Error fetching ID tutor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idTutor !== null) {
      console.log(idTutor);
      getTutor();
      getEspecialidades();
    }
  }, [idTutor]);

  const getTutor = async () => {
    setIsLoading(true);
    try {
      const responseTutor = await axios.get(
        `/tutorApi/buscarTutorPorIdPersona/${idTutor}`,
      );
      console.log(responseTutor.data);
      setTutor(responseTutor.data);
      console.log(responseTutor.data);
    } catch (error) {
      console.error("Error fetching tutor:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getEspecialidades = async () => {
    setIsLoading(true);
    try {
      const responseEspecialidades = await axios.get(
        `/especialidadApi/listarEspecialidadesPorIdTutor/${idTutor}`,
      );
      setEspecialidades(responseEspecialidades.data);
      console.log(responseEspecialidades.data);
    } catch (error) {
      console.error("Error fetching especialidades:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSecretario = async (idUnidadApoyo) => {
    try {
      const responseSecretario = await axios.get(
        `/secretarioApi/buscarPorUnidadDeApoyo/${idUnidadApoyo}`,
      );
      setSecretario(responseSecretario.data);
    } catch (error) {
      console.error("Error fetching secretario:", error);
      message.error("Error al obtener el secretario de la unidad de apoyo");
    } finally {
      setIsLoading(false);
    }
  };

  const getFichaDerivacion = async (idDerivacion) => {
    setIsLoading(true);
    setFormDisabled(true);
    try {
      const response = await axios.get(
        `/fichaDerivacionApi/buscarFichaDerivacionPorId/${idDerivacion}`,
      );
      const ficha = response.data;
      setMotivo(ficha.motivo);
      setSugerencias(ficha.sugerencias);
      setUnidadApoyo(ficha.unidadApoyo.id);
      setNombreUnidad(ficha.unidadApoyo.nombre);
      setIncluirHistorial(ficha.historialAcademico);
      setEstado(ficha.estado);

      const responseFile = await axios.get(
        `/fichaDerivacionApi/obtenerDocumentacion/${idDerivacion}`,
        {
          responseType: "blob",
        },
      );
      if (responseFile.status === 200 && responseFile.data.size > 0) {
        const blob = new Blob([responseFile.data], { type: "application/pdf" });
        setFileList([
          {
            uid: "-1",
            name: "documentacion.pdf",
            status: "done",
            originFileObj: blob,
          },
        ]);
      }
      getSecretario(ficha.unidadApoyo.id);
      setShowDownloadLink(true);
      if (ficha.estado === "Pendiente") {
        setModificarEnable(true);
      }
    } catch (error) {
      console.error("Error fetching ficha derivacion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idDerivacion && idDerivacion !== "0") {
      getFichaDerivacion(idDerivacion);
    }
  }, [idDerivacion]);

  const handleMotivoChange = (e) => {
    setMotivo(e.target.value);
    setCambiosRealizados(true);
  };

  const handleSugerenciasChange = (e) => {
    setSugerencias(e.target.value);
    setCambiosRealizados(true);
  };

  const handleUnidadApoyoChange = (value, option) => {
    setUnidadApoyo(value);
    console.log(option);
    setNombreUnidad(option.children);
    if (value) {
      getSecretario(value);
    } else {
      setSecretario(null);
    }
    setCambiosRealizados(true);
  };

  const handleIncluirHistorialChange = (e) => {
    setIncluirHistorial(e.target.checked);
    setCambiosRealizados(true);
  };

  const handleFileChange = (info) => {
    let newFileList = [...info.fileList];

    // Limitar a un solo archivo
    // Solo mostrar el último archivo subido, los anteriores son reemplazados
    newFileList = newFileList.slice(-1);

    // Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });
    setFileList(newFileList);
    setCambiosRealizados(true);
  };

  const handlePreview = () => {
    setPreviewVisible(true);
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    setIsModalVisible(false);
    await handleGuardarCambios(); // Llamar a la función de guardar cambios cuando el usuario confirme
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleGuardarCambios = async () => {
    if (estadoEditar === true) {
      handleEditarFichaDerivacion();
      return;
    }

    if (!unidadApoyo || !idCita || !alumno.idPersona || !motivo) {
      message.error("Por favor complete todos los campos requeridos.");
      return;
    }

    setFormDisabled(true);

    const formData = new FormData();
    formData.append("motivo", motivo);
    formData.append("sugerencias", sugerencias);
    formData.append("historialAcademico", incluirHistorial);
    formData.append("estado", "Pendiente");
    formData.append("idUnidadApoyo", unidadApoyo);
    formData.append("idCita", idCita);
    formData.append("idAlumno", alumno.idPersona);

    if (fileList.length > 0) {
      formData.append("documentacion", fileList[0].originFileObj);
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        `/fichaDerivacionApi/crearFichaDerivacionDTO`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      console.log(response);
      message.success("Ficha de derivación creada exitosamente.");
      // Deshabilitar el formulario después de guardar
      router.push(
        `/tutor/citas/detalle/derivacion?alumno=${encodeURIComponent(JSON.stringify(alumno))}` +
          `&idCita=${idCita}` +
          `&idDerivacion=${response.data.id}`,
      );
    } catch (error) {
      console.error("Error al crear la ficha de derivación:", error);
      message.error("Error al crear la ficha de derivación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditarFichaDerivacion = async () => {
    if (!unidadApoyo || !idCita || !alumno.idPersona || !motivo) {
      message.error("Por favor complete todos los campos requeridos.");
      return;
    }

    setFormDisabled(true);

    const formData = new FormData();
    formData.append("id", idDerivacion);
    formData.append("motivo", motivo);
    formData.append("sugerencias", sugerencias);
    formData.append("historialAcademico", incluirHistorial);
    formData.append("idUnidadApoyo", unidadApoyo);

    if (fileList.length > 0) {
      formData.append("documentacion", fileList[0].originFileObj);
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        `/fichaDerivacionApi/actualizarFichaDerivacion`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      message.success("Ficha de derivación actualizada exitosamente.");
      // Deshabilitar el formulario después de guardar
      setFormDisabled(true);
    } catch (error) {
      console.error("Error al actualizar la ficha de derivación:", error);
      message.error("Error al actualizar la ficha de derivación.");
    } finally {
      setIsLoading(false);
    }

    setEstadoEditar(false);
  };

  const handleEliminar = async () => {
    Modal.confirm({
      title: "¿Está seguro de que desea eliminar esta ficha de derivación?",
      content: "Esta acción no se puede deshacer.",
      okText: "Eliminar",
      okType: "danger",
      cancelText: "Cancelar",
      centered: true,
      onOk: async () => {
        setIsLoading(true);
        try {
          await axios.put(
            `/fichaDerivacionApi/borrarFichaDerivacion/${idDerivacion}`,
          );
          message.success("Solicitud de derivación eliminada exitosamente.");
          router.push(
            `/tutor/citas/detalle?cita=${encodeURIComponent(JSON.stringify(dataCita))}`,
          );
        } catch (error) {
          console.error("Error al eliminar la ficha de derivación", error);
          message.error(
            "Error al eliminar la ficha de derivación. Pruebe recargando la página",
          );
        } finally {
          setIsLoading(false);
        }
      },
    });
  };

  const handleGenerarFichaDerivacion = () => {
    // Lógica para la nueva acción
    message.info("Se ha descargado la ficha de derivación.");
    // Implementa aquí la lógica adicional que desees
  };

  const handleRegresar = () => {
    if (cambiosRealizados === false || formDisabled === true) {
      router.push(
        `/tutor/citas/detalle?cita=${encodeURIComponent(JSON.stringify(dataCita))}`,
      );
    } else {
      Modal.confirm({
        title: "¿Está seguro de que desea salir?",
        content:
          "Si sale ahora, perderá los cambios realizados en el formulario.",
        okText: "Salir",
        cancelText: "Cancelar",
        centered: true,
        onOk: () => {
          router.back();
        },
      });
    }
    // Navega a la página anterior
  };

  const handleComenzarEditar = () => {
    setEstadoEditar(!estadoEditar);
    setFormDisabled(estadoEditar);
  };

  const props = {
    onChange: handleFileChange,
    multiple: false,
    beforeUpload: (file) => {
      const isPdf = file.type === "application/pdf";
      if (!isPdf) {
        message.error("Solo se permite subir archivos PDF.");
      }
      return isPdf || Upload.LIST_IGNORE;
    },
    disabled: formDisabled, // Deshabilitar el Upload cuando el formulario está deshabilitado
  };

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={tutorItems}>
        <Title style={{ color: "#043B71" }}>Derivación</Title>
        <Row gutter={[16, 16]} style={{ width: "100%" }}>
          <Col xs={24} md={12}>
            <Title level={4}>Datos del derivado</Title>
            <CardCitaAlumno
              usuario={alumno}
              isLoading={isLoading}
              mostrarBotones={false}
            />
          </Col>
          <Col xs={24} md={12}>
            <Title level={4}>Deriva</Title>
            <CardTutorDerivacion
              tutor={tutor}
              especialidades={especialidades}
              isLoading={isLoading}
            />
          </Col>
        </Row>
        <Divider />
          <Row>
            <Col span={24}>
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
            <Col>
              <Title level={2} style={{ color: "#043B71" }}>Ficha de derivación</Title>
            </Col>
            <Col>
              <Button 
                type={!estadoEditar ? "primary": "default"}
                icon={estadoEditar ? <CloseOutlined /> : <EditOutlined />} 
                style={{ marginRight: 10 }} 
                onClick={handleComenzarEditar}
                disabled = {estado !== "Pendiente"}
              />
              <Button
                danger
                icon={<DeleteOutlined />} 
                onClick={handleEliminar} 
                disabled={estadoEditar || estado !== "Pendiente"} 
              />
            </Col>
          </Row>
          <Paragraph>La solicitud se encuentra en estado {estado}</Paragraph>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
                  Ingrese el motivo de derivación
                </Title>
                <TextArea
                  rows={4}
                  value={motivo}
                  onChange={handleMotivoChange}
                  placeholder="Se deriva al alumno porque..."
                  style={{ resize: "none" }}
                  disabled={formDisabled} // Deshabilitar el TextArea cuando el formulario está deshabilitado
                  maxLength={400}
                  showCount
                />
                <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
                  Documentación adicional (Opcional)
                </Title>
                <Checkbox
                  checked={incluirHistorial}
                  onChange={handleIncluirHistorialChange}
                  disabled={formDisabled} // Deshabilitar el Checkbox cuando el formulario está deshabilitado
                >
                  Incluir Historial Académico
                </Checkbox>
                <div style={{ marginTop: 16 }}>
                  <Upload {...props} fileList={fileList}>
                    <Button icon={<UploadOutlined />} disabled={formDisabled}>
                      Subir archivo
                    </Button>
                  </Upload>
                </div>
                {fileList.length > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <Button type="link" onClick={handlePreview}>
                      Ver documento subido
                    </Button>
                    <Modal
                      visible={previewVisible}
                      title="Documento subido"
                      footer={null}
                      onCancel={handlePreviewCancel}
                      width="80%"
                    >
                      <iframe
                        src={URL.createObjectURL(fileList[0].originFileObj)}
                        style={{ width: "100%", height: "80vh" }}
                        frameBorder="0"
                      />
                    </Modal>
                  </div>
                )}
              </Col>
              <Col xs={24} md={12}>
                <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
                  Unidad de apoyo
                </Title>
                <UnidadApoyoSelect
                  value={unidadApoyo}
                  onChange={(value, option) =>
                    handleUnidadApoyoChange(value, option)
                  }
                  disabled={formDisabled}
                />
                {unidadApoyo && secretario && (
                  <div style={{ marginTop: 16 }}>
                    <CardSecretario
                      secretario={secretario}
                      isLoading={isLoading}
                    />
                  </div>
                )}
                <Title level={3} style={{ color: "#043B71", marginTop: 10 }}>
                  Sugerencias
                </Title>
                <TextArea
                  rows={4}
                  value={sugerencias}
                  onChange={handleSugerenciasChange}
                  placeholder="Ingrese sugerencias para la unidad de apoyo a la que deriva"
                  style={{ resize: "none" }}
                  disabled={formDisabled} // Deshabilitar el TextArea cuando el formulario está deshabilitado
                  maxLength={400}
                  showCount
                />
              </Col>
            </Row>
          </Col>
        </Row>
        <Divider />
        <Row justify="end" gutter={[16, 16]}>
          <Col>
            <Button onClick={handleRegresar}>Regresar</Button>
          </Col>
          <Col>
            <Button type="primary" onClick={showModal} disabled={formDisabled}>
              Guardar
            </Button>
          </Col>
        </Row>
        <Modal
          title={
            estadoEditar ? "Confirmar actualización" : "Confirmar registro"
          }
          visible={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          okText="Confirmar"
          cancelText="Cancelar"
          centered
        >
          <p>
            {estadoEditar
              ? "¿Está seguro de que desea guardar los cambios realizados a la solicitud?"
              : "¿Está seguro de que desea registrar esta solicitud de derivación?"}
          </p>
          <Typography.Text type="secondary">
            Verifique que los datos ingresados sean los correctos. No se podrán
            realizar modificaciones a la solicitud una vez registrada.
          </Typography.Text>
        </Modal>
      </LayoutComponent>
    </main>
  );
}

function DerivacionWrapper() {
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
      <Derivacion />
    </Suspense>
  );
}

export default DerivacionWrapper;
