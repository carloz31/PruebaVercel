"use client";
//prueba
import LayoutComponent from "@/components/LayoutComponent";
import React, { useEffect, useState, Suspense } from "react";
import { Upload, Button, Typography, Divider, Spin, Row, Col, Input, Checkbox, message, Modal, Dropdown, Menu } from "antd";
import axios from '@/utils/axiosConfig';
import { useSearchParams, useRouter } from 'next/navigation';
import { coordinadorItems } from "@/utils/menuItems";
import CardCitaAlumno from "@/components/cards/cardCitaAlumno";
import CardTutorDerivacion from "@/components/cards/cardTutorDerivacion";
import UnidadApoyoSelect from "@/components/UnidadApoyoSelect";
import CardSecretario from "@/components/cards/cardSecretario";
import {
  UploadOutlined,
  InfoCircleOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  ClockCircleFilled,
  FileOutlined,
} from "@ant-design/icons";
import { tutorBreadcrumbNames } from "@/utils/breadcrumbNames";
import dynamic from "next/dynamic";
import FormatoDerivacion from "@/components/FormatoDerivacion";
import CardSolicitud from "@/components/cards/cardSolicitudExpandida";
import { useUser } from "@/context/UserContext";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((pkg) => pkg.PDFDownloadLink),
  {
    ssr: false,
  },
);

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

function Solicitud() {
  const [isLoading, setIsLoading] = useState(true);
  const [idTutor, setIdTutor] = useState();
  const [idAlumno, setIdAlumno] = useState();
  const [tutor, setTutor] = useState(null);
  const [alumno, setAlumno] = useState(null);
  const [solicitud, setSolicitud] = useState(null);
  const [idFichaDerivacion, setIdFichaDerivacion] = useState();
  const [fichaDerivacion, setFichaDerivacion] = useState(null);
  const [especialidades, setEspecialidades] = useState([]);
  const [secretario, setSecretario] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [documentosBuscados, setDocumentosBuscados] = useState(false);
  const [estado, setEstado] = useState();
  const [accion, setAccion] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [fichaGenerada, setFichaGenerada] = useState(null);
  const [respuestaModalVisible, setRespuestaModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [solicitudesEnProceso, setSolicitudesEnProceso] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();


  const decodeSolicitud = async () => {
    try {
      const solicitudDecodificada = JSON.parse(searchParams.get("solicitud"));
      setSolicitud(solicitudDecodificada);
    } catch (error) {
      console.error(
        "No se obtuvo correctamente la información de  la solicitud",
        error,
      );
    }
  };

  useEffect(() => {
    if (user && user.id) {
      decodeSolicitud();
    }
  }, [user]);

  const separarInformacion = () => {
    try {
      setIdTutor(solicitud?.tutor?.id);
      setIdAlumno(solicitud?.alumno?.id);
      setIdFichaDerivacion(solicitud?.fichaDerivacion?.id);
    } catch (error) {
      console.error("Error al separar la información", error);
    }
  };

  useEffect(() => {
    if (solicitud != null) {
      separarInformacion();
      getSecretario(solicitud?.fichaDerivacion?.unidadApoyo?.id);
    }
  }, [solicitud]);

  const obtenerAlumno = async () => {
    try {
      const response = await axios.get(
        `/alumnoApi/buscarUsuarioAlumnoPorIdPersona/${idAlumno}`,
      );
      const data = {
        idUsuario: response.data?.id,
        foto: response.data?.foto,
        codigo: response.data?.codigo,
        correo: response.data?.correo,
        id: response.data?.persona?.id,
        firstName: response.data?.persona?.nombre,
        lastName: response.data?.persona?.apellidoPaterno,
        lastName2: response.data?.persona?.apellidoMaterno,
        especialidad: response.data?.persona?.especialidad?.nombre,
        idAlumno: response.data?.persona?.id,
        telefono: response.data?.persona?.telefono,
      };
      setAlumno(data);
    } catch (error) {
      console.error("Error al obtener el alumno", error);
    }
  };

  useEffect(() => {
    if (idAlumno != null) {
      obtenerAlumno();
    }
  }, [idAlumno]);

  const obtenerSolicitudesEnProceso = async () => {
    try {
      const response = await axios.get(
        `/fichaDerivacionApi/listarFichasDerivacionEnProcesoDeAlumnoUnidad/${idAlumno}/${solicitud?.fichaDerivacion?.unidadApoyo?.id}`,
      );
      setSolicitudesEnProceso(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error al obtener las solicitudes en proceso", error);
    }
  };

  useEffect(() => {
    if (idAlumno !== null && solicitud !== null) {
      obtenerSolicitudesEnProceso();
    }
  }, [idAlumno, solicitud]);

  const obtenerTutor = async () => {
    try {
      const response = await axios.get(
        `/tutorApi/buscarUsuarioTutorPorIdPersona/${idTutor}`,
      );
      setTutor(response.data);
    } catch (error) {
      console.error("Error al obtener el tutor", error);
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
    }
  };

  const getEspecialidades = async () => {
    try {
      const responseEspecialidades = await axios.get(
        `/especialidadApi/listarEspecialidadesPorIdTutor/${idTutor}`,
      );
      setEspecialidades(responseEspecialidades.data);
    } catch (error) {
      console.error("Error fetching especialidades:", error);
    }
  };

  useEffect(() => {
    if (idTutor != null) {
      obtenerTutor();
      getEspecialidades();
    }
  }, [idTutor]);

  const obtenerFichaDerivacion = async () => {
    try {
      const response = await axios.get(
        `/fichaDerivacionApi/buscarFichaDerivacionPorId/${idFichaDerivacion}`,
      );
      setFichaDerivacion(response.data);
      setEstado(response.data.estado);

      const newFileList = [];

      //busca documentacion
      const responseDoc = await axios.get(
        `/fichaDerivacionApi/obtenerDocumentacion/${idFichaDerivacion}`,
        {
          responseType: "blob",
        },
      );

      if (responseDoc.status === 200 && responseDoc.data.size > 0) {
        const blob1 = new Blob([responseDoc.data], { type: "application/pdf" });
        newFileList.push({
          uid: (newFileList.length + 1).toString(),
          name: "documentacion.pdf",
          status: "done",
          originFileObj: blob1,
        });
      }

      if (response.data.historialAcademico === true) {
        //busca historial academico
        console.log("hola");
        const responseHist = await axios.get(
          `/alumnoApi/descargarHistorialAcademico/${idAlumno}`,
          {
            responseType: "blob",
          },
        );
        if (responseHist.status === 200 && responseHist.data.size > 0) {
          const blob2 = new Blob([responseHist.data], {
            type: "application/pdf",
          });
          newFileList.push({
            uid: (newFileList.length + 1).toString(),
            name: "historial.pdf",
            status: "done",
            originFileObj: blob2,
          });
        }
      }

      setDocumentosBuscados(true);
      setFileList(newFileList);
    } catch (error) {
      console.error(
        "Error al obtener la ficha de derivación y documentos",
        error,
      );
    }
  };

  useEffect(() => {
    if (idFichaDerivacion != null) {
      obtenerFichaDerivacion();
    }
  }, [idFichaDerivacion, idAlumno]);

  useEffect(() => {
    if (
      fichaDerivacion != null &&
      tutor != null &&
      alumno != null &&
      secretario != null &&
      documentosBuscados === true
    ) {
      setIsLoading(false);
    }
    console.log(fileList);
  }, [fichaDerivacion, tutor, alumno, documentosBuscados]);

  const handleBack = () => {
    router.push('/coordinador/derivaciones'); 
    //router.replace(router.asPath);
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleAccion = async () => {
    try {
      let endpoint;
      switch (accion) {
        case "aprobar":
          endpoint = `/fichaDerivacionApi/aprobarSolicitudDerivacion/${idFichaDerivacion}`;
          //guardar ficha derivación generada
          const pdfBlob = await generarPDFBlob();
          console.log();

          // Crear un FormData para enviar el blob al backend
          const formData = new FormData();
          formData.append(
            "pdf",
            pdfBlob,
            `ficha_de_derivacion_${alumno?.codigo}.pdf`,
          );

          // Enviar el blob al backend
          await axios.put(
            `/fichaDerivacionApi/subirFichaGenerada/${idFichaDerivacion}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );
          break;
        case "rechazar":
          endpoint = `/fichaDerivacionApi/rechazarSolicitudDerivacion/${idFichaDerivacion}`;
          break;
        case "aceptar":
          endpoint = `/fichaDerivacionApi/aceptarSolicitudDerivacion/${idFichaDerivacion}`;
          break;
        case "finalizar":
          endpoint = `/fichaDerivacionApi/finalizarDerivacion/${idFichaDerivacion}`;
          break;
        default:
          throw new Error("Acción no válida");
      }

      const response = await axios.put(endpoint);
      if (response.status === 200) {
        setConfirmModalVisible(false);
        setModalVisible(true);
        message.success("Se ha realizado la actualización correctamente");
      }
    } catch (error) {
      console.error(`Error al ${accion} la solicitud de derivación`, error);
      message.error(`Error al ${accion} la solicitud de derivación`);
    }
  };

  const handleRegistrarRespuesta = () => {};

  const getTitulo = () => {
    switch (accion) {
      case "aprobar":
        return "Aprobación de solicitud de derivación";
      case "rechazar":
        return "Rechazo de solicitud de derivación";
      case "aceptar":
        return "Aceptación de solicitud de derivación";
      case "finalizar":
        return "Finalización de derivación";
    }
  };

  const getMensajeConfirmar = () => {
    switch (accion) {
      case "aprobar":
        return "¿Está seguro que desea aprobar la solicitud de derivación?";
      case "rechazar": {
        if (estado === "Pendiente")
          return "¿Está seguro que desea rechazar la solicitud de derivación?";
        else
          return "¿Está seguro que desea registrar el rechazo de la solicitud de derivación?";
      }
      case "aceptar":
        return "¿Está seguro que desea registrar la aceptación de la solicitud de derivación?";
      case "finalizar":
        return "¿Está seguro que desea dar por concluida la derivación?";
    }
  };

  const getMensajeExito = () => {
    switch (accion) {
      case "aprobar":
        return "La solicitud de derivación ha sido aprobada exitosamente. Enviar un correo al secretario con la ficha de derivación y la documentación adicional adjuntada";
      case "rechazar":
        return "La solicitud de derivación ha sido rechazada. Vuelva a generar una nueva solicitud si es necesario";
      case "aceptar":
        return "Se ha registrado la aceptación de la solicitud de derivación por parte de la unidad de apoyo";
      case "finalizar":
        return "La derivación del alumno a la unidad de apoyo ha sido dada por concluida. Ahora puede realizar una nueva solicitud de derivación para el estudiante a esta unidad";
    }
  };

  const generarPDFBlob = () => {
    return new Promise((resolve, reject) => {
      const { pdf } = require("@react-pdf/renderer");
      const MyDocument = (
        <FormatoDerivacion
          fecha={new Date().toLocaleDateString()}
          hora={new Date().toLocaleTimeString()}
          codigoAlumno={alumno?.codigo}
          nombreAlumno={
            alumno?.firstName + " " + alumno?.lastName + " " + alumno?.lastName2
          }
          celular={alumno?.telefono}
          correoAlumno={alumno?.correo}
          derivadoPor={
            tutor?.persona?.nombre +
            " " +
            tutor?.persona?.apellidoPaterno +
            " " +
            tutor?.persona?.apellidoMaterno
          }
          cargo={"Tutor"}
          correoTutor={tutor?.correo}
          unidadTutor={
            especialidades?.length > 0
              ? especialidades[0]?.facultad.nombre
              : "No registrado"
          }
          unidadDerivada={fichaDerivacion?.unidadApoyo?.nombre}
          motivo={fichaDerivacion?.motivo}
          antecedentes={
            fileList.length > 0
              ? "Se adjunta documentación adicional."
              : "No se adjunta documentación adicional."
          }
          comentarios={fichaDerivacion?.sugerencias}
        />
      );

      pdf(MyDocument)
        .toBlob()
        .then((blob) => resolve(blob))
        .catch((error) => reject(error));
    });
  };

  const menu = (
    <Menu
      onClick={(e) => {
        setAccion(e.key);
        setConfirmModalVisible(true);
      }}
    >
      <Menu.Item key="aceptar">Registrar derivación</Menu.Item>
      <Menu.Item key="rechazar">Rechazar derivación</Menu.Item>
    </Menu>
  );

  return (
    <main style={{ height: "100vh" }}>
      <LayoutComponent siderItems={coordinadorItems} breadcrumbNames={tutorBreadcrumbNames}>
        {isLoading ? (
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
        ) : (
          <>
            <Row justify="space-between" align="middle">
              <Col>
                <Title style={{ color: "#043B71" }}>
                  Solicitud de Derivación
                </Title>
              </Col>
              <Col>
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={handleBack}
                  style={{
                    backgroundColor: "lightgray",
                    borderColor: "lightgray",
                    color: "black",
                    marginRight: "25px",
                  }}
                >
                  Regresar
                </Button>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ width: "100%" }}>
              <Col xs={24} md={12}>
                <Title level={3} style={{ color: "#043B71" }}>
                  Detalle de la solicitud
                </Title>
                <CardSolicitud
                  solicitud={solicitud}
                  fichaDerivacion={fichaDerivacion}
                  secretario={secretario}
                  isLoading={isLoading}
                  archivos={fileList}
                />
              </Col>
              <Col xs={24} md={12}>
                <Row gutter={[16, 16]} style={{ width: "100%" }}>
                  <Title level={3} style={{ color: "#043B71" }}>
                    Datos del derivado
                  </Title>
                  <CardCitaAlumno
                    usuario={alumno}
                    isLoading={isLoading}
                    mostrarBotones={false}
                    style={{ width: "100%" }}
                  />
                </Row>
                <Row gutter={[16, 16]} style={{ width: "100%", marginTop: 20 }}>
                  <Title level={3} style={{ color: "#043B71" }}>
                    Derivado por
                  </Title>
                  <CardTutorDerivacion
                    tutor={tutor?.persona}
                    especialidades={especialidades}
                    isLoading={isLoading}
                  />
                </Row>
                <Row gutter={[16, 16]} style={{ width: "100%", marginTop: 30 }}>
                  <Col xs={24} md={12} style={{ paddingRight: 10 }}>
                    {estado === "Pendiente" && (
                      <Button
                        icon={<CheckOutlined />}
                        block
                        type="primary"
                        style={{
                          backgroundColor: "#33BB55",
                          borderColor: "#33BB55",
                          marginRight: 10,
                        }}
                        onClick={() => {
                          setAccion("aprobar");
                          setConfirmModalVisible(true);
                        }}
                      >
                        Aceptar Solicitud
                      </Button>
                    )}
                    {estado === "Aprobada" && (
                      <Dropdown overlay={menu}>
                        <Button
                          block
                          type="primary"
                          style={{ marginRight: 10 }}
                        >
                          Registrar Respuesta
                        </Button>
                      </Dropdown>
                    )}
                    {estado === "Aceptada" && (
                      <Button
                        icon={<ClockCircleFilled />}
                        block
                        type="primary"
                        style={{ marginRight: 10 }}
                        onClick={() => {
                          setAccion("finalizar");
                          setConfirmModalVisible(true);
                        }}
                      >
                        Finalizar Derivacion
                      </Button>
                    )}
                  </Col>
                  <Col xs={24} md={12} style={{ paddingLeft: 10 }}>
                    {estado === "Pendiente" && (
                      <Button
                        icon={<CloseOutlined />}
                        block
                        type="primary"
                        danger
                        onClick={() => {
                          setAccion("rechazar");
                          setConfirmModalVisible(true);
                        }}
                      >
                        Rechazar Solicitud
                      </Button>
                    )}
                    {(estado === "Aprobada" ||
                      estado === "Aceptada" ||
                      estado == "Finalizada") && (
                      <PDFDownloadLink
                        document={
                          <FormatoDerivacion
                            fecha={new Date().toLocaleDateString()}
                            hora={new Date().toLocaleTimeString()}
                            codigoAlumno={alumno?.codigo}
                            nombreAlumno={
                              alumno?.firstName +
                              " " +
                              alumno?.lastName +
                              " " +
                              alumno?.lastName2
                            }
                            celular={alumno?.telefono}
                            correoAlumno={alumno?.correo}
                            derivadoPor={
                              tutor?.persona?.nombre +
                              " " +
                              tutor?.persona?.apellidoPaterno +
                              " " +
                              tutor?.persona?.apellidoMaterno
                            }
                            cargo={"Tutor"}
                            correoTutor={tutor?.correo}
                            unidadTutor={
                              especialidades?.length > 0
                                ? especialidades[0]?.facultad.nombre
                                : "No registrado"
                            }
                            unidadDerivada={
                              fichaDerivacion?.unidadApoyo?.nombre
                            }
                            motivo={fichaDerivacion?.motivo}
                            antecedentes={
                              fileList.length > 0
                                ? "Se adjunta documentación adicional."
                                : "No se adjunta documentación adicional."
                            }
                            comentarios={fichaDerivacion?.sugerencias}
                          />
                        }
                        fileName={`ficha_de_derivacion_${alumno?.codigo}.pdf`}
                      >
                        {({ blob, url, loading, error }) =>
                          loading ? (
                            "Generando PDF..."
                          ) : (
                            <Button
                              icon={<FileOutlined />}
                              block
                              type="primary"
                              style={{
                                backgroundColor: "#ffffff",
                                borderColor: "#000000",
                                marginRight: 10,
                                color: "black",
                              }}
                            >
                              Generar Ficha de Derivacion
                            </Button>
                          )
                        }
                      </PDFDownloadLink>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <Modal
              centered
              visible={confirmModalVisible}
              title={getTitulo()}
              onCancel={() => setConfirmModalVisible(false)}
              footer={[
                <Button
                  key="Cancelar"
                  onClick={() => setConfirmModalVisible(false)}
                >
                  Cancelar
                </Button>,
                <Button
                  key="Confirmar"
                  type="primary"
                  onClick={() => handleAccion(accion)}
                >
                  Confirmar
                </Button>,
              ]}
            >
              <p>{getMensajeConfirmar()}</p>
            </Modal>
            <Modal
              centered
              visible={modalVisible}
              title="Operación exitosa"
              footer={[
                <Button
                  key="Volver"
                  type="primary"
                  onClick={() => {
                    setModalVisible(false);
                    handleRefresh();
                  }}
                >
                  Volver
                </Button>,
              ]}
              onCancel={() => setModalVisible(false)}
            >
              <p> {getMensajeExito()} </p>
            </Modal>
          </>
        )}
      </LayoutComponent>
    </main>
  );
}

function SolicitudWrapper() {
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
      <Solicitud />
    </Suspense>
  );
}

export default SolicitudWrapper;
